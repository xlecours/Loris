<?php

require_once __DIR__ . "/../vendor/autoload.php";
$configFile = __DIR__."/../project/config.xml";
$client     = new NDB_Client();
$client->makeCommandLine();
$client->initialize($configFile);

$filename = $argv[1];

try {
    $launcher = new LegoPhantomPipelineLauncher(
        $filename,
        'loris_ccna',
        'PhantomProc_09',
        'AceLab-VH-2'
    );
    $task = $launcher->launch();
    fprintf(STDOUT, '%s#%s created', $task->getType(), $task->getId());
} catch (\Runtimeexception $e) {
    fwrite(STDERR, $e->getMessage());
    exit(1);
}

