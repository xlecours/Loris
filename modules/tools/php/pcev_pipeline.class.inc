<?php
/**
  This is a pipeline to run a pcev analysis from the R package on CBRAIN.

  https://github.com/eauforest/pcev_pipelineCBRAIN
*/
namespace LORIS\tools;

class PCEV_Pipeline extends Tool
{
    public function _setupPage($name, $page, $identifier, $commentID, $formname)
    {
error_log('_setupPage');
       $this->addFile('response_file', 'Response matrix file');
       $this->addRule('response_file', 'Required', 'required');

       $this->addFile('covariate_file', 'Covariates matrix file');
       $this->addRule('covariate_file', 'Required', 'required');

       $this->addFile('confounder_file', 'confounder matrix file');
    }

    public function handlePOST()
    {
        var_dump($_REQUEST);
    }

    /**
     * Add the javascript app to the dependencies.
     *
     * @return array of javascript files to be sourced
     */
    function getJSDependencies()
    {
        $depends = parent::getJSDependencies();
        $baseURL = \NDB_Factory::singleton()->settings()->getBaseURL();
        return array_merge(
            $depends,
            array(
             $baseURL . '/tools/js/PCEVPipelineIndex.js',
            )
        );
    }
}
