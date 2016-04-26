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
class NDB_Menu_Lite_Viewer extends NDB_Menu_Filter
{

    var $AjaxModule = true;

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
            'Chromosome' => '14',
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
        $this->columns = array('cpg_name');

        $this->query = ' FROM genomic_cpg cpg WHERE 0=1 ';

        $this->validFilters = array(
            'cpg.cpg_name',
        );

        $this->formToFilter = array(
            // Shared filters
            'CPG' => 'cpg.cpg_name',
        );
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
            'chr1'  => 'chr1',
            'chr2'  => 'chr2',
            'chr3'  => 'chr3',
            'chr4'  => 'chr4',
            'chr5'  => 'chr5',
            'chr6'  => 'chr6',
            'chr7'  => 'chr7',
            'chr8'  => 'chr8',
            'chr9'  => 'chr9',
            'chr10' => 'chr10',
            'chr11' => 'chr11',
            'chr12' => 'chr12',
            'chr13' => 'chr13',
            'chr14' => 'chr14',
            'chr15' => 'chr15',
            'chr16' => 'chr16',
            'chr17' => 'chr17',
            'chr18' => 'chr18',
            'chr19' => 'chr19',
            'chr20' => 'chr20',
            'chr21' => 'chr21',
            'chr22' => 'chr22',
            'chrX'  => 'chrX',
            'chrY'  => 'chrY',
            'chrM'  => 'chrM',
        );
        $this->addSelect('Chromosome','Chromosome:', $options_list);

        $this->addBasicText('StartLoc','From:');
        $this->addBasicText('EndLoc','To:');

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
                case 'genome_loc.StartLoc':
                    $query .= " AND cpg.cpg_loc >= :v_$prepared_key";
                    break;
                case 'genome_loc.EndLoc':
                    $query .= " AND cpg.cpg_loc <= :v_$prepared_key";
                    break;
                case 'genome_loc.chromosome':
                    $query .= " AND $field = :v_$prepared_key";
                    break;
                default:
                    $query .= " AND $field LIKE CONCAT('%', :v_$prepared_key, '%') ";
                    break;
            }
        }
        return $query;
    }

    /** 
     * Add dependency on D3 and C3 javascript libraries
     * for the pretty dashboards in the chart
     *
     * @return array of javascript files to be included
     */
    function getJSDependencies()
    {   
        $factory = NDB_Factory::singleton();
        $config  = $factory->config();

        $www     = $config->getSetting('www');
        $baseurl = $www['url'];

        $baseDeps = parent::getJSDependencies();

        return array_merge(
            $baseDeps,
            array(
                $baseurl . '/js/d3.min.js',
                $baseurl . '/js/c3.min.js',
                $baseurl . '/genomic_browser/js/jstat.min.js',
                $baseurl . '/genomic_browser/js/genomic_browser.js',
                $baseurl . '/genomic_browser/js/lite_viewer.js',
                $baseurl . '/genomic_browser/js/lite_viewer_react_components.js',
            )   
        );  

    }
}
