<?php
/**
 * This file contains the Dataset_Browser class
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
class Dataset_Browser extends \NDB_Menu_Filter
{
    /**
     * Specify that data will be fetch using ajax call.
     */
    public $AjaxModule = true;

    /**
     * This is a react app and there is no template
     */
    public $skipTemplate = true;

    public function __construct()
    {
        $this->_datasetManager = DatasetManager::getinstance();
    }

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
        $this->addBasicText('name', 'Name', ["size" => 9, "maxlength" => 6]);

        $variable_types = array_reduce(
            $this->_datasetManager->getDatasetVariable(),
            function ($carry, $type) {
                $carry[$type] = $type;
                return $carry;
            },
            array()
        );
        $this->addSelect('variable', 'Variable Type', $variable_types);

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
            '"4" as dataset_id',
            '"Your favorite dataset" as name',
            '"SNP" as variable',
            '"23" as fileset_id'
        );

        $this->query = " FROM DUAL WHERE 1=1 ";

        $this->group_by = '';
        $this->order_by = 'name';

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
