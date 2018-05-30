<?php

require_once('/var/www/loris_1/vendor/SwaggerClient-php/vendor/autoload.php');

use \Swagger\Client\Configuration;
use \Swagger\Client\Api\SessionsApi;
use \Swagger\Client\Api\DataProvidersApi;

/*
* Set the config
*/
$config = new \Swagger\Client\Configuration();
$config->setHost('https://portal.cbrain.mcgill.ca/');

/*
* Create a session
*/
$session_api      = new \Swagger\Client\Api\SessionsApi(null,$config);
$rep_session_post = $session_api->sessionPost('loris_ccna','CCNA_pwd!123!');
$token            = $rep_session_post->getCbrainApiToken();
$config->setApiKey('cbrain_api_token', $token);

/*
*************
* Browse DP *
*************
*/
$apiInstance = new Swagger\Client\Api\DataProvidersApi(
    new GuzzleHttp\Client(),
    $config
);

/*
* Register the files on the DataProvider
*/
$id     = 117;
$dp_api = $apiInstance->dataProvidersIdBrowseGet($id);
$newly_registered_userfiles_ids = [$argv[1]];

/*
*******************************
* Launch a task on this files *
*******************************
*/

$apiInstance = new Swagger\Client\Api\TasksApi(
    new GuzzleHttp\Client(),
    $config
);

$task_ids = [];
foreach ($newly_registered_userfiles_ids as &$userfile_id) {
  $cbrain_task = new \Swagger\Client\Model\CbrainTask(); // \Swagger\Client\Model\CbrainTask | The task to create.
  $cbrain_task["tool_id"] = 91;
  $cbrain_task["cbrain_task"] = array(
    "params"=>array("interface_userfile_ids"=>array($userfile_id), "file_collect"=>$userfile_id),
    "tool_config_id"=>"633",
    "results_data_provider_id"=>"3",
    "description"=>"Test in PHP with file: " . $userfile_id ,
    "user_id"=>"1",
    "group_id"=>"2");
  $tasks = $apiInstance->tasksPost($cbrain_task);
  foreach ($tasks as &$task) {
    array_push($task_ids, $task["id"]);
  }
}

/*
******************************
* Monitoring of tasks status *
******************************
*/

$number_initial_task = sizeof($task_ids);

do {
  $remaining_tasks = $number_initial_task - sizeof($task_ids);
  echo '---- Check Tasks Status. ----' . PHP_EOL;
  echo "$remaining_tasks on $number_initial_task remaining tasks." . PHP_EOL;

  foreach ($task_ids as &$task_id) {
    $task   = $apiInstance->tasksIdGet($task_id);
    $status = $task["status"];

    echo date('r') . " :: TaskID: $task_id - Status: $status" . PHP_EOL;
    if ($status == "New" || $status == "Queued" || $status == "On CPU") {
      continue;
    }
    $task_ids = array_diff($task_ids, array($task_id));
  }
  sleep(120);
} while ( sizeof($task_ids) != 0);

echo "All done." . PHP_EOL;
