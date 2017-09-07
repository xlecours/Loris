<?php
namespace LORIS\tools;

class Task_Manager
{
    private static $_instance;

    private $_task_dir;

    private function __construct()
    {
        $this->createTaskDirectory();
    }

    public function getinstance()
    {
        if (!isset(self::$_instance)) {
            self::$_instance = new Task_Manager();
        }
        return self::$_instance;
    }

    public function stageTask($tool_name, $inputs, $files)
    {
        if (count($files) > 0) {
            $this->saveFiles($files);
        }

/*
        $values = array(
            'file_directory'
        );
        $DB->insert('staged_task' $values);
*/
    }

    private function createTaskDirectory()
    {
       $config = \NDB_Factory::singleton()->config();
       $base = $config->getSetting('base') . 'project/data/staged_tasks/';
       
       $today = date('Ymd');
       $now = microtime(true);

       $dir_name = $base . $today . '/' . $now .'/';
       try {
           mkdir($dir_name, 0774, true);
       } catch (\Exception $e) {
           error_log($e->getMessage());
       }
       $this->_task_dir = $dir_name;
    }

    private function saveFiles()
    {
        $uploader = new \LORIS\Uploader();

        $uploader->setDir($this->_task_dir);
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
    }
}
