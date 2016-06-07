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


$genomic_range = preg_split('/[:-]+/', $_REQUEST['genomic_range']);
$chromosome = $genomic_range[0];
$start_loc = $genomic_range[1];
$end_loc = $genomic_range[2];

$startkey = [$_REQUEST['dataset_id'], $chromosome, $start_loc];
$endkey = [$_REQUEST['dataset_id'], $chromosome, $end_loc];

$options = array('PSCIDs' => $_REQUEST['pscids']);
    // Return a preview of the query (first and last 5 lines)

$first_five_lines = $cdb->queryList(
    'genomic_browser',
    'first',
    'betavalue_by_genomic_location',
    array(
        'PSCIDs' => $_REQUEST['pscids'],
        'startkey' => $startkey,
        'endkey' => $endkey,
        'limit' => 5,
        'descending' => "false"
    ),
    true
);

$last_five_lines = $cdb->queryList(
    'genomic_browser',
    'first',
    'betavalue_by_genomic_location',
    array(
        'PSCIDs' => $_REQUEST['pscids'],
        'startkey' => $endkey,
        'endkey' => $startkey,
        'limit' => 5,
        'descending' => "true"
    ),
    true
);

// Remove the headers of the second query
$last_five_lines = preg_split('/[\n]/', $last_five_lines, 2)[1];
$results = $first_five_lines . $last_five_lines;
//print json_encode($results);
print $results;
?>
