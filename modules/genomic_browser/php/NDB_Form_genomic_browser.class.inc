<?php

/**
 * Form_genomic_browser class file
 *
 * PHP version 5
 *
 * @category   Genomic
 * @package    Main
 * @subpackage Genomic
 * @author     Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://github.com/aces/Loris
*/

/**
 * NDB_Form_Genomic_Browser Class
 *
 * This class is genomic_browser Form
 *
 * @category   Genomic
 * @package    Main
 * @subpackage Genomic
 * @author     Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://github.com/aces/Loris
*/

class NDB_Form_Genomic_Browser extends NDB_Form
{
    /**
    * Determine whether the user has permission to view this page
    *
    * @return bool whether the user has access
    */
    function _hasAccess()
    {
        $user =& User::singleton();

        // Add site control? See Imaging Browser example
        return ($user->hasPermission('genomic_browser_view_allsites') ||
                $user->hasPermission('genomic_browser_view_site'));
    }

    function genomic_browser ()
    {
        return true;
    }

    /**
     * Include the React Genomic Application and the columnFormaters
     * for DynamicDataTables
     *
     * @return array of javascript files to be inserted
     */
    function getJSDependencies()
    {
        $factory = NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            array(
                $baseURL . '/js/components/PaginationLinks.js',
                $baseURL . "/js/util/queryString.js",
                $baseURL . '/js/components/FilterTable.js',
                $baseURL . '/js/components/Form.js',
                $baseURL . '/js/components/StaticDataTable.js',
                $baseURL . '/js/components/DynamicDataTable.js',
                $baseURL . "/genomic_browser/js/profile_tab.js",
                $baseURL . "/genomic_browser/js/variable_tab.js",
                $baseURL . "/genomic_browser/js/genomic_browser_app.js",
            )
        );
    }

    /**
     * Returns an ordered list of CSS dependencies that this page depends
     * on.  These will get loaded into the template in order, so that
     * interdependent files can be included in the correct order.
     *
     * @return array of strings with URLs to retrieve CSS resources
     */
    function getCSSDependencies()
    {
        $deps    = parent::getCSSDependencies();

        $factory = NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();

        return array_merge(
            $deps,
            array(
                $baseURL . "/genomic_browser/css/genomic_browser_custom.css",
            )
        );
    }
}
?>
