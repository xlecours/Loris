<?php
require_once 'NDB_Form.class.inc';
require_once 'CouchDB.class.inc';

class NDB_Form_dataset_maker extends NDB_Form
{
    function _hasAccess()
    {
        // create user object
        //$user =& User::singleton();

        // check user permissions
        return true;
    }

    function dataset_maker ()
    {
        $user = User::singleton();
        $username = $user->getUsername();
        $couch = CouchDB::singleton();

        $couch->setDatabase("epigenomics");
        $datasets = $couch->queryView(
            "genomic_browser",
            "samples_by_dataset",
            array(
             "reduce" => "true",
             "group_level" => 1
            )
        );
        $this->tpl_data['available_datasets'] = $datasets;

        $couch->setDatabase("dqt");
        $candidates = $couch->queryView(
            "DQG-2.0",
            "sessions",
            array(
             "reduce" => "true",
             "group_level" => 1
            )
        );
        $this->tpl_data['candidates'] = $candidates;

        $usersaved = $couch->queryView(
            "DQG-2.0",
            "savedqueries",
            array(
             "key" => "\"$username\"",
             "reduce" => "false",
            )
        );

        $globalsaved = $couch->queryView(
            "DQG-2.0",
            "savedqueries",
            array(
             "key" => "\"global\"",
             "reduce" => "false",
            )
        );

        $usersavedNames = array_map(function() {}, $usersaved);
        $globalsavedNames = array_map(function() {}, $globalsaved);

        $this->tpl_data['savedqueries'] = array(
            'user'   => $usersavedNames,
            'shared' => $globalsavedNames
        );
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
                '/dataset_maker/js/dataset_maker_app.js'
            )
        );
    }
}
