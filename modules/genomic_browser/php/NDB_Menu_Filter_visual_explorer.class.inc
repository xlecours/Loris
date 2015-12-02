<?php
/**
 * For cpg_browser class file
 * Displays targeted CpG islands data.
 * Filterable by candidate, gene or variant fields.
 *
 * PHP version 5
 *
 *  @category Genomic
 *  @package  Main
 *  @author   Xavier <xavierlb.mavan@gmail.com>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt @GPLv3
 *  @link     https://www.github.com/aces/Loris/
 *  Main page: CNV. Submenu: SNP
 */

require_once 'NDB_Menu_Filter.class.inc';
/**
 * NDB_Menu_Filter_SNP_Browser Class
 *
 * This class is cpg_browser Form
 * CpG submenu tab for Genomic Browser
 *
 * @category Genomic
 * @package  Main
 * @author   Loris team <info-loris.mni@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt @GPLv3
 * @link     https://github.com/aces/Loris
*/
class NDB_Menu_Visual_Explorer extends NDB_Menu_Filter
{
    /**
     * Overloading this method to allow access to site users (own site only)
     * and users w/ multisite privileges
     *
     * @note   overloaded function
     * @return bool
     */
    function _hasAccess()
    {
        // create user object
        $user = User::singleton();
        return ($user->hasPermission('genomic_browser_view_site')
                || $user->hasPermission('genomic_browser_view_allsites'));
    }

    /** 
     * Computes the initial values this page will be filled with.
     *
     * @return the default values for the initial state of this page.
     */
    function _getDefaults()
    {
        $defaults = array(
            'Chromosome' => '21',
            'Start_loc'  => '48026000',
            'End_loc'    => '49026053',
        );

        return $defaults;
    }

    /**
     * Function _setupVariables
     *
     * @note   overloaded function
     * @return bool
    */
    function _setupVariables()
    {
        $this->columns = array('1');

        $this->query = ' FROM Epigenomics.probe_annotations annotation WHERE 1=1 ';

        $this->validFilters = array(
            'annotation.chr',
            'annotation.mapinfo',
            'annotation.start_loc',
            'annotation.end_loc',
            'annotation.strand',
        );

        $this->formToFilter = array(
            // Shared filters
            'Chromosome'      => 'annotation.chr',
            'Start_loc'       => 'annotation.start_loc',
            'End_loc'         => 'annotation.end_loc',
            'Strand'          => 'annotation.strand',
            'Target_location' => 'annotation.mapinfo',
        );

        // Set the default filter values
        $this->filter['annotation.chr']       = '21';
        $this->filter['annotation.start_loc'] = '48026000';
        $this->filter['annotation.end_loc']   = '49026053';
    }

    /**
     * Sets the template data for the filter form
     *
     * @note   overloaded function
     * @return bool
     */
    function _setFilterForm()
    {

        // Chromosome
        $options_list = array(
            '1'  => '1',
            '2'  => '2',
            '3'  => '3',
            '4'  => '4',
            '5'  => '5',
            '6'  => '6',
            '7'  => '7',
            '8'  => '8',
            '9'  => '9',
            '10' => '10',
            '11' => '11',
            '12' => '12',
            '13' => '13',
            '14' => '14',
            '15' => '15',
            '16' => '16',
            '17' => '17',
            '18' => '18',
            '19' => '19',
            '20' => '20',
            '21' => '21',
            '22' => '22',
            'X'  => 'X',
            'Y'  => 'Y',
        );
        $this->addSelect('Chromosome','Chromosome:', $options_list);

        $this->addBasicText('Start_loc','From:');
        $this->addBasicText('End_loc','To:');

        $options_list = array(
            null => 'Any',
            'F'  => 'Forward',
            'R'  => 'Reverse',
        );
        $this->addSelect('Strand','Strand:',$options_list);
    }

    /**
     * Adds filters
     * This function overrides filters to enable the initial query.
     *
     * @param string $prepared_key filter key
     * @param string $field        filter field
     * @param string $val          filter value
     *
     * @note overloaded function
     *
     * @return $query
    */
    function _addValidFilters($prepared_key, $field, $val)
    {
        $query = ''; //initialize
        if ($field == "show_results_options") {
            if ($val == "full") {
                $this->_displayBrief = false;
            }
            return $query;
        }
        if ((!empty($val) || $val === '0') && $field != 'order') {
            switch ($field) {
                case 'annotation.start_loc':
                    $query .= " AND annotation.mapinfo >= :v_$prepared_key";
                    break;
                case 'annotation.end_loc':
                    $query .= " AND annotation.mapinfo <= :v_$prepared_key";
                    break;
                case 'annotation.chr':
                    $query .= " AND $field = :v_$prepared_key";
                    break;
                default:
                    $query .= " AND $field LIKE CONCAT('%', :v_$prepared_key, '%') ";
                    break;
            }
        }
        return $query;
    }
}
