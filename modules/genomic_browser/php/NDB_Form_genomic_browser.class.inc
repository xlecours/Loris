<?php
require_once 'NDB_Form.class.inc';
require_once 'CouchDB.class.inc';

class NDB_Form_genomic_browser extends NDB_Form
{
    function _hasAccess()
    {
        // create user object
        //$user =& User::singleton();
        // check user permissions
        return true;
    }

    function genomic_browser()
    {
        $user = User::singleton();
        $username = $user->getUsername();
        $couch = CouchDB::singleton();
        $couch->setDatabase("test_epi");
        $datasets = $couch->queryView(
            "genomic_browser",
            "samples_by_dataset",
            array(
             "reduce" => "true",
             "group_level" => 1
            )
        );
        $this->tpl_data['available_datasets'] = $datasets;
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
                '/genomic_browser/js/genomic_browser_app.js'
            )
        );
    }
}
