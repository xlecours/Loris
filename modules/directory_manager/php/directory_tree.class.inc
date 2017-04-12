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

abstract class Directory_Tree
{

    /**
     * Used to store and provide instances used by getInstance()
     * This class variable ensure that there is only one instance
     * of each subclass that extends this class.
     */ 
    private static $instances = array();

    /**
     * Each DirectoryTree need a root directory to scan.
     * This should be set in the contructor.
     */
    protected $root_dir;

    private function __construct()
    {
    }

    public static function getInstance($path_name)
    {
        $class_name = "LORIS\directory_manager\\" . $path_name ;
        if (class_exists($class_name)) {
            if (!array_key_exists($path_name, self::$instances)) {
                self::$instances[$path_name] = new $class_name();
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

    protected function getRootDir()
    {
        return $this->root_dir;
    }

    abstract protected function toJSON();

    protected function _listDirectoryRecurcive($path)
    {
        $tree = array(
            'name' => basename($path),
            'isReadable' => is_readable($path),
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
