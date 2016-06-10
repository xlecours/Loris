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

$results = $cdb->queryView(
    'genomic_browser',
    'samples_by_dataset',
    array(
        'reduce' => 'false',
    ),
    true
);


//print json_encode($results);
print $results;
?>
