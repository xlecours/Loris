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

if(empty($_REQUEST['variable_type']) ) {
    header("HTTP/1.1 400 Bad Request");
    exit;
}

$variable_type = $_REQUEST['variable_type'];

$couch = CouchDB::singleton();
$couch->setDatabase('test_epi');

$dataset_sample_list = [];
// Get the genomic_file_ids
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

$data = [];

// Get the variable properties 
// limit 1000 variables
foreach ($genomic_file_ids as $genomic_file_id) {
    // Get the samples_index from that dataset
    $params = array(
        'reduce'      => 'false',
        'key'     => "[\"$variable_type\",\"$genomic_file_id\"]",
    );
    $result = $couch->queryView('genomic_browser', 'sample_label_by_dataset', $params, false);
    $sample_labels = $result[0]['value'];
        
    // Get the sample_label-pscid mapping from mysql
    $mysql = Database::singleton();
    $result = $mysql->pselect(
        'SELECT 
            gscr.sample_label,
            c.PSCID
         FROM 
            genomic_sample_candidate_rel gscr 
         LEFT JOIN candidate c 
            USING (CandID)
         WHERE 
            FIND_IN_SET( gscr.sample_label, :v_sample_labels )',
        array(
            'v_sample_labels' => implode(",",$sample_labels)
        )
    );
    $sample_pscid_mapping = array_reduce($result, function($carry, $row) {
        $carry[$row['sample_label']] = $row['PSCID'];
        return $carry;
    }, array());

    // get the variable and their properties
    $params = array(
        'reduce'      => 'false',
        'start_key'   => "[\"$variable_type\",\"$genomic_file_id\"]",
        'end_key'     => "[\"$variable_type\",\"$genomic_file_id\",{}]",
        'limit'       => '1000',
    );
    $result = $couch->queryView('genomic_browser', 'variable_property_by_identifier', $params, false);
    $variables = array_reduce($result, function($carry, $item){
        $carry[$item['id']] = $item['value'];
        return $carry;
    },array());

    // get the value of each variable from each sample
    foreach ($variables as $key => $props) {
        $doc_identifier = str_replace('-','","',$key); 
        $params = array(
            'reduce'    => 'false',
            'start_key' => "[\"$doc_identifier\"]",
            'end_key'   => "[\"$doc_identifier\", {}]",
        );
        $result = $couch->queryView('genomic_browser', 'variable_value_by_identifier', $params, false);
        foreach ($result as $row) {
            $sample_label = $sample_labels[$row['key'][2]];
            $pscid        = $sample_pscid_mapping[$sample_label];
 
            array_push($data, array(
                'variable_name' => $row['key'][1],
                'sample_label'  => $sample_label,
                'pscid'         => $pscid,
                'value'         => $row['value'], 
            ));
        }
    }
}
// TODO :: create the headers
$output = array_map(function($item) {
    // TODO :: remove the mapping and order the data rows
return $item;}, $data);

header("content-type:application/json");
ini_set('default_charset', 'utf-8');
echo json_encode($output);
exit;
