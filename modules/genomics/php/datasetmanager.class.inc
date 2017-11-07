<?php
namespace LORIS\genomics;

class DatasetManager
{
    private static $_instance;

    protected function __construct()
    {
    }

    public function getInstance()
    {
        self::$_instance = self::$_instance ?? new DatasetManager();
        return self::$_instance;
    }

    public function getDatasetVariable()
    {
        return array('SNP', 'CNV', 'CPG', 'GWAS');
    }
}
