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
            'cpg_ids',
            'psc_ids',
            'snp_ids',
            'group_level',
            'limit',
        );

        $this->formToFilter = array(
            'cpg_ids'     => 'cpg_ids',
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
        $this->addBasicText('cpg_ids', 'CPGs');
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
        return $helper->getBetaValues($this->filter);
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

        $columns = array('cpg', 'visit_id', 'beta_value');

        $query = 'SELECT ' . implode(',', $columns) . ' FROM genomic_beta_value ';
        $where = 'WHERE 1=1 ';
        $group_by = '';
        $having = '';
        $limit = 'LIMIT 20';

        foreach ($params as $param => $value) {
            $this->logit($param . "=" . $value);
        }

$this->logit(implode(' ', array($query, $where, $group_by, $having, $limit)));

        $mysql_data = $this->DB->pselect( implode(' ', array($query, $where, $group_by, $having, $limit)), array());
        $data = array();
        foreach ($mysql_data as $row) {
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

class CouchDB_Genomic_Helper extends Genomic_Helper
{

    var $CouchDB = null;

    /** 
     * Constructor for SocketWrapper
     */
    function __construct()
    {   
        $this->CouchDB = CouchDB::singleton();
    }

/*
    function getBetaValues( $params ) {
        $saved_filters = $params;

        $params = array(
            'stale' => 'ok',
        );

        if (!empty($_REQUEST['limit']) && $_REQUEST['limit'] != "undefined" ) {
            $params['limit'] = $_REQUEST['limit'];
            $saved_filters['limit'] = $_REQUEST['limit'];
        } else {
            $params['limit'] = 20;
        }

        if (!empty($_REQUEST['group_level'])&&$_REQUEST['group_level']!="undefined"){
            $params['group_level'] = $_REQUEST['group_level'];
            $saved_filters['group_level'] = $_REQUEST['group_level'];
        } else {
            $params['group_level'] = 1;
        }

        if (!empty($_REQUEST['cpg_ids']) && $_REQUEST['cpg_ids'] != "undefined"){
            $cpg_ids=preg_split("/[\s,]+/",$_REQUEST['cpg_ids']);
            $saved_filters['cpg_ids'] = $cpg_ids;
        }

        if(!empty($saved_filters['pscids'])){
            $pscids = $saved_filters['pscids'];
        } else {
            $pscids = array();
            $DB=Database::singleton();
            $result = $DB->pselect("SELECT PSCID FROM Candidate", array());
            foreach ($result as $row) {
                array_push($pscids, $row['PSCID']);
            }
            $saved_filters['psc_ids'] = $pscids;
        }

        // build the keys request
        if( !empty($cpg_ids) ){
            $saved_filters['group_level'] = '2';
            unset($params['group_level']);
            $params['group'] = 'true';
            $keys = array();
            foreach($cpg_ids as $cpg) {
                foreach($pscids as $pscid) {
                    array_push($keys, '["' . $cpg . '","' . $pscid . '"]');
                }
            }
            $params['keys'] = implode(',',$keys);
        }
        $formated_data = array(
            "Headers" => [
                "CPG",
                $params['group_level'] == 1 ? "Count" : "PSCID",
                $params['group_level'] == 1 ? "Average" : "Beta_value",
            ],
            "Data"    => array(),
        );

        //$old_db_name = $this->CouchDB->getDatabaseName();
        //$this->CouchDB->setDatabaseName('loris');
//error_log('-------------------');
//error_log(print_r($params,true));
//error_log('-------------------');
        $couchdb_data = $this->CouchDB->queryView('genomic_browser', 'cpg_pscid_beta_value', $params);

        $annotations = array();
        foreach ($couchdb_data as $key_value_pair) {
            $data_row = array();

            $cpg_id     = $key_value_pair['key'][0];
            $pscid      = $params['group_level'] == 1 ? $key_value_pair['value'][1] : $key_value_pair['key'][1];
            $beta_value = round($key_value_pair['value'][0], 3);

            array_push($data_row, $cpg_id);
            array_push($data_row, $pscid);
            array_push($data_row, $beta_value);

            if (empty($annotations[$cpg_id])) {
                $doc_id = 'LORIS_genomic_cpg_annotation_' . $cpg_id;
                //$annotations[$cpg_id] = $this->getAnnotation($doc_id);
                $annotations[$cpg_id] = array("data" => array('BOB' => 'bob'));
            }
            foreach ($annotations[$cpg_id]['data'] as $key=>$value) {
                $headers_index = array_search($key, $formated_data["Headers"]);
                if(false == $headers_index) {
                    array_push($formated_data['Headers'], $key);
                    $headers_index = array_search($key, $formated_data["Headers"]);
                }
                $data_row[$headers_index] = $value;
            }
            array_push($formated_data['Data'], $data_row);
        }
        //$this->CouchDB->setDatabaseName($old_db_name);
        return $formated_data;
    }
*/
}
?>
