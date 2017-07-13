<?php
/**
 * This provide the GenomicBrowser content data of the dataset tab
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

$couch = \NDB_Factory::singleton()->couchDB();
$couch->setDatabase('test_epi');

$params = array('reduce' => 'false');
$result = $couch->queryView('genomic_browser', 'datasets', $params, false);

header("content-type:application/json");
ini_set('default_charset', 'utf-8');
echo json_encode($result);
exit;
