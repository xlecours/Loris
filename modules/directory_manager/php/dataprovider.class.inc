<?php
/**
 * @category Module
 * @package  Directory_Manager
 * @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

namespace LORIS\directory_manager;

/**
 * @category Module
 * @package  Directory_Manager
 * @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

class Dataprovider extends Directory_Tree
{
    private $cbrain_api;

    protected function __construct()
    {
        // Get path from configs
        $this->root_dir = '/data/data_provider';
        $this->cbrain_api = \LORIS\directory_manager\CBRAIN_API::getInstance();
    }

    // Add sync status
    public function toJSON()
    {
        $tree        = $this->_listDirectoryRecurcive($this->getRootDir());

        $this->cbrain_api->connect();
        $this->cbrain_api->selectDataProviderByName('Epigenomics');

        $cbrain_tree = $this->cbrain_api->listDataProviderFile();
        return json_encode($tree);

    }

/*

$app = new CbrainAPI();
$app->connect();
$app->selectDataProviderByName('Epigenomics');

// Get file list
// var_dump($app->listDataProviderFile());

// Register files
//$f1 = new Swagger\Client\Model\Userfile();
//$f1->setName('a.csv');
//$f1->setType('CSVFile');
//$f2 = new Swagger\Client\Model\Userfile();
//$f2->setName('b.csv');
//$f2->setType('CSVFile');
//$app->registerFiles([$f1, $f2]);

// unregister files
$app->unregisterFiles()

*/

}
