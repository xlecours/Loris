<?php
/**
 * Genomic Data Querying Module
 *
 * PHP Version 7
 *
 * @category Data query
 * @package  Genomics
 * @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\genomic_query;

/**
 * Genomic Data Querying Module
 *
 * PHP Version 7
 *
 * @category Data query
 * @package  Genomics
 * @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Genomic_Query extends \NDB_Menu_Filter
{
    /**
     * Data will be queried using Ajax (i.e.: format=json)
     */
    public $AjaxModule;

    /**
     * Skip Smarty templating flag
     */
    public $skipTemplate;


    /**
     * Check user access permission
     *
     * @return bool|object
     */
    public function _hasAccess()
    {
        // TODO
        return true;
    }

    /**
     * Sets up the smarty template variables for the dataquery page.
     *
     * @param string $name       The test name being accessed
     * @param string $page       The subtest being accessed (may be null)
     * @param string $identifier The identifier for the data to load on this page
     * @param string $commentID  The CommentID to load the data for
     * @param string $formname   The name to give this form
     *
     * @return unknown
     */
    function _setupPage($name, $page, $identifier, $commentID, $formname)
    {
        parent::_setupPage($name, $page, $identifier, $commentID, $formname);

        $this->AjaxModule = true;
        $this->skipTemplate = true;

        $factory = new \NDB_Factory();
        // TODO :: should come from config file
        $this->couchDB = $factory->couchDB('genomics');
    }

    /**
     * Include additionnal Javascript files
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
            array()
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
            array()
        );
    }

}
