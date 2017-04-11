<?php
/**
 * Dataprovider is a Directory_Tree extention class
 *
 * PHP Version 5
 *
 * @category Module
 * @package  Directory_Manager
 * @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

namespace LORIS\directory_manager;

/**
 * Used by directory_manager module
 *
 * PHP Version 5
 *
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
        $this->root_dir = '/data/loris/data';
        //$this->cbrain_api = new CbrainAPI();
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
