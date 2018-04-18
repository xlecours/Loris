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

namespace LORIS\boutiquehtml;

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
class Boutiquehtml extends \NDB_Page
{
    public $AjaxModule = true;
    function _hasAccess()
    {
        return true;
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
        $ch = curl_init(); 

        // set url 
        curl_setopt($ch, CURLOPT_URL, "https://raw.githubusercontent.com/boutiques/boutiques/master/tools/python/boutiques/schema/examples/example2/example2.json"); 

        //return the transfer as a string 
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); 

        // $output contains the output string 
        $output = curl_exec($ch); 

        // close curl resource to free up system resources 
        curl_close($ch);

        return $output;
    }

    /**
     * Include additional JS files:
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
             $baseURL . "/boutiquehtml/js/index.js",
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
            array($baseURL . "/boutiquehtml/css/style.css")
        );
    }

}
