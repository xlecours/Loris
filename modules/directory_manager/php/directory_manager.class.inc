<?php
/**
 * This file contains the Directory_Manager class
 *
 * PHP Version 5
 *
 * @category Module
 * @package  Directory_Manager
 * @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

namespace LORIS\directory_manager;

/**
 * Main class for directory_manager module
 * corresponding to /directory_manager/ URL
 *
 * PHP Version 5
 *
 * @category Module
 * @package  Directory_Manager
 * @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class Directory_Manager extends \NDB_Page
{
    public $AjaxModule = true;
    /*
    TODO LIST::
    - Sync with files table?

    */

    /**
     * Check user permissions
     *
     * @return bool
     * @throws ConfigurationException
     */
    function _hasAccess()
    {
        //create user object
        $user =& \User::singleton();
        // TODO :: Set proper permission(s)
        return true || $user->hasPermission('directory_management');
    }

    /**
     * Displays the menu page
     *
     * @note This is not how thing should be done. But it is working...
     *
     * @return void
     * @access public
     */
    function display()
    {
        switch($_SERVER['REQUEST_METHOD']) {
            case 'GET':
                if (!empty($_REQUEST['format']) && $_REQUEST['format'] == 'json') {
                    $directoryTree = \LORIS\directory_manager\Directory_Tree::getInstance('Dataprovider');
                    return $directoryTree->toJSON();
                }
                break;

            case 'POST':
                // If POST request received, process it as a form submission
                $stdin = file_get_contents('php://input');
                $req   = json_decode($stdin, true);
                return $this->_processPostRequest($req);
                break;
        }
    }

    /**
     * Validate then execute the request
     *
     * @param object $req HTTP request data
     *
     * @return void
     * @access private
     */
    private function _processPostRequest($req)
    {
        // Make sure that the requested className is a subclass of Directory_Tree
        if (class_exists($req['className'])) {
            $chunks = explode('\\', $req['className']);
            $subclass_name = $chunks[count($chunks) -1 ];
            $directoryTree = \LORIS\directory_manager\Directory_Tree::getInstance($subclass_name);

            if (!method_exists($directoryTree, $req['action'])) {
              error_log('Method not implemented');
              throw new \LorisException('Method not implemented');
            }
            return $directoryTree->$req['action']($req['fullpath']);
        }
    }

    /**
     * Include additional JS files:
     *  1. columnFormatter.js required to set links to Edit and Download file
     *  2. uploadForm.js - reactified form to upload files
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
            array(
             $baseURL . "/directory_manager/js/index.js",
            )
        );
    }

    /**
     * Include additional CSS files:
     *
     * @return array of javascript to be inserted
     */
    function getCSSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getCSSDependencies();
        return array_merge(
            $deps,
            array($baseURL . "/directory_manager/css/directory_tree.css")
        );
    }

}
