<?php
/**
* The candidate list menu
*
* PHP Version 5
*
* @category Main
* @package  Candidate_List
* @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
* @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
* @link     https://www.github.com/aces/Loris/
*/
/**
 * Implements the candidate_list menu
 *
* @category Main
* @package  Candidate_List
* @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
* @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
* @link     https://www.github.com/aces/Loris/
 */
class NDB_Menu_Filter_CPG_Browser extends NDB_Menu_Filter
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
        // Columns depends on grouping and annotations 
        $this->columns = array();

        $this->validFilters = array(
            'genomic_range',
            'cpg',
            'psc_ids',
            'snp_ids',
            'group_level',
            'limit',
        );

        $this->formToFilter = array(
            'cpg'     => 'cpg',
            'limit'       => 'limit',
            'group_level' => 'group_level',
        );

    }

    /** 
     * Sets the template data for the filter form
     *
     * @note   overloaded function
     * @return void
     * @access private
     */
    function _setFilterForm()
    {
        $this->addBasicText('genomic_range', 'Genomic Range');
        $this->addBasicText('cpg', 'CPGs');
        $this->addSelect(
            'group_level',
            'Grouping',
            array('1' => 'Per cpg', '2' => 'None')
        );
        $this->addSelect(
            'limit',
            'Max rows',
            array('20'=>'20', '100'=>'100', '1000'=>'1000', '10000'=>'10000')
        );
        return true;
    }

    /** 
     * Converts this menu filter to an array of the form
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
        //$helper = new CouchDB_Genomic_Helper();
        $helper = new MySQL_Genomic_Helper();
        return $helper->getBetaValues($_REQUEST);
    }

    /** 
     * Include the column formatter required to display the feedback link colours
     * in the cpg_browser menu
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
             $baseURL . "/js/advancedMenu.js",
             $baseURL . "/genomic_browser/js/columnFormatter.js",
            )   
        );  
    }

}

class Genomic_Helper
{
    function logit( $message ) {
        error_log(print_r( $message, true));
    }
 
    function getBetaValues( $params ) {
        return array('Headers' => array(), 'Data' => null);
    }
}

class MySQL_Genomic_Helper extends Genomic_Helper
{
    var $DB = null;

    function __construct()
    {
        $this->DB = Database::singleton();
    }

    function getBetaValues( $params = array()) { 


        $where = 'WHERE 1=1 ';
        $group_by = '';
        $having = '';
        $limit = 'LIMIT 20';

        foreach ($params as $param => $value) {
            if ($value != '') {
                switch ($param) {
                    case 'cpg':
                        $where .= "AND cpg LIKE '%$value%' ";
                        break;
                    case 'limit':
                        $limit = "LIMIT $value";
                        break;
                    case 'group_level':
                        if (1 == $value) {
                            $group_by .= ' GROUP BY cpg ';
                            $columns = array('cpg', 'COUNT(visit_id) as COUNT', 'AVG(beta_value) as MEAN','tissue','cpg_loc','gene','chromosome','strand','platform');
                        } else if (2 == $value) {
                            $columns = array('cpg', 'visit_id', 'beta_value','tissue','cpg_loc','gene','chromosome','strand','platform');
                        }
                        break;
                    default:
                        break;
                }
            }
        }
        $query = 'SELECT ' . implode(',', $columns) . ' FROM genomic_cpg ';
$this->logit($params);
$this->logit(implode(' ', array($query, $where, $group_by, $having, $limit )));

        $mysql_data = $this->DB->pselect( implode(' ', array($query, $where, $group_by, $having, $limit)), array());
        $data = array();
        foreach ($mysql_data as $row) {
$this->logit($row);
            $formated_row = array();
            foreach ($columns as $field) {
                array_push($formated_row, $row[$field]);
            }
            array_push($data, $formated_row);
        }

        //$this->logit($mysql_data);
        return array('Headers' => $columns, 'Data' => $data);
    }   
}
?>
