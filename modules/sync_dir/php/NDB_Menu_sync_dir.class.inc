<?php
/**
* The sync dir page
*
* PHP Version 5
*
* @category Main
* @package  sync_dir
* @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
* @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
* @link     https://www.github.com/aces/Loris/
*/

/**
 * Implements the candidate_list menu
 *
* @category Main
* @package  sync_dir
* @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
* @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
* @link     https://www.github.com/aces/Loris/
 */
class NDB_Menu_Sync_Dir extends NDB_Menu
{

    var $AjaxModule = true;

    /**
     * Overloading this method filter out users without permissions
     *
     * @note   overloaded function
     * @return bool
     */
    function _hasAccess()
    {
        // create user object
        $user = User::singleton();
        return $user->hasPermission('data_provider_manager');
    }

    /**
     * Create the html of the control panel
     *
     * @return HTML
     */
    function getControlPanel() {
        var_dump("getControlPanel()");
/*
        $controlPanel = new Instrument_List_ControlPanel($_REQUEST['sessionID']);
        // save possible changes from the control panel...
        $success = $controlPanel->save();

        // display the control panel
        $html = $controlPanel->display();
        // I don't know why this is here, but it
        // was in main.php, so moved it to be safe.
        $timePoint =& TimePoint::singleton($_REQUEST['sessionID']);
        $timePoint->select($_REQUEST['sessionID']);
        return $html;
*/
        return "";
    }

    /**
     * Calls other member functions to do all the work necessary to create the menu
     *
     * @note   overloaded function
     * @return void
     * @access public
     */
    function setup()
    {
        return true;
    }
}
