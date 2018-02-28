<?php
namespace LORIS\server_processes_manager;

use \LORIS\ToolDescriptors\ToolDescriptor;

class LaunchProcess extends \NDB_Page
{
    public $skipTemplate = true;

    /**
     * Determine whether the user has permission to view this page
     *
     * @return bool whether the user has access
     */
    function _hasAccess()
    {
        $user = \User::singleton();
        return $user->hasPermission('server_processes_manager');
    }

    /**
     * Entry point for /server_processes_manager/launchprocess/
     * Checks swicth between request method and call the appropriate handler
     *
     * @return none
     */
    function setup()
    {
        switch ($_SERVER['REQUEST_METHOD']) {
            case 'GET':
                break;
            case 'POST':
                break;
            default:
                header("HTTP/1.1 501 Not Implemented");
                throw new \Exception("Not Implemented");
                break;
        }
    }

    public function display()
    {
    }

    public function launch(): void
    {
        $descriptor = new ToolDescriptor();
        (new ServerProcessLauncher())->lorisInternal(
            (new ToolDescriptor())->withCommandline('ls')
        );
    }
}
