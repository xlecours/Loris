<?php
require_once __DIR__ . "/../vendor/autoload.php";

$loris_client = new NDB_Client();
$loris_client->makeCommandLine();
$loris_client->initialize(__DIR__ . "/../project/config.xml");
$hook = \LORIS\CBRAIN_Hook::getInstance();

$userfile_id = $argv[1];

/**
 *
 * var_dump(array_filter($hook->getAvailableTools(), function ($t) {
 *     return $t->getDescription() == 'Phantom Pipeline with the proper image from Shawn'; 
 * }));
 */

/**
 * To find the dataprovider_id
 * var_dump($hook->getOutputDataProvider());
 */
$cbrain_task = (new \Swagger\Client\Model\CbrainTask())
    ->setToolId(91)
    ->setCbrainTask(array(
      'params' => array(
          'interface_userfile_ids' => array($userfile_id),
          'file_collect'           => $userfile_id 
      ),
      'tool_config_id'           => 924, //Phantom Pipeline with the proper image from Shawn
      'results_data_provider_id' => 129, // Test for Phantom Pipeline (output directories)
      'description'              => 'LORIS CBRAIN Hook test',
      'user_id'                  => 930,
      'group_id'                 => 3154
    ));

try {
    $task = $hook->launchTask($cbrain_task)[0]; // There should only be one task created
    echo "# CBRIAN task created.\n";
    echo "task_id=$task['id']\n";
    exit(0);
} catch (\Swagger\Client\ApiException $e) {
    fwrite(STDERR, $e->getMessage() . PHP_EOL);
    exit(1);
}

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
