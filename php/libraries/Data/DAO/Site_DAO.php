<?php
/**
 * Candidate Data Access Object (DAO).
 *
 * This class contains all database handling that is needed to 
 * permanently store and retrieve Candidate object instances.
 */
namespace LORIS\Data\DAO;

use \LORIS\Data\DTO\Site_DTO;

class Site_DAO implements DAO
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
                CenterID,
                Name,
                PSCArea,
                Address,
                City,
                StateID,
                ZIP,
                Phone1,
                Phone2,
                Contact1,
                Contact2,
                Alias,
                MRI_alias,
                Account,
                Study_site
            FROM psc
            WHERE 1=1
        ';
    }

    /**
     * @throws LorisException
     *
     * @return Site_DTO the requested site.
     */
    public function getObject(array $primary_key)
    {
        $sql_query =  $this->_query;
        $sql_query .= ' AND CenterID = :v_center_id ';
        $params = array('v_center_id' => $primary_key[0]);

        $values = $this->_database->pselectRow($sql_query, $params);

        if (empty($values)) {
            throw new \LorisException("This candidate does not exists.");
        }

        $site = new Site_DTO($values); 
        return $site;
    }

    /**
     *
     */
    public function getAll()
    {
        $sql_query = $this->_query;
        $params = array();

        $values = $this->_database->pselect($sql_query, $params);

        if (empty($values)) {
            throw new \LorisException("No candidate");
        }

        return array_map(function($row) {
            return new Site_DTO($row);
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
        $this->_database->update('psc', $new_values, array('CenterId' => $new_values['CenterID']));
    }
}

