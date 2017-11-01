<?php
/**
 * This file contains the Genomic_Browser class
 *
 * PHP Version 7
 *
 * @category LORIS_Module
 * @package  Genomics
 * @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/CCNA/
 */
namespace LORIS\genomics;
/**
 * Main class for genomics module corresponding to /genomics/ URL
 * Child or Clinical section of the LorisMenu.
 *
 * Displays a list of genomic files and control panel to search them and upload
 * new ones.
 *
 * @category LORIS_Module
 * @package  Genomics
 * @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/CCNA/
 */
class Genomic_Browser extends \NDB_Menu_Filter
{
    /**
     * Specify that data will be fetch using ajax call.
     */
    public $AjaxModule = true;

    /**
     * Check user permissions
     *
     * @return bool
     * @throws ConfigurationException
     */
    function _hasAccess()
    {
        return true;
        //return \User::singleton()->hasPermission('genomics_read');
    }

    /**
     * Does the setup required for this page. By default, sets up elements
     * that are common to every type of page. May be overridden by a specific
     * page or specific page type.
     *
     * @param string $name       The test name being accessed
     * @param string $page       The subtest being accessed (may be null)
     * @param string $identifier The identifier for the data to load on this page
     * @param string $commentID  The CommentID to load the data for
     * @param string $formname   The name to give this form
     *
     * @return none
     */
    function _setupPage($name, $page, $identifier, $commentID, $formname)
    {
        parent::_setupPage($name, $page, $identifier, $commentID, $formname);

        // Form Elements
        $this->addBasicText('f_1', 'Field 1', ["size" => 9, "maxlength" => 6]);
        $this->addBasicText('f_2', 'Field 2', ["size" => 9, "maxlength" => 6]);
        $this->addBasicText('f_3', 'Field 3', ["size" => 9, "maxlength" => 6]);
        $this->addBasicText('f_4', 'Field 4', ["size" => 9, "maxlength" => 6]);
        $this->addBasicText('f_5', 'Field 5', ["size" => 9, "maxlength" => 6]);

        return true;
    }

    /**
     * Build a list of media to display in Data Table
     *
     * @return bool
     * @throws DatabaseException
     */
    function _setupVariables()
    {
        // set the class variables

        $this->columns = array (
            '"1" as f_1',
            '"2" as f_2',
            '"3" as f_3',
            '"4" as f_4',
            '"5" as f_5'
        );

        $this->query = " FROM DUAL WHERE 1=1 ";

        $this->group_by = '';
        $this->order_by = 'f_1';

        $this->validFilters = array();

        $this->formToFilter = array();

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
        $result         = $this->toArray();
        $result['form'] = $this->form->form;
        return json_encode($result);
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
            [$baseURL . "/genomics/css/genomics.css"]
        );
    }

    /**
     * Include additional JS files
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
             $baseURL . "/genomics/js/genomicsIndex.js",
            )
        );
    }
}
