<?php

/**
 * Present available dateset and simple filtering options
 */
namespace LORIS\omics;

class Datasets extends \NDB_Menu_Filter
{
    public $skipTemplate = true;
    public $AjaxModule = true;

    public function _hasAccess()
    {
        return true;
    }
 
    public function setup()
    {
        $this->couch = (\NDB_Factory::singleton())->couchdb('genomics_test');
    }

    /**
     * Override called with format=json
     */
    public function _getFullList()
    {
        error_log('_getFullList');
        $this->headers = array(
            'id',
            'rev',
            'identifier',
            'fileset',
            'mapping'
        );
        return array_map( function ($row) {
            return $row['doc'];
        }, $this->couch->queryView(
            'genomic_browser',
            'datasets',
            array('reduce' => 'false', 'include_docs' => 'true'),
            false)
        );
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
