<?php
/**
 * Genomic Uploader provide genomic file management
 *
 * PHP version 7
 *
 * @category LORIS_Module
 * @package  Genomics
 * @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt @GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\genomic_uploader;

/**
 * This class is the genomic_uploader module
 *
 * @category LORIS_Module
 * @package  Genomics
 * @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt @GPLv3
 * @link     https://github.com/aces/Loris
*/
class Genomic_Uploader extends \NDB_Menu_Filter
{
    /**
     * Tell the Caller that data will be queried using ajax and after
     * the HTML page rendering.
     */
    var $AjaxModule = true;

    /**
     * If true, the default display function will not try to load any template.
     * This is intended to be used with, for instance, pages that completely
     * construct the DOM from javascript.
     */
    var $skipTemplate = true;

    /**
     * Chech user permissions
     *
     * @return bool
     */
    function _hasAccess()
    {
        // create user object
        $user = \User::singleton();
        return $user->hasPermission('genomic_data_manager');
    }

    /**
     * Function _setupVariables
     *
     * @note   overloaded function
     * @return bool
    */
    function _setupVariables()
    {
        $this->columns = array();
        return true;
    }

    /**
     * Does the setup required for this page. By default, sets up elements
     * that are common to every type of page. May be overridden by a specific
     * page or specific page type.
     *
     * @return none
     */
    function setup()
    {
        parent::setup();

        return true;
    }

    /**
     * Add Javascript dependencies
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
             $baseURL . "/genomic_browser/js/genomic_uploader.js",
            )
        );
    }
}
?>
