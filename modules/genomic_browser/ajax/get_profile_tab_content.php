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

$couch = CouchDB::singleton();
$couch->setDatabase('test_epi');
$params = array(
    'reduce' => 'false'
);
$result = $couch->queryView('genomic_browser', 'sample_label_by_dataset', $params, false);
$pscid_dataset_map = array();

foreach ($result as $row) {
    $dataset = array(
        'doc_id' => $row['id'],
        'AnalysisModality' => $row['key'][0],
        'GenomicFileID' => $row['key'][1]
    );
    foreach ($row['value'] as $sample_label) {
        $pscid = get_pscid_by_sample_label($sample_label);

        if (empty($pscid)) {
            $pscid = 'unknown';
        }
        
        if(empty($pscid_dataset_map[$pscid])) {        
            $pscid_dataset_map[$pscid] = array();
        }

        array_push($pscid_dataset_map[$pscid], array('sample_lable' => $sample_label, 'dataset' => $dataset));
    }
}

header('Content-Type: application/json; charset=UTF-8');
echo json_encode($pscid_dataset_map);
exit;

function get_pscid_by_sample_label($sample_label)
{
    $mysql = Database::singleton();
    return $mysql->pselectOne(
        'SELECT 
             c.PSCID 
         FROM 
             genomic_sample_candidate_rel gscr 
         LEFT JOIN candidate c 
             USING (CandID) 
         WHERE 
             gscr.sample_label = :v_sample_label', 
        array(
            'v_sample_label' => $sample_label
        )
    );
}
?>
