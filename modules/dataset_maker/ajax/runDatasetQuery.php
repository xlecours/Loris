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

$results = $cdb->queryList(
    'genomic_browser',
    'betavalue_by_sample_name',
    'betavalue_by_genomic_location',
    array(
        'PSCIDs' => $_REQUEST['pscids'],
        'startkey' => $startkey,
        'endkey' => $endkey,
    ),
    true
);

$filename = $dataset . '_' . $_REQUEST['genomic_range'] . '_' .  crc32($_REQUEST['pscids']);
$myfile = fopen("/data/loris/data/genomics/custom_datasets/$filename", "w");
fwrite($myfile, $results);
fclose($myfile);

//print json_encode($results);
print '{"ok": "done"}';
?>
