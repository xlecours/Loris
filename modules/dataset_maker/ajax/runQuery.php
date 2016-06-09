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

$fields = ($_REQUEST['fields']);
$conditions = ($_REQUEST['conditions']);

$results = $cdb->queryList(
    "genomic_browser",
    'dqt_search',
    'DQG-2.0/search',
    array(
        'reduce' => 'false',
        'fields' => $fields,
        'conditions' => $conditions
    ),
    true
);

print $results;
?>
