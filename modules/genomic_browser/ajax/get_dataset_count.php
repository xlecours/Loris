<?php
/**
 * This provide the GenomicBrowser content data of the profile tab
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

if(empty($_REQUEST['CandID'])) {
    header("HTTP/1.1 400 Bad Request");
    exit;
}

$params = json_decode($_REQUEST['CandID']);
if (!is_array($params)) {
    $candidate_list = array($params);
} else {
    $candidate_list = $params;
}

$candidate_list = array_map(function ($CandID) {
    return  str_pad(strval($CandID), 6, "0", STR_PAD_LEFT);
}, $candidate_list); 

addSampleLabels($candidate_list);

exit;

$couch = CouchDB::singleton();
$couch->setDatabase('test_epi');
$params = array(
    'reduce' => 'true',
    'group_level' => 1,
    'samples' => $sample_labels,
);
$result = $couch->queryList('genomic_browser', '', 'sample_label_by_dataset', $params, false);

header("content-type:application/json");
ini_set('default_charset', 'utf-8');
echo json_encode($result);
exit;

function addSampleLabels(&$candidate_list)
{
    $DB = Database::singleton();
    $result =  $DB->pselect(
        'SELECT 
            CandID, 
            GROUP_CONCAT(sample_label) AS sample_labels
         FROM 
            genomic_sample_candidate_rel 
         WHERE 
            FIND_IN_SET(CandID, :v_candidates) 
         GROUP BY 
            CandID', 
         array('v_candidates' => join(',',$candidate_list))
    );

    var_dump($result);
}
