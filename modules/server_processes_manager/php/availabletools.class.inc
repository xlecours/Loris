<?php
namespace LORIS\server_processes_manager;

use \LORIS\ToolDescriptors\ToolDescriptor;

class AvailableTools extends \NDB_Page
{
    public $skipTemplate = true;

    /**
     * Determine whether the user has permission to view this page
     *
     * @return bool whether the user has access
     */
    public function _hasAccess()
    {
        $user = \User::singleton();
        return $user->hasPermission('server_processes_manager');
    }

    /**
     * Entry point
     *
     * @return none
     */
    public function setup()
    {
        $this->toolList = [
            (new ToolDescriptor())->withCommandLine('ls'),
            (new ToolDescriptor())->withCommandLine('ls -lrt'),
            (new ToolDescriptor())->withCommandLine('ifconfig'),
        ];
    }

    public function display(): string
    {
        $format = $_REQUEST['format'] ?? null;
        if ($format == 'json') {
            header('Content-type: application/json');
            return json_encode(array_map( function ($tool) {
                return $tool->serialize();
            }, $this->toolList), true);
        }
    }
}
