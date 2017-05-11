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

class CBRAIN extends Directory_Tree
{
    private $cbrain_api;

    protected function __construct()
    {
        $this->cbrain_api = \LORIS\directory_manager\CBRAIN_API::getInstance();
    }

    public function toJSON()
    {
        $file_list = array_map(
            function ($file) {
                return array(
                    'name' => $file->getName(),
                    'isFile' => $file->getType() !== 'FileCollection',
                    'userfile' => json_decode($file->__toString()),
                    'content' => array()
                );
            },
            $this->cbrain_api->getUserFiles()
        );

        return json_encode(array(
            'name' => 'userFiles',
            'content' => $file_list
        ));
    }

    public function getAdditionnalElements($request)
    {
        $fullpath = $request['fullpath'];
        $chunks = explode('/',$fullpath, 2);

        if (basename($this->getRootDir()) !== $chunks[0]) {
            error_log('Wrong path');
            throw new \LorisException('Root directory do not match');
        }
        // TODO : check for database records
        return json_encode($fullpath);
    }

    private function _listDatabaseFilesAsTree() {
        $DB = \Database::singleton();
        $rows = array_map(
            function ($row) {
                error_log(print_r($row,true));
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
