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
 *  The GenomicDatasetImporter follow the specifications described in the 
 *  modules/genomic_browser/couchdb/examples/data.frame.csv file.
 *
 *  It will import any dataset following those rules into CouchDB.
 *
 *  @category Genomics
 *  @package  Main
 *  @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 *  @link     https://www.github.com/aces/Loris-Trunk/
 */

class GenomicDatasetImporter
{
    // reference to the CouchDB database handler
    var $CouchDB; 

    // Placeholder for genomic variable importation
    var $report = array(
        'count' => 0,
        'ok'    => 0,
        'error' => 0
    );

    function __construct()
    {
        $this->CouchDB = CouchDB::singleton();
    }

    function run($GenomicFileID) 
    {
        $start_time = microtime(true);

        $mysql_db = Database::singleton();
        $query = 'SELECT FileName, FileType, AnalysisModality, couchdb_doc_id from genomic_files WHERE GenomicFileID = :v_file_id';
        $genomic_file = $mysql_db->pselectRow($query, array('v_file_id' => $GenomicFileID));

        if (0 == count($genomic_file)) {
            die('No genomic_files for that GenomicFileID');
        }

        if (!class_exists($genomic_file['FileType'])) {
            die("The class $genomic_file[FileType] does not exists");
        }

        try {

            $class_name = $genomic_file['FileType'];

            switch ($class_name) {
                case 'Dataframe' :
                    $dataset = new Dataframe($GenomicFileID, $genomic_file['FileName'], $genomic_file['AnalysisModality']);
                    $this->logit("Dataset successfuly initialised");
                    break;
                case 'Datamatrix' :
// TODO
                    break;
                default:
// TODO
                    break;
            }

            // Make sur that the class extends the Dataset abstract class
            is_a($dataset, 'Dataset') || die("The FileType ($class_name) does not extends the Dataset abstract class");

            $doc = $dataset->getDatasetDocument();

            $_id = 'genomic_dataset-' . $doc->loris_file_id; 

// TODO remove the set database or use a config value
            $this->CouchDB->setDatabase('test_epi');

            if (empty($genomic_file['couchdb_doc_id'])) {
                $response = $this->CouchDB->postDoc((Array) $doc);
            } else {
                $response = $this->CouchDB->replaceDoc($genomic_file['couchdb_doc_id'], (Array) $doc);
            }

            switch ($response) {
                case 'unchanged contents':
                    $this->logit("Dataset document has not changed");
                    break;
                case 'modified':
                case 'new':
                    $this->logit($response);
                    $this->logit("Dataset document imported sucessfully");
                    break;
                default:
                    $this->logit($response);
 
                    $id = json_decode($response)->id;
                    $mysql_db->update(
                        'genomic_files',
                        array('couchdb_doc_id' => $id),
                        array('GenomicFileID' => $GenomicFileID)
                    );
            }

        } catch (Exception $e) {
            echo 'Caught exception: ',  $e->getMessage(), "\n";
        }

        try {
            $this->logit('Importing genomic variables');

            $this->CouchDB->beginBulkTransaction();
            while($doc = $dataset->getNextDataVariableDocument()) {
                $this->CouchDB->replaceDoc($doc->_id, (Array) $doc);

                if (++$this->report['count'] % 200 == 0) {
                    $response = $this->CouchDB->commitBulkTransaction();
                   
                    array_walk(json_decode($response, true),function ($v, $i) {
                        if (empty($v['ok'])) { 
                            $this->logit(print_r($v,true));   
                            $this->report['error']++;
                        } else {
                            $this->report['ok']++;
                        }
                    }); 

                    $this->CouchDB->beginBulkTransaction();
                    $this->logit('Advancement report:');
                    print_r($this->report);
                }
            }
            $response = $this->CouchDB->commitBulkTransaction();

            array_walk(json_decode($response, true),function ($v, $i) {
                if (empty($v['ok'])) {
                    $this->logit(print_r($v,true));
                    $this->report['error']++;
                } else {
                    $this->report['ok']++;
                }
            });

            $this->logit('Genomic variables importation completed');
            print_r($this->report);

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

abstract class Dataset
{
    // Abstract methods
    abstract public function getDatasetDocument();
    abstract public function getNextDataVariableDocument();

    protected function _skipComments(&$handle)
    {
        $pattern = '/^###.*/';
        $offset = ftell($handle);

        while (preg_match($pattern,fgets($handle))) {
            $offset = ftell($handle);
        }

        fseek($handle, $offset, SEEK_SET);
    }

    protected function _moveToFirstDataRow(&$handle)
    {
        $pattern = '/^#.*/';
        $offset = ftell($handle);

        while (preg_match($pattern,fgets($handle))) {
            $offset = ftell($handle);
        }

        fseek($handle, $offset, SEEK_SET);
    }
}

class Datamatrix extends Dataset
{
    function getDatasetDocument()
    {
// TODO
    }

    function getNextDataVariableDocument()
    {
// TODO
    }
}

class Dataframe extends Dataset 
{
    var $loris_file_id;
    var $file_name;

    var $handle;

    var $meta = array(
        'doctype'         => 'dataset',
        'file_format'     => 'dataframe',
        'variable_type'   => null,
        'variable_format' => null,
        'sample_count'    => null,
        'ad_libitum'      => array()
    );

    var $headers = [];

    function __construct( $GenomicFileID, $filename, $analysis_modality )
    {
        $this->loris_file_id = $GenomicFileID;
        $this->file_name = $filename;
        $this->meta['variable_type'] = $analysis_modality;
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
       $this->_skipComments($this->handle);
       $this->_loadInformations();
       $this->_loadHeaders();

       unset($this->handle);
       return $this;

    }

    function getNextDataVariableDocument()
    {
       if (0 == count($this->headers)) {
           throw new Exception("Dataset document headers not initialized");
       }

       if (empty($this->handle)) {
           $this->handle = fopen($this->file_name, "r");
           $this->_moveToFirstDataRow($this->handle);
       } 

       $annotation_labels = array_slice($this->headers, 0, -intval($this->meta['sample_count']) );
       $data = fgetcsv($this->handle);

       if (empty($data) || !$data) {
           return false;
       } else {
           switch ($this->meta['variable_type']) {
               case 'Methylation beta-values':
                   $variable = new MethylationBetaValue($this->loris_file_id, $data[0]);
                   $variable->initialize($annotation_labels, $data);
                   break;
               default:
                   $variable = new DataVariable($this->loris_file_id, $data[0]);
                   break;
           }
           return $variable;
       }
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
                        throw new Exception('variable_type does not match');
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
}

class DataVariable
{
    var $_id;
    var $meta = array(
        'doctype' => 'variable',
        'identifier' => array(
            'variable_name' => null,
            'genomic_file_id' => null
        )
    );
    var $values = array();
    var $properties = array();
    
    function __construct($file_id, $variable_name)
    {
        if(empty($file_id) || empty($variable_name)) {
            throw new Exception('Missing required field');
        }
        $this->_id = "$file_id-$variable_name";
        $this->meta['identifier']['genomic_file_id'] = $file_id;
    }

    function initialize(&$annotation_labels, &$data)
    {
        if ($annotation_labels[0] != 'variable_name') {
            throw new Exception("Invalid annotation_labels");
        }
        
        $annotation_count =  count($annotation_labels);
        $this->properties = array_combine(
            $annotation_labels,
            array_slice($data, 0, $annotation_count)
        );
        $this->meta['identifier']['variable_name'] = $this->properties['variable_name'];
        unset($this->properties['variable_name']);

        $this->values = array_slice($data, $annotation_count);
    }

}

class MethylationBetaValue extends DataVariable
{

    function initialize(&$annotation_labels, &$data)
    {
        Parent::initialize($annotation_labels, $data);

        if (empty($this->properties['chromosome']) ||
            empty($this->properties['start_loc']))
        {
            throw new Exception("Invalid annotation_labels");
        }

        $this->meta['identifier']['chromosome'] = $this->properties['chromosome'];
        unset($this->properties['chromosome']);
        $this->meta['identifier']['start_loc'] = $this->properties['start_loc'];
        unset($this->properties['start_loc']);
        $this->meta['identifier']['size'] = 1;
        unset($this->properties['size']);
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
    
    $Runner = new GenomicDatasetImporter();
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
