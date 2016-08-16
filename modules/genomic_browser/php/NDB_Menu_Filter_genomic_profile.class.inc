<?php
/**
 * For genomic_browser class file
 * Main Genomic Browser tab
 * Displays genomic profiles - genomic data available per candidate
 * Filterable by candidate or genomic criteria.
 *
 * PHP version 5
 *
 *  @category   Genomic
 *  @package    Main
 *  @subpackage Genomic
 *  @author     Christine Rogers <rogers@bic.mni.mcgill.ca>
 *  @license    http://www.gnu.org/licenses/gpl-3.0.txt @GPLv3
 *  @link       https://www.github.com/aces/Loris/
 *  Main tab: Genomic Profiles. Submenus: CNV,SNP,GWAS
 */

/**
 * NDB_Menu_Filter_Genomic_Browser Class
 *
 * This class is genomic_browser Form
 *
 * @category   Genomic
 * @package    Main
 * @subpackage Genomic
 * @author     Christine Rogers <rogers@bic.mni.mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt @GPLv3
 * @link       https://github.com/aces/Loris
*/
class NDB_Menu_Filter_Genomic_Profile extends NDB_Menu_Filter
{
    var $AjaxModule = true;
    /**
     * Variables to enable special filter behaviour -
     * Show brief results or show full results (all available fields)
     * used in (overridden) _addValidFilters function below
     */
    var $_displayBrief = true;  // default: display only Brief results

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
        // set the class variables
        $this->columns = array(
                          'p.Name AS Site',
                          'LPAD(c.CandID, 6, "0") AS dccid',
                          'c.PSCID AS pscid',
                          'c.Gender AS sex',
                          'GROUP_CONCAT(DISTINCT u.title) AS subproject',
                          'DATE_FORMAT(c.DoB,\'%Y-%m-%d\') AS date_of_birth',
                          'c.ExternalID AS external_id',
                          'COUNT(gcfr.GenomicFileID) AS file_count',
                          'GROUP_CONCAT(gscr.sample_label) as sample_labels'
                         );

// TODO :: Column formater should consider subproject and sample_labels as possible arrays

        // This variable will be used by the columnFormatter javascript
        // to set the default hidden columns in the data table.
        $this->tpl_data['hiddenHeaders'] = json_encode(
            array_map(
                function ($header) {
                        return ucwords(str_replace('_', ' ', $header));
                },
                array(
                 'Site',
                 'dccid',
                 'external_id',
                 'date_of_birth',
                )
            )
        );

        $this->query = " FROM candidate c 
            LEFT JOIN session s 
                USING (CandID)
            LEFT JOIN subproject u
                USING (SubprojectID)
            LEFT JOIN psc p
                ON (p.CenterID = c.CenterID)
            LEFT JOIN genomic_candidate_files_rel gcfr
                USING (CandID)
            LEFT JOIN genomic_sample_candidate_rel gscr
                USING (CandID) 
            WHERE 
                c.Entity_type = 'Human' AND 
                c.Active = 'Y'";

        $DB   = Database::singleton();
        $user = User::singleton();
        if (!$user->hasPermission('genomic_browser_view_allsites')) {
            $this->query .= " AND c.CenterID = ";
            $this->query .= $DB->quote($user->getCenterID());
        }

        $this->group_by     = 'c.CandID, p.Name';
        $this->order_by     = 'p.Name, c.PSCID';

        $this->validFilters = array(
                               'p.Site',
                               'c.CandID',
                               'c.PSCID',
                               'c.Gender',
                               's.SubprojectID',
                               'c.DoB',
                               'c.ExternalID',
                               'show_brief_results',
                               'file_count',
                              );

        $this->formToFilter = array(
                'site'               => 'candidate.CenterID',
                'dccid'              => 'candidate.CandID',
                'pscid'              => 'candidate.PSCID',
                'sex'                => 'candidate.Gender',
                'subproject_id'      => 'cohort.SubprojectID',
                'external_id'        => 'candidate.ExternalID',
                'show_brief_results' => 'show_brief_results',
                'file_count'         => 'COUNT(gcfr.GenomicFileID)',
               );

// TODO ADD the Dataset variable_types in column, validFilters and formToFilter

        return true;
    }

    /**
     * Adds filters
     * This function overrides filters to enable display of brief/full results
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
error_log('here');
        $query = ''; //initialize
        if ($field == "show_brief_results") {
            if ($val == "full") {
                $this->_displayBrief = false;
            }
            return $query;
        }
        if ((!empty($val) || $val === '0') && $field != 'order') {
            if (in_array($field, $this->CheckboxFilters) && $val) {
                $query .= " AND $field";
            } elseif (strtolower(substr($field, -8)) == 'centerid'
                || strtolower(substr($field, -10)) == 'categoryid'
                || strtolower(substr($field, -6)) == 'gender'
                || (isset($this->EqualityFilters)
                && in_array($field, $this->EqualityFilters))
            ) {
                 $query .= " AND $field = :v_$prepared_key";
            } elseif ($field == "F.FileCount"
                || $field == "S.SNPCount"
                || $field == "C.CNVCount"
                || $field == "M.CPGCount"
            ) {
                if ($val == "1") {  // if ANY found i.e. >= 1
                    $query .= " AND $field >= :v_$prepared_key";
                } elseif ($val == "0") { // if NONE found i.e. = 0
                    $query .= " AND ($field = :v_$prepared_key || $field IS NULL)";
                }
            } elseif ($field == "c.CandID") {
                $query .= " AND $field = CONVERT( :v_$prepared_key, DECIMAL) ";
            } else {
                $query .= " AND $field LIKE CONCAT('%', :v_$prepared_key, '%') ";
            }
        }
        return $query;
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
             $baseURL . "/genomic_browser/js/profileColumnFormatter.js",
            )
        );
    }
}
?>
