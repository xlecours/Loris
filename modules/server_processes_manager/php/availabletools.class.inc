<?php
namespace LORIS\server_processes_manager;

use \LORIS\ToolDescriptors\Tool;

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
            (new Tool())->withCommandLine('ls')->withName('Simple ls'),
            (new Tool())->withCommandLine('ls -lrt')->withName('Revers order ls'),
            (new Tool())->withCommandLine('ifconfig'),
        ];
    }

    public function display(): string
    {
        $format = $_REQUEST['format'] ?? null;
        $accept = $_SERVER['HTTP_ACCEPT'];
        if ($accept == 'application/json' || $format == 'json') {
            header('Content-type: application/json');
            return json_encode(array_map( function ($tool) {
                return $tool->toArray();
            }, $this->toolList), JSON_FORCE_OBJECT);
        }
        return '';
    }

    /**
     * Gathers JS dependecies and merge them with the parent
     *
     * @return array of javascript to be inserted
     */
    function getJSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            array($baseURL . "/server_processes_manager/js/LaunchPad.js")
        );
    }

}
