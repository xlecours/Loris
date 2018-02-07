<?php

/**
 * Present available dateset and simple filtering options
 */
namespace LORIS\omics;

class Datasets extends \NDB_Page
{
    public $skipTemplate = true;

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
             $baseURL . "/omics/js/datasets.js",
            )
        );
    }
}
