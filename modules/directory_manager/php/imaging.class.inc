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

class Imaging extends Directory_Tree
{
    private $cbrain_api;

    protected function __construct()
    {
        $config = \NDB_Config::singleton();
        
        $this->root_dir = $config->getSetting("data") . 'assembly';
        $this->cbrain_api = \LORIS\directory_manager\CBRAIN_API::getInstance();
    }

    // Add sync status
    public function toJSON()
    {
        $fs_tree = $this->_listDirectoryRecurcive($this->getRootDir());
    //    $db_tree = $this->_listDatabaseFilesAsTree();

    //    $tree = array_merge_recursive($fsTree, $dbTree);
        $tree['className'] = __CLASS__;
        return json_encode($fs_tree);

    }

    private function _listDatabaseFilesAsTree() {
        $DB = \Database::singleton();
        $rows = array_map(
            function ($row) {
                return $row['file'];
            },
            $DB->pselect('select file from files order by file',array())
        );

      $asTree = function($tree, $file_path) use (&$asTree) {
          $chunks = explode('/',$file_path, 2);
          var_dump($chunks);
      };

      $tree = array_reduce($rows, $asTree, array());

      return $files_path;
    }
}
