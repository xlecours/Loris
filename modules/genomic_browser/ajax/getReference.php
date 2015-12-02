<?php
/**
 * Opens a reference file or document used as part of the genomic module.
 * The file is only opened if the user is logged in has the 'epigenomic_full_data'
 * or 'epigenomic_restricted' permissions.
 * The file is printed as text.
 *
 * PHP Version 5
 *
 * @category Genomics
 * @package  Loris
 * @author   Xavier Lecours <xavierlb.mavan@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

set_include_path(get_include_path().":../project/libraries:../php/libraries:");
ini_set('default_charset', 'utf-8');

require_once __DIR__ . "/../../../vendor/autoload.php";

$user = User::singleton();

// Checks that config settings are set
$config = NDB_Config::singleton();
$paths  = $config->getSetting('paths');

// Basic config validation
$basePath = $paths['base'];
if (empty($basePath)) {
    error_log("ERROR: Config settings are missing");
    header("HTTP/1.1 500 Internal Server Error");
    exit(1);
}

$file = $_REQUEST['fileName'];
$fullPath = $basePath . "project/data/" . $file;

// Check that the user has epigenomics_data permission, or is an trainer
if (!$user->hasPermission('genomic_browser_view_site') &&
    !$user->hasPermission('genomic_browser_view_allsites') ) {
    error_log("ERROR: Permission denied for accessing $file");
    header('HTTP/1.1 403 Forbidden');
    exit(2);
}

// Make sure that the user isn't trying to break out of the $path by
// using a relative filename.
// No need to check for '/' since all downloads are relative to $basePath
if (strpos("..", $file) !== false) {
    error_log("ERROR: Invalid filename");
    header("HTTP/1.1 400 Bad Request");
    exit(3);
}

if (!file_exists($fullPath)) {
    error_log("ERROR: File $file does not exist");
    header("HTTP/1.1 404 Not Found");
    exit(4);
}

header("Content-Type: text/plain");
readfile($fullPath);
exit(0);
?>
