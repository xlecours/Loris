#!/usr/bin/php
<?php
/**
 * This file should be use to insert a data.frame.csv file in CouchDB.
 * The arguments should be the file_id of that file.
 *
 * PHP Version 5
 *
 *  @category Genomics
 *  @package  Main
 *  @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 *  @link     https://www.github.com/aces/Loris-Trunk/
 */

require_once __DIR__ . "/../vendor/autoload.php";
require_once 'generic_includes.php';
require_once 'CouchDB.class.inc';
require_once 'Database.class.inc';
require_once 'Utility.class.inc';

/**
 * The Dataframe_parser follow the specifications described in the 
 * modules/genomic_browser/couchdb/examples/data.frame.csv file.
 *
 *  @category Genomics
 *  @package  Main
 *  @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 *  @link     https://www.github.com/aces/Loris-Trunk/
 */

class Dataframe_Parser 
{

    var $SQLDB; // reference to the database handler, store here instead
                // of using Database::singleton in case it's a mock.

    var $CouchDB; // reference to the CouchDB database handler


    function __construct()
    {
        $this->SQLDB   = Database::singleton();
        $this->CouchDB = CouchDB::singleton();
    }

    function run($GenomicFileID) 
    {
        try {

            $dataframe = new Dataframe($GenomicFileID);
            $dataframe->loadFile();
            var_dump($dataframe);

        } catch (Exception $e) {
            echo 'Caught exception: ',  $e->getMessage(), "\n";
        }
        echo "Finish\n";
        return true;
    }
}

class Dataframe 
{
    var $file_id;
    var $file_name;

    var $meta = array(
        'doctype'         => 'dataset',
        'file_format'     => 'data.frame',
        'variable_type'   => null,
        'variable_format' => null,
        'variable_count'  => null,
        'ad_libitum'      => array()
    );

    var $headers = [];

    function __construct( $GenomicFileID )
    {
        $this->file_id = $GenomicFileID;
        $mysql_db = Database::singleton();
        $query = 'SELECT FileName, AnalysisModality from genomic_files WHERE GenomicFileID = :v_file_id';
        $record = $mysql_db->pselectRow($query, array('v_file_id' => $this->file_id));

        if (0 == count($record)) {
            throw new Exception('No genomic_files for that GenomicFileID');
        }

        $this->file_name = $record['FileName'];
        $this->meta['variable_type'] = $record['AnalysisModality'];
    }

    function loadFile()
    {
       if (!file_exists($this->file_name)) {
           throw new Exception("File not found\n$this->file_name");
       } 
       if (!is_readable($this->file_name)) {
           throw new Exception("File is not readable\n$this->file_name");
       } 

       $handle = fopen($this->file_name, "r");
       $this->_skipComments($handle);
       $this->_loadInformations($handle);
       $this->_loadHeaders($handle);
       fclose($handle);

    }

    private function _skipComments(&$handle)
    {
        $pattern = '/^###.*/';
        $offset = ftell($handle);

        while (preg_match($pattern,fgets($handle))) {
            $offset = ftell($handle);
        } 

        fseek($handle, $offset, SEEK_SET);
    } 

    private function _loadInformations(&$handle)
    {
        $bob = fgets($handle);
    } 

    private function _loadHeaders(&$handle)
    {
        $bob = fgets($handle);       
    } 
}

if(!class_exists('UnitTestCase')) {

    // Validate arguments
    if (count($argv) != 2) {
        echo "Error : Invalid argument count\n";
        show_usage();
    }
    if (!is_numeric($argv[1])) {
        echo "Error : GenomicFileID should be a numeric value\n";
        echo $argv[1] . "\n";
        show_usage();
    }
    
    $Runner = new Dataframe_Parser();
    $Runner->run($argv[1]);
}

function show_usage() {
    echo "\nUsage\n";
    echo "    php CouchDB_Import_Genomic_Dataset.php GenomicFileID\n\n";
    echo "GenomicFileID\n";
    echo "    The id of the file in the MySQL genomic_files table.\n\n";
    die;
}
?>
