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

class DataframeImporter
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
        'sample_count'    => null,
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
       $this->_loadDataRows($handle);
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
        $pattern = '/^## (\w+),(.*)/';
        $offset = ftell($handle);        

        while (preg_match($pattern,fgets($handle), $matches)) {
            $offset = ftell($handle);

            switch ($matches[1]) {
                case 'variable_type':
                    if ($matches[2] != $this->meta['variable_type']) {
                        throw new Exception("variable_type does not match between file content ($matches[2]) and database record ($this->meta[variable_type])");
                    }
                    break;
                case 'variable_format':
                    if (1 != preg_match('/float|integer|string/', $matches[2])) {
                        throw new Exception("variable_format must be one of float, integer or string");
                    }
                    $this->meta['variable_format'] = $matches[2];
                    break;
                case 'sample_count':
                    $sample_count = intval($matches[2]);
                    if ($sample_count != $matches[2] || $sample_count == 0) {
                        throw new Exception("sample_count must be an integer greater than 0");
                    }
                    $this->meta['sample_count'] = $sample_count;
                    break;
                default:
                    $this->meta['ad_libitum'][$matches[1]] = $matches[2];
                    break;
            }
        }
        fseek($handle, $offset, SEEK_SET);
    } 

    private function _loadHeaders(&$handle)
    {
        $offset = ftell($handle);
        $line = fgets($handle);
        if ($line[0] != '#') {
            throw new Exception("Expecting headers line instead of \n$line");
        }
        $line = ltrim($line, '#');
        $headers = str_getcsv($line);
        $annotation_labels = array_slice($headers, 0 , count($headers) - $this->meta['sample_count']);
        $sample_labels = array_splice($headers, -($this->meta['sample_count']));

        array_walk($annotation_labels, function(&$label) {
            $label = trim($label);
            $label = strtolower($label);
            $label = str_replace(array(' ', '-'), '_', $label); 
        });

        if (!in_array('variable_name',$annotation_labels) || !in_array('chromosome',$annotation_labels) || !in_array('start_loc',$annotation_labels) || !in_array('size',$annotation_labels)) {
            throw new Exception("Required headers missing");
        }

        $this->headers = array_merge($annotation_labels,$sample_labels);
    } 

    private function _loadDataRows(&$handle)
    {
        var_dump(fgets($handle));
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
    
    $Runner = new DataframeImporter();
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
