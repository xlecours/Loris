<?php

/**
 * Present available dateset and simple filtering options
 */
namespace LORIS\omics;

class Datasets extends \NDB_Menu_Filter
{
    public $skipTemplate = true;
    public $AjaxModule   = true;

    public function _hasAccess()
    {
        return true;
    }

    public function setup()
    {
        $factory     = \NDB_Factory::singleton();
        $this->couch = $factory->couchdb('genomics_test');
        $this->mysql = $factory->database();
    }

    /**
     * Override called with format=json
     */
    public function _getFullList()
    {
        $this->headers = array(
                          'fileset_id',
                          'origin',
                          'ShortDescription',
                          'timestamp_added',
                          'couch_doc',
                         );
        $data          = array();

        $filesets = $this->mysql->pselect(
            "SELECT 
              fileset_id,
              origin,
              ShortDescription,
              timestamp_added,
              couchdb_doc_id
            FROM
              fileset",
            array()
        );

        foreach ($filesets as $index => $fileset) {
            $doc = null;
            if (!empty($fileset['couchdb_doc_id'])) {
                $doc = $this->couch->getDoc($fileset['couchdb_doc_id'], array());
            }
            unset($fileset['couchdb_doc_id']);
            $fileset['couch_doc'] = $doc;
            $data[$index]         = $fileset;
        }

        return $data;
    }

    /**
     * Overrides base getJSDependencies()
     *
     * @return an array of extra JS files that this page depends on
     */
    function getJSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            array(
             $baseURL . "/omics/js/OmicsApp.js",
            )
        );
    }
}
