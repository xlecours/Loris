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

$results = $cdb->queryView(
    "DQG-2.0",
    'savedqueries',
    array(
        'reduce' => 'false',
        'include_docs' => 'true'
    ),
    true
);


//print json_encode($results);
print $results;
?>
