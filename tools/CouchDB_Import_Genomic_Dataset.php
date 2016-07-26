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

    var $CouchDB; // reference to the CouchDB database handler

    function __construct()
    {
        $this->CouchDB = CouchDB::singleton();
    }

    function run($GenomicFileID) 
    {
        $start_time = microtime(true);
        try {

            $dataframe = new Dataframe($GenomicFileID);
            $this->logit("Dataset successfuly initialised");

// TODO remove the print_r
            print_r($dataframe->getDatasetDocument() . "\n");
            $this->logit("Dataset document created");

// TODO insert docuement in CouchDB


            while($doc = $dataframe->getDataVariableDocument()) {
                print_r($doc);
// TODO Insert document in couchDB
            }

        } catch (Exception $e) {
            echo 'Caught exception: ',  $e->getMessage(), "\n";
        }

        echo "Execution time : " . (microtime(true) - $start_time) . " seconds\n";
        exit;
    }

    function logit($message)
    {
        $prefix = '[' . date('Y/m/d h:i:s') . '] ';
        echo $prefix . $message . "\n";
    }
}

class Dataframe 
{
    var $loris_file_id;
    var $file_name;

    var $handle;

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
        $this->loris_file_id = $GenomicFileID;
        $mysql_db = Database::singleton();
        $query = 'SELECT FileName, AnalysisModality from genomic_files WHERE GenomicFileID = :v_file_id';
        $record = $mysql_db->pselectRow($query, array('v_file_id' => $this->loris_file_id));

        if (0 == count($record)) {
            throw new Exception('No genomic_files for that GenomicFileID');
        }

        $this->file_name = $record['FileName'];
        $this->meta['variable_type'] = $record['AnalysisModality'];
    }

    function getDatasetDocument()
    {
       if (!file_exists($this->file_name)) {
           throw new Exception("File not found\n$this->file_name");
       } 
       if (!is_readable($this->file_name)) {
           throw new Exception("File is not readable\n$this->file_name");
       } 

       $this->handle = fopen($this->file_name, "r");
       $this->_skipComments();
       $this->_loadInformations();
       $this->_loadHeaders();

       $this->handle = null;
       return json_encode($this);

    }

    function getDataVariableDocument()
    {
       if (0 == count($this->headers)) {
           throw new Exception("Dataset docuement headers not initialized");
       }

       if (empty($this->handle)) {
           $this->handle = fopen($this->file_name, "r");
           $this->_moveToFirstDataRow();
       } 

       $annotation_labels = array_slice($this->headers, 0, -intval($this->meta['sample_count']) );
       $data = fgetcsv($this->handle);

       if (empty($data) || !$data) {
           return false;
       } else {
           switch ($this->meta['variable_type']) {
               case 'Methylation beta-values':
                   $variable = new MethylationBetaValue($this->loris_file_id, $data[0]);
                   break;
               default:
                   $variable = new DataVariable($this->loris_file_id, $data[0]);
                   break;
           }
           return json_encode($variable);
       }
    }

    private function _skipComments()
    {
        $pattern = '/^###.*/';
        $offset = ftell($this->handle);

        while (preg_match($pattern,fgets($this->handle))) {
            $offset = ftell($this->handle);
        } 

        fseek($this->handle, $offset, SEEK_SET);
    } 

    private function _loadInformations()
    {
        $pattern = '/^## (\w+),(.*)/';
        $offset = ftell($this->handle);        

        while (preg_match($pattern,fgets($this->handle), $matches)) {
            $offset = ftell($this->handle);

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
        fseek($this->handle, $offset, SEEK_SET);
    } 

    private function _loadHeaders()
    {
        $line = fgets($this->handle);
        if ($line[0] != '#') {
            throw new Exception("Expecting headers line instead of \n$line");
        }

        // Parse the headers line
        $line = ltrim($line, '#');
        $headers = str_getcsv($line);
        $annotation_labels = array_slice($headers, 0 , count($headers) - $this->meta['sample_count']);
        $sample_labels = array_splice($headers, -($this->meta['sample_count']));

        // Annotation label formating
        array_walk($annotation_labels, function(&$label) {
            $label = trim($label);
            $label = strtolower($label);
            $label = str_replace(array(' ', '-'), '_', $label); 
        });

        // Check for required fields
        if (!in_array('variable_name',$annotation_labels) ||
            !in_array('chromosome',$annotation_labels) || 
            !in_array('start_loc',$annotation_labels) || 
            !in_array('size',$annotation_labels)) {
            throw new Exception("Required headers missing");
        }

        // Sample label formating
        array_walk($sample_labels, function(&$label) {
            $label = trim($label);
        });

        $this->headers = array_merge($annotation_labels,$sample_labels);
    } 

    private function _moveToFirstDataRow()
    {
        $pattern = '/^#.*/';
        $offset = ftell($this->handle);

        while (preg_match($pattern,fgets($this->handle))) {
            $offset = ftell($this->handle);
        }

        fseek($this->handle, $offset, SEEK_SET);
    }

    private function _get()
    {
        $line = fgets($this->handle);
    }

    function toJSON()
    {
        return json_encode($this);
    }
}

class DataVariable
{
    $data_variable_id;
    
    function __construct($file_id, $variable_name)
    {
        if(empty($file_id) || empty($variable_name)) {
            throw new Exception('Missing required field');
        }
        $this->data_variable_id = "$file_id-$variable_name";
    }

    function initialize($annotation_labels, $data)
    {
        if ($annotation_labels[0] != 'variable_name') {
            throw new Exception("Invalid annotation_labels");
        }
        if (preg_match( $data[0], $this->_variable_id)) {

        }
    }

}

class MethylationBetaValue extends DataVariable
{
    $chromosome;
    $start_loc;
    $size;
    $strand;

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
