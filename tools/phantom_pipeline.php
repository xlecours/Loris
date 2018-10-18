<?php
require_once __DIR__ . "/../vendor/autoload.php";

$loris_client = new NDB_Client();
$loris_client->makeCommandLine();
$loris_client->initialize(__DIR__ . "/../project/config.xml");
$hook = \LORIS\CBRAIN_Hook::getInstance();

$tool = array_filter(
    $hook->getAvailableTools(),
    function ($t) {
        return $t->getDescription() == 'PhantomProc_09 0.9 on Graham';
    }
);

/*
*************
* Browse DP *
*************
*/
$newly_registered_userfiles_ids = [$argv[1]];

/*
*******************************
* Launch a task on this files *
*******************************
*/

// TODO :: use the hook to lauch a task
var_dump('Check todo!!!');
exit;

$apiInstance = new Swagger\Client\Api\TasksApi(
    null,
    $config
);

  $task_ids = [];

  $cbrain_task = new \Swagger\Client\Model\CbrainTask(); // \Swagger\Client\Model\CbrainTask | The task to create.
  $cbrain_task["tool_id"] = $tool->getId();;
  $cbrain_task["cbrain_task"] = array(
    "params"=>array("interface_userfile_ids"=>array($userfile_id), "file_collect"=>$userfile_id),
    "tool_config_id"=>"633",
    "results_data_provider_id"=>"129",
    "description"=>"Test in PHP with file: " . $userfile_id ,
    "user_id"=>"1",
    "group_id"=>"2");

  $tasks = $apiInstance->tasksPost($cbrain_task);

  foreach ($tasks as &$task) {
    array_push($task_ids, $task["id"]);
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
