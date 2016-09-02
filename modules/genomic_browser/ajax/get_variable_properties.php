<?php
/**
 * This provide the GenomicBrowser content data of the variable tab
 * Filters will be applyied to the list/view of CouchDB
 *
 * PHP Version 5
 *
 *  @category   Loris
 *  @package    Genomic_Module
 *  @author     Loris Team <loris.mni@bic.mni.mcgill.ca>
 *  @contriutor Xavier Lecours boucher <xavier.lecoursboucher@mcgill.ca>
 *  @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 *  @link       https://github.com/aces/Loris
 */

$userSingleton =& User::singleton();
if (!$userSingleton->hasPermission('genomic_browser_view_site')
    && !$userSingleton->hasPermission('genomic_browser_view_allsites')
) {
    header("HTTP/1.1 403 Forbidden");
    exit;
}

if(empty($_REQUEST['variable_type'])) {
    header("HTTP/1.1 400 Bad Request");
    exit;
}

$variable_type = $_REQUEST['variable_type'];

$couch = CouchDB::singleton();
$couch->setDatabase('test_epi');

$genomic_file_ids = [];
if(empty($_REQUEST['genomic_file_ids']) ) {
    $params = array(
        'reduce'      => 'true',
        'group_level' => '2',
        'start_key'   => "[\"$variable_type\"]",
        'end_key'     => "[\"$variable_type\",{}]",
    );
    $result = $couch->queryView('genomic_browser', 'sample_label_by_dataset', $params, false);
    $genomic_file_ids = array_map(function($row) {
        return $row['key'][1];
    }, $result);
} else {
    $param = json_decode($_REQUEST['genomic_file_ids']);
    $genomic_file_ids = is_array($param) ? $param : [$param];
}

$props = [];
foreach ($genomic_file_ids as $genomic_file_id) {

    $params = array(
        'reduce'    => 'false',
        'start_key' => "[\"$variable_type\",\"$genomic_file_id\"]",
        'end_key'   => "[\"$variable_type\",\"$genomic_file_id\",{}]",
    );
    $result = $couch->queryList('genomic_browser', 'distinct_value_keys', 'variable_property_by_identifier', $params, true);
    $props = array_merge($props, json_decode($result));
}

// Ensure uniqueness

header("content-type:application/json");
ini_set('default_charset', 'utf-8');
echo json_encode(array_unique($props));
exit;
