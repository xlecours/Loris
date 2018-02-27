<?php
namespace LORIS\server_processes_manager;

use \LORIS\ToolDescriptors\ToolDescriptor;

class LSLauncher
{
    private $serverProcessLauncher;

    public function __construct(string $path)
    {
        $this->path = $path;
        $this->serverProcessLauncher = new ServerProcessLauncher();
    }

    public function launch()
    {
        $descriptor = new ToolDescriptor();
        $this->serverProcessLauncher->lorisInternal(
            (new ToolDescriptor())->withCommandline('ls')
        );
    }
}

$ls = new LSLauncher(__DIR__);
$ls->launch();
