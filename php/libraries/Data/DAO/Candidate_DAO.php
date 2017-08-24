<?php
/**
 * Candidate Data Access Object (DAO).
 *
 * This class contains all database handling that is needed to 
 * permanently store and retrieve Candidate object instances.
 */
namespace LORIS\Data\DAO;

use \LORIS\Data\DTO\Candidate_DTO;

class Candidate_DAO implements DAO
{
    private $_user;
    private $_database;
    private $_query;

    /**
     *
     */
    public function __construct()
    {
        $login = \SinglePointLogin::getInstance();

        $this->_user     = $login->getLoggedInUser();
        $this->_database = \NDB_Factory::singleton()->database();
        $this->_query    = '
            SELECT
                candidate.ID,
                candidate.CandID,
                candidate.PSCID,
                candidate.ExternalID,
                candidate.DoB,
                candidate.EDC,
                candidate.Gender,
                candidate.CenterID,
                candidate.ProjectID,
                candidate.Ethnicity,
                candidate.Active,
                candidate.Date_active,
                candidate.RegisteredBy,
                candidate.UserID,
                candidate.Date_registered,
                candidate.flagged_caveatemptor,
                candidate.flagged_reason,
                candidate.flagged_other,
                candidate.flagged_other_status,
                candidate.Testdate,
                candidate.Entity_type,
                candidate.ProbandGender,
                candidate.ProbandDoB,
                caveat_options.Description
            FROM candidate 
            LEFT JOIN caveat_options ON (candidate.flagged_reason = caveat_options.ID)
            WHERE 1=1
        ';
    }

    /**
     * @throws LorisException
     */
    public function getObject(array $primary_key): \LORIS\Data\DTO
    {
        $sql_query =  $this->_query;
        $sql_query .= ' AND candidate.CandID = :v_candid ';
        $params = array('v_candid' => $primary_key[0]);

        if (!$this->_user->hasPermission('access_all_profiles')) {
            $sql_query .= ' AND FIND_IN_SET(CenterID, :v_user_centers) ';
            $params['v_user_centers'] = join(',',$this->_user->getCenterIDs());
        }
        
        $values = $this->_database->pselectRow($sql_query, $params);

        if (empty($values)) {
            throw new \LorisException("This candidate does not exists.");
        }

        $candidate = new Candidate_DTO($values); 
        return $candidate;
    }

    /**
     *
     */
    public function getAll()
    {
        $sql_query = $this->_query;
        $params = array();

        if (!$this->_user->hasPermission('access_all_profiles')) {
            $sql_query .= ' AND FIND_IN_SET(CenterID, :v_user_centers) ';
            $params['v_user_centers'] = join(',',$this->_user->getCenterIDs());
        }

        $values = $this->_database->pselect($sql_query, $params);

        if (empty($values)) {
            throw new \LorisException("No candidate");
        }

        return array_map(function($row) {
            return new Candidate_DTO($row);
        }, $values);
    }

    public function create()
    {

    }

    public function delete()
    {

    }

    public function replace()
    {

    }

    public function update(\LORIS\Data\DTO $modifiedObject)
    {
        $new_values = $candidate->asArray();
        $this->_database->update('candidate', $new_values, array('CandID' => $new_values['CandID']));
    }
}

