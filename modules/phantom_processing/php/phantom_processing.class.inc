<?php

/**
 * This class features the code for the menu portion
 * of the Loris phantom processing module
 *
 * PHP Version 7
 *
 * @category Processing
 * @package  imaging
 * @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
namespace LORIS\phantom_processing;

use \Psr\Http\Server\RequestHandlerInterface;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * Provides the PHP code for the menu filter of that module
 *
 * @category Processing
 * @package  imaging
 * @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
class Phantom_Processing extends \NDB_Menu_Filter
{

    public function _hasAccess()
    {
        return (\User::singleton())->hasPermission('phantom_processing');
    }

    /**
     * Set up the variables required by NDB_Menu_Filter class for constructing
     * a query
     *
     * @return void
     */
    function _setupVariables()
    {
        // Rest the filter because this is broken with react modules
        $this->_resetFilters();

        $this->AjaxModule   = true;
        $this->skipTemplate = true;

        $this->columns = array();
    }

    /**
     * Create a form to filter media by various criteria
     *
     * @return void
     * @throws \ConfigurationException
     * @throws \DatabaseException
     * @throws \Exception
     */
    function _setFilterForm()
    {
        $this->addBasicText('visitLabel', 'Visit Label');
        $this->addSelect('status', 'Status', array(
          'invalid' => 'Invalid',
          'ready' => 'Ready',
          'in_progress' => 'In Progress',
          'completed' => 'Completed',
        ));
    }  

    /**
     * Converts the data from the data table to an array suitable for JSON
     * serialiation. Overrides the base class in order to enforce name regex
     * rules.
     *
     * @return array of data from dicom_archive menu filter
     */
    public function toArray(): array
    {
        return json_decode($this->toJSON());
    }

    /**
     * Converts the results of this menu filter to a JSON format to be retrieved
     * with ?format=json
     *
     * @return string a json encoded string of the headers and data from this table
     */
    function toJSON()
    {
        // TODO :: This should go in a dataProvisionner
        $database = (\NDB_Factory::singleton())->database();
        $stmt     = $database->prepare(
          '
            SELECT 
              session.Visit_label as visit_label,
              session.Testdate as insert_date,
              files.File as filename,
              mri_scan_type.Scan_type as scan_type
            FROM
              session
            JOIN files
              ON (session.ID = files.sessionID)
            JOIN mri_scan_type
              ON (files.AcquisitionProtocolID = mri_scan_type.ID)
            WHERE
               LOWER(session.Visit_label) like "%lego_phantom%"'
        );
        $rows     = $database->execute($stmt, array());

        return json_encode(
            array(
             'Headers' => array(
                           'Visit Label',
                           'Insert Date',
                           'Filename',
                           'Scan Type',
                          ),
             'Data'    => $rows,
             'form'    => $this->form->form,
            )
        );
    }

    /**
     * Overrides base getJSDependencies() to add support for dicom specific
     * React column formatters.
     *
     * @return array of extra JS files that this page depends on
     */
    public function getJSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            array(
             $baseURL . "/phantom_processing/js/index.js",
            )
        );
    }
}
