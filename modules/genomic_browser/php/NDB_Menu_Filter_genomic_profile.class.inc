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
        $select = array(
                   'p.Name AS site',
                   'LPAD(c.CandID, 6, "0") AS dccid',
                   'c.PSCID AS pscid',
                   'c.Gender AS sex',
                   'GROUP_CONCAT(DISTINCT u.title) AS subproject',
                   'DATE_FORMAT(c.DoB,\'%Y-%m-%d\') AS date_of_birth',
                   'c.ExternalID AS external_id',
                   'COUNT(gcfr.GenomicFileID) AS file_count',
                   'GROUP_CONCAT(DISTINCT gscr.sample_label) as sample_labels',
                  );

        $this->columns = $select;

        // TODO :: Column formater should consider subproject and
        //         sample_labels as possible arrays

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
            LEFT JOIN genomic_sample_candidate_rel gscr
                USING (CandID) 
            LEFT JOIN genomic_candidate_files_rel gcfr
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

        $this->group_by = 'c.CandID, p.Name';
        $this->order_by = 'p.Name, c.PSCID';

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
        return true;
    }

    /**
     * Converts this menu filter to an array of the form
     * adding the dataset counts from CouchDB
     *
     * Headers => (string array)
     * Data => (array of arrays of row data)
     *
     * Suitable for serializing to JSON, CSV, etc..
     *
     * @return associative array
     */
    function toArray()
    {
        $mysql_data = $this->_getFullList();

        // Add the genomic variable types in the headers
        $couch = CouchDB::singleton();
        $couch->setDatabase('test_epi');
        $params = array(
                   'reduce'      => 'true',
                   'group_level' => 1,
                  );
        $result = $couch->queryView(
            'genomic_browser',
            'sample_label_by_dataset',
            $params,
            false
        );

        $variable_types = array_map(
            function ($row) {
                return $row['key'][0];
            },
            $result
        );

        $headers = array_map(
            function ($header) {
                return ucwords(str_replace('_', ' ', $header));
            },
            array_merge($this->headers, $variable_types)
        );

        // Create a mapping between the variable types and the index in the
        // headers column. This variable is use to make sure that the dataset_count
        // is append in the MappedData in the same order than the variable types
        // have been append in the headers.
        $variable_types_headers_index = array_fill_keys($variable_types, 0);
        foreach ($variable_types_headers_index as $var_type => $val ) {
            $variable_types_headers_index[$var_type] = array_search(
                ucwords(str_replace('_', ' ', $var_type)),
                $headers
            );
        }

        $MappedData = array();

        foreach ($mysql_data as $row) {
            // Add the dataset count of each genomic variable types for
            // each of the candidate's sample label.
            $dataset_counts = array_fill_keys($variable_types, 0);
            $sample_labels  = explode(',', $row['sample_labels']);

            foreach ($sample_labels as $label) {
                if (!empty($label)) {
                    foreach ($variable_types as $var_type) {
                        $params = array(
                                   'reduce'      => 'true',
                                   'group_level' => '2',
                                   'start_key'   => "[\"$label\",\"$var_type\"]",
                                   'end_key'     => "[\"$label\",{}]",
                                   'limit'       => '1',
                                  );
                        $counts = $couch->queryView(
                            'genomic_browser',
                            'variable_type_by_sample',
                            $params,
                            false
                        );
                        if (!empty($counts)) {
                            $dataset_counts[$var_type] += $counts[0]["value"];
                        }
                    }
                }
            }

            foreach ($variable_types_headers_index as $var_type => $index) {
                $row[$index] = (string) $dataset_counts[$var_type];
            }

            $MappedData[] = array_values($row);
        }

        return array(
                'Headers' => $headers,
                'Data'    => $MappedData,
               );
    }

    /**
     * Include the column formatter
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
