<?php
/**
 * This file contains the Directory_Tree class
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
 * Used directory_manager module
 *
 * PHP Version 5
 *
 * @category Module
 * @package  Directory_Manager
 * @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

class Directory_Tree
{

    /**
     * Used to store and provide instances for the getInstance() method
     */ 
    private static $instances = array();

    /**
     * Used to store the valid paths for instanciation
     */ 
    private static $valid_paths = array(
        'dataprovider'
    );

    private $root_dir;

    private function __construct()
    {
        // Get path from configs
        $this->root_dir = '/data/loris/data';
    }

    public static function getInstance($path_name)
    {
        if (array_search($path_name, self::$valid_paths) !== false) {
            if (!array_key_exists($path_name, self::$instances)) {
                self::$instances[$path_name] = new self();
            }
            return self::$instances[$path_name];
        } else {
            throw new \LorisException('Invalid path for directory_tree : ' . $path_name);
        }
    }

    /**
     * Hidden magic clone method, make sure no instances of this class 
     * can be cloned using the clone keyword
     */
    private function __clone()
    {
    }

    public function toJSON()
    {
        $tree = $this->_listDirectoryRecurcive($this->root_dir);
        return json_encode($tree);
    }

    private function _listDirectoryRecurcive($path)
    {
        $tree = array(
            'name' => basename($path),
            'files' => array(),
            'directories' => array()
        );

        if ($handle = opendir($path)) {
            while (false !== ($entry = readdir($handle))) {
                $full_path = $path . '/' . $entry;
                if ($entry != "." && $entry != "..") {
                    if (is_dir($path . '/' . $entry)) {
                        array_push($tree['directories'], $this->_listDirectoryRecurcive($full_path));
                    } else {
                        array_push($tree['files'], $entry);
                    }
                }
            }
            closedir($handle);
        }
        return $tree;
    }
}
