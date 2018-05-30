<?php

namespace LORIS\server_processes_manager;

$user = \NDB_Factory::singleton()->user();

if (!$user->hasPermission('server_processes_manager')) {
    header("HTTP/1.1 403 Forbidden");
    exit;
}

$userfileId = $_REQUEST['userfileId'] ?? null;
if (empty($userfileId)) {
    header('HTTP/1.0 400 Bad Request');
    exit;
}

$spm_module            = \Module::factory('server_processes_manager');
$serverProcessLauncher = new ServerProcessLauncher();

try {
    $serverProcessLauncher->phantomPipeline(
        $userfileId,
        '/var/www/loris_1/project/tools/phantom_pipeline.php'
    );
    header('HTTP/1.0 201 Created');
} catch (\Exception $e) {
    error_log($e->getMessage());
    header('HTTP/1.0 500 Internal Server Error');
    exit;
}
