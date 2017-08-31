<?php
/**
 * This file contains the NDB_Menu_Filter_tools class
 *
 * PHP Version 7
 *
 * @category Module
 * @package  Tools
 * @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/CCNA/
 */

namespace LORIS\tools;

/**
 * Main class for tools module corresponding to /tools/ URL
 *
 * Displays a list of tools and control panel to search them and upload
 * new ones.
 *
 * PHP Version 7
 *
 * @category Module
 * @package  Tools
 * @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/CCNA/
 */
class Tools extends \NDB_Menu_Filter
{
    public $AjaxModule = true;

    private $_tools = array();

    /**
     * Check user permissions
     *
     * @return bool
     * @throws ConfigurationException
     */
    function _hasAccess()
    {
        //create user object
        $user = \NDB_Factory::singleton()->user();

        return true || $user->hasPermission('tools');
    }

    /**
     * Displays the menu page
     *
     * @return void
     * @access public
     */
    function display()
    {
        $format = $_REQUEST['format'] ?? null;
        if ($format == 'json') {
            return $this->toJSON();
        }
    }

    /**
     * Build a list of tools to display in the page
     *
     * @return bool
     * @throws DatabaseException
     */
    function setup()
    {
        $t1 = new PCEV_Pipeline();

        $this->_tools[get_class($t1)] = $t1;

        return true;
    }

    /**
     * Converts the results of this menu filter to a JSON format to be retrieved
     * with ?format=json
     *
     * @return a json encoded string of the headers and data from this table
     */
    function toJSON()
    {
        return json_encode($this->_tools);
    }

    /**
     * Include additional CSS files:
     *
     * @return array of javascript to be inserted
     */
    function getCSSDependencies()
    {
        $baseURL = \NDB_Factory::singleton()->settings()->getBaseURL();
        $deps    = parent::getCSSDependencies();
        return array_merge(
            $deps,
            array( 
             $baseURL . "/tools/css/tools.css"
            )
        );
    }

    /**
     * Include additional JS files
     *
     * @return array of javascript to be inserted
     */
    function getJSDependencies()
    {
        $baseURL = \NDB_Factory::singleton()->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();

        return array_merge(
            $deps,
            array(
             $baseURL . "/tools/js/toolsIndex.js",
            )
        );
    }

}
