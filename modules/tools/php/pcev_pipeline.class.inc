<?php
/**
  This is a pipeline to run a pcev analysis from the R package on CBRAIN.

  https://github.com/eauforest/pcev_pipelineCBRAIN
*/
namespace LORIS\tools;

use \LORIS\CBRAIN\CBRAIN_API_client;

class PCEV_Pipeline extends Tool
{
    public function _setupPage($name, $page, $identifier, $commentID, $formname)
    {
       $this->addFile('response_file', 'Response matrix file');
       $this->addRule('response_file', 'Required', 'required');

       $this->addFile('covariate_file', 'Covariates matrix file');
       $this->addRule('covariate_file', 'Required', 'required');

       $this->addFile('confounder_file', 'confounder matrix file');
    }

    public function handlePOST()
    {
        
        $uploader = new \LORIS\Uploader();

        $uploader->setDir('/data/dataprovider/');
        $uploader->setMaxSize(100);
        $uploader->allowAllFormats();
        $uploader->setSameFileName();

        array_walk($_FILES, function ($file, $key) use ($uploader) {
            if ($file['error'] === 0) {
                if (!$uploader->uploadFile($key)) {
                    error_log($uploader->getMessage());
                }
            }
        }, $_FILES);

        $client = CBRAIN_API_client::getInstance();
        $client->connect();
        $client->selectDataproviderByName('Epigenomics');
        print_r($client->listDataProviderFile(),true);
        exit;
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
