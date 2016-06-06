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

//http://localhost:5984/dqt/_design/genomic_browser/_list/dqt_search/DQG-2.0/search?reduce=false&fields=[%22meth,cg00001234%22,%22bmi,height_feet%22,%20%22bmi,height_inches%22,%20%22bmi,Candidate_Age%22,%20%22bmi,bmi_category%22,%20%22bmi,bmi%22,%20%22demographics,CandID%22,%20%22demographics,Gender%22]&conditions={%22Conditions%22:{%22activeOperator%22:%221%22,%22children%22:[{%22field%22:%22Administration%22,%22operator%22:%22notEqual%22,%22value%22:%22None%22,%22instrument%22:%22bmi%22,%22visit%22:%22All%22},{%22activeOperator%22:%221%22,%22children%22:[{%22activeOperator%22:%220%22,%22children%22:[{%22field%22:%22Gender%22,%22operator%22:%22equal%22,%22value%22:%22Female%22,%22instrument%22:%22demographics%22,%22visit%22:%22All%22}]},{%22activeOperator%22:%220%22,%22children%22:[{%22field%22:%22Gender%22,%22operator%22:%22equal%22,%22value%22:%22Male%22,%22instrument%22:%22demographics%22,%22visit%22:%22All%22}]}]}]}}

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
