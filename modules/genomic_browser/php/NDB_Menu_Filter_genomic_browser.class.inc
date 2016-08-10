<?php
/**
 * For genomic_browser class file
 * Main Genomic Browser tab
 * Displays genomic profiles - genomic data available per candidate
 *
 * PHP version 5
 *
 *  @category   Genomic
 *  @package    Main
 *  @subpackage Genomic
 *  @author     Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 *  @license    http://www.gnu.org/licenses/gpl-3.0.txt @GPLv3
 *  @link       https://www.github.com/aces/Loris/
 */

require_once 'NDB_Menu_Filter.class.inc';
/**
 * NDB_Menu_Filter_Genomic_Browser Class
 *
 * This class is genomic_browser react app placeholder
 *
 * @category   Genomic
 * @package    Main
 * @subpackage Genomic
 * @author     Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt @GPLv3
 * @link       https://github.com/aces/Loris
*/
class NDB_Menu_Genomic_Browser extends NDB_Menu
{
    var $AjaxModule = true;

    /**
     * Overloading this method to allow access to site users (own site only)
     * and users w/ multisite privs
     *
     * @note   overloaded function
     * @return bool
     */
    function _hasAccess()
    {
        // create user object
        $user = User::singleton();
        return ($user->hasPermission('genomic_browser_view_allsites')
                || $user->hasPermission('genomic_browser_view_site'));
    }

    /**
     * Function _setupVariables
     *
     * @note   overloaded function
     * @return bool
    */
    function _setupVariables()
    {
        return true;
    }

    /**
     * Sets the template data for the filter form
     *
     * @note   overloaded function
     * @return bool
     */
    function _setFilterForm()
    {
        return true;
    }

    /**
     * Include the column formatter required to display the feedback link colours
     * in the candidate_list menu
     *
     * @return array of javascript to be inserted
     */
    function getJSDependencies()
    {
        $factory = NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            array(
             $baseURL . "/genomic_browser/js/columnFormatter.js",
            )
        );
    }
}
