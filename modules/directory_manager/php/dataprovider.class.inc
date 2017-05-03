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
        $config = \NDB_Config::singleton();

        $this->root_dir = $config->getSetting("dataproviderPath");
        $this->cbrain_api = \LORIS\directory_manager\CBRAIN_API::getInstance();
    }

    // Add sync status
    public function toJSON()
    {
        $tree = $this->_listDirectoryRecurcive($this->getRootDir());

        $tree['className'] = __CLASS__;
        return json_encode($tree);

    }

    private function _getRegistrationStatus($relative_path, $force_update=false)
    {
        // Caching of 20 seconds 
        if ($force_update || empty($_SESSION['cbrain_tree']) || time() - $_SESSION['cbrain_tree_last_update'] > 20 ) {
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

    public function getAdditionnalElements($request) 
    {
        $fullpath = $request['fullpath']; 
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

    public function registerFile($request) {
        $this->cbrain_api->connect();
        $this->cbrain_api->selectDataProviderByName('Epigenomics');
        $file_tuples = array_map(function ($relative_path) {
            $file_name = basename($relative_path);
            $full_path = $this->root_dir . '/' . $file_name; 
            $file_type = is_dir($full_path) ? 'FileCollection' : 'SingleFile';
            
            return (object) array (
                'file_name' => $file_name,
                'file_type' => $file_type . '-' . $file_name
            );
        }, $request['filenames']);
        
        $this->cbrain_api->registerFiles($file_tuples);
        $this->_getRegistrationStatus($this->root_dir, true);
    }

    public function unregisterFile($request) {
        $this->cbrain_api->connect();
        $this->cbrain_api->selectDataProviderByName('Epigenomics');
        $basenames = array_map(function ($filename) {
            return basename($filename);
        }, $request['filenames']);
        $this->cbrain_api->unregisterFiles($basenames);
        $this->_getRegistrationStatus($this->root_dir, true);
    }

    public function checkSum($request) {
        $this->cbrain_api->connect();
        $this->cbrain_api->myCheckSum();
    }
}
