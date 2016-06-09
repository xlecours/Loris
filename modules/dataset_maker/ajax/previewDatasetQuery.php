<?php

$user =& User::singleton();
if ( !($user->hasPermission('dataquery_view') && ($user->hasPermission('genomic_browser_view_site') || $user->hasPermission('genomic_browser_view_allsites')) ) ) {
    header("HTTP/1.1 403 Forbidden");
    exit;
}

require_once __DIR__ . '/../../../vendor/autoload.php';
$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize(__DIR__ . "/../../../project/config.xml");


$cdb = CouchDB::singleton();
$cdb->setDatabase("epigenomics");

$dataset = $_REQUEST['dataset_id'];
$genomic_range = preg_split('/[:-]+/', $_REQUEST['genomic_range']);
$chromosome = $genomic_range[0];
$start_loc = intval($genomic_range[1]);
$end_loc = intval($genomic_range[2]);

$startkey = "[\"$dataset\",\"$chromosome\",$start_loc]";
$endkey = "[\"$dataset\",\"$chromosome\",$end_loc]";

$first_five_lines = $cdb->queryList(
    'genomic_browser',
    'betavalue_by_sample_name',
    'betavalue_by_genomic_location',
    array(
        'PSCIDs' => $_REQUEST['pscids'],
        'startkey' => $startkey,
        'endkey' => $endkey,
        'limit' => "5",
        'descending' => "false"
    ),
    true
);
// todo keep the last line and remove everything starting from that last line in the next query. (in case there is less than 10 results) 
$last_five_lines = $cdb->queryList(
    'genomic_browser',
    'betavalue_by_sample_name',
    'betavalue_by_genomic_location',
    array(
        'PSCIDs' => $_REQUEST['pscids'],
        'startkey' => $endkey,
        'endkey' => $startkey,
        'limit' => "5",
        'descending' => "true"
    ),
    true
);

// Remove the headers of the second query
$last_five_lines = preg_split('/[\n]/', $last_five_lines, 2)[1];
$results = $first_five_lines . "...\n" .  $last_five_lines;
//print json_encode($results);
print $results;
?>
