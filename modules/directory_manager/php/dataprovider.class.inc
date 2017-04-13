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
        $this->root_dir = '/data/data-provider';
        $this->cbrain_api = \LORIS\directory_manager\CBRAIN_API::getInstance();
    }

    // Add sync status
    public function toJSON()
    {
        $tree = $this->_listDirectoryRecurcive($this->getRootDir());

        $tree['className'] = __CLASS__;
        return json_encode($tree);

    }

    private function _getRegistrationStatus($relative_path)
    {
        // Caching of 10 seconds 
        if (empty($_SESSION['cbrain_tree']) || time() - $_SESSION['cbrain_tree_last_update'] > 10) {
            $this->cbrain_api->connect();
            $this->cbrain_api->selectDataProviderByName('Epigenomics');
            $_SESSION['cbrain_tree'] = json_encode($this->cbrain_api->listDataProviderFile());
            $_SESSION['cbrain_tree_last_update'] = time();
        }
        $cbrain_tree = json_decode($_SESSION['cbrain_tree']);

        // Custom recursive function that walk down the tree for the requested file
        $find = function($path, $tree) use (&$find) {
          $chunks = explode('/',$path, 2);

          $subtree = array_reduce($tree, function($carry, $item) use ($chunks) {
              if (!empty($carry)) {
                  // already found
                  return $carry;
              }
              if ($item->name == $chunks[0]) {
                  return $item;
              }
          }, array()); 

          if (empty($subtree)) {
              return 'Not found...';
          }

          if (count($chunks) > 1) {
              return $find($chunks[1], $subtree);
          }
          return $subtree->userfile_id;
        };
        
        return $find($relative_path, $cbrain_tree);
    }

    public function getAdditionnalElements($fullpath) {
        $chunks = explode('/',$fullpath, 2);

        if (basename($this->getRootDir()) !== $chunks[0]) {
            error_log('Wrong path');
            throw new \LorisException('Root directory do not match');
        }

        $status = 'online';
        if (count($chunks) > 1) {
            $status = $this-> _getRegistrationStatus($chunks[1]);
        }
        return json_encode(array('registration_status' => $status));
    }

    public function registerFile($file_ids) {
        
        $file_list = array_map(function ($file_id) {
            $cbrain_file = new Swagger\Client\Model\Userfile();
        }, $file_ids);

        $this->cbrain_api->registerFiles($file_list);
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
