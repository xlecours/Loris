#!/usr/bin/php
<?php
// TODO :: genomic_files.AnalysisModality must contain the same value then the pone specified in the dataframe.txt file. (To be garantied by the genomic uploader module)
// TODO :: The dataframe/datamatrix is defined in the genomic_files.FileType fields which is also used in the genomic_uploader for... ?? should it be a new column
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
 *  modules/genomic_browser/couchdb/examples/dataframe.txt file.
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
        $factory = \NDB_Factory::singleton();
        $this->CouchDB = $factory->couchDB('genomics');
    }

    function run($GenomicFileID) 
    {
        $start_time = microtime(true);

        $mysql_db = Database::singleton();
        $query = 'SELECT FileName, FileType, AnalysisModality, couchdb_doc_id, fileset_id from genomic_files WHERE GenomicFileID = :v_file_id';
        $genomic_file = $mysql_db->pselectRow($query, array('v_file_id' => $GenomicFileID));

        if (0 == count($genomic_file)) {
            die("Error: No genomic_files for that GenomicFileID\n");
        }

        if (!class_exists($genomic_file['FileType'])) {
            die("Error: The class $genomic_file[FileType] does not exists\n");
        }


        // Create dataset document en insert it in CouchDB 
        try {

            $class_name = $genomic_file['FileType'];

            switch ($class_name) {

                case 'Datamatrix' :
                    // find the annotation file name
                    $query = "SELECT FileName from genomic_files WHERE fileset_id = :v_fileset_id AND FileType = 'Variable Annotations'";
                    $annotation_file = $mysql_db->pselectRow($query, array('v_fileset_id' => $genomic_file['fileset_id'] ));

                    if (0 == count($annotation_file)) {
                        die("Error: No annotation file for that GenomicFileID\n");
                    }

                    $dataset = new Datamatrix($GenomicFileID, $genomic_file['FileName'], $genomic_file['AnalysisModality'], $annotation_file['FileName']);
                    $this->logit("Dataset successfuly initialised");
                    break;
                case 'Dataframe' :
                default: 
                    $dataset = new $class_name($GenomicFileID, $genomic_file['FileName'], $genomic_file['AnalysisModality']);
                    $this->logit("Dataset successfuly initialised");
                    break;
            }

            // Make sur that the class extends the Dataset abstract class
            is_a($dataset, 'Dataset') || die("The FileType ($class_name) does not extends the Dataset abstract class");

            $doc = $dataset->getDatasetDocument();

            $_id = 'genomic_dataset-' . $doc->loris_file_id; 

// TODO remove the set database or use a config value
            $this->CouchDB->setDatabase('genomics');

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
            exit;
        }

        // Insert a variable document in CouchDB for each row, adding the annotation
        // of that row in the document.
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
            $this->logit('Advancement report:');
            print_r($this->report);

        } catch (Exception $e) {
            echo 'Caught exception: ',  $e->getMessage(), "\n";
        }

        echo "Execution time : " . (microtime(true) - $start_time) . " seconds\n";
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

    /*
     * This is skipping every rows ifrom $handle that start with a triple dash ###
     */
    protected function _skipComments(&$handle)
    {
        $pattern = '/^###.*/';
        $offset = ftell($handle);

        while (preg_match($pattern,fgets($handle))) {
            $offset = ftell($handle);
        }

        fseek($handle, $offset, SEEK_SET);
    }

    /*
     * This advance the file pointer to the begining of the first row that don't start with a dash #
     */
    protected function _moveToFirstDataRow(&$handle)
    {
        $pattern = '/^#.*/';
        $offset = ftell($handle);

        while (preg_match($pattern,fgets($handle))) {
            $offset = ftell($handle);
        }

        fseek($handle, $offset, SEEK_SET);
    }

    // Will read all lines starting with ## until a line does not start with ##. Then move back to the start of that line.
    protected function _loadInformations(&$handle)
    {
        $pattern = '/^## (\w+),(.*)/';
        $offset = ftell($handle);

        while (preg_match($pattern,fgets($handle), $matches)) {
            $offset = ftell($handle);

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
        fseek($handle, $offset, SEEK_SET);
    }

    // read the current line in the file and fill the headers.
    // the current line must start with a #
    // this function expect the field separator to be a comma
    // $this->meta['sample_count'] must already be set
    protected function _loadHeaders(&$handle)
    {
        $line = fgets($handle);
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
        if (!in_array('variable_name',$annotation_labels)) { 
            throw new Exception("Required headers missing");
        }

        // Sample label formating
        array_walk($sample_labels, function(&$label) {
            $label = trim($label);
        });

        $this->headers = array_merge($annotation_labels,$sample_labels);
    }
}

class Datamatrix extends Dataset
{
    var $loris_file_id;
    var $file_name;
    var $annotation_file_name;

    var $handle;

    var $meta = array(
        'doctype'         => 'dataset',
        'file_format'     => 'datamatrix',
        'variable_type'   => null,
        'variable_format' => null,
        'sample_count'    => null,
        'ad_libitum'      => array()
    );

    var $headers = [];

    function __construct( $GenomicFileID, $filename, $analysis_modality, $annotation_filename )
    {
        $this->loris_file_id = $GenomicFileID;
        $this->file_name = $filename;
        $this->annotation_file_name = $annotation_filename;
        $this->meta['variable_type'] = $analysis_modality;
    }

    /*
     * Create a JSON representation of this dataset file
     */
    function getDatasetDocument()
    {
        if (!file_exists($this->file_name)) {
            throw new Exception("File not found\n$this->file_name");
        }
        if (!is_readable($this->file_name)) {
            throw new Exception("File is not readable\n$this->file_name");
        }
        if (!file_exists($this->annotation_file_name)) {
            throw new Exception("Annotation file not found\n$this->annotation_file_name");
        }
        if (!is_readable($this->annotation_file_name)) {
            throw new Exception("Annotation file is not readable\n$this->annotation_file_name");
        }

        $this->handle = fopen($this->file_name, "r");
        $this->_skipComments($this->handle);

        $this->_loadInformations($this->handle);
        $this->_loadHeaders($this->handle);

        unset($this->headers[0]);

        $this->_addAnnotationHeaders();

        // Check for required fields
        if (!in_array('variable_name',$this->headers) ||
            !in_array('chromosome',$this->headers) ||
            !in_array('start_loc',$this->headers)) {
            throw new Exception("Required headers missing");
        }

        unset($this->handle);
        return $this;
    }

    /*
     * Build a JSON representation of the next row in the file
     */
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

           $annotation_data = $this->_getVariableAnnotation($data[0]);                   
           unset($data[0]);
           $data = array_merge($annotation_data, $data);

           switch ($this->meta['variable_type']) {
               case 'Methylation beta-values':
                   $variable_class = 'MethylationBetaValue';
                   break;
               default:
                   $variable_class = 'DataVariable';
                   break;
           }
           $variable = new $variable_class(
               $this->loris_file_id,
               $this->meta['variable_type'],
               $data[0]
           );
           $variable->initialize(
               $annotation_labels,
               $data
           );
           return $variable;
       }
    }

    private function _addAnnotationHeaders()
    {
        $handle = fopen($this->annotation_file_name, 'r');

        $pattern = '/^#.*/';
        $offset = ftell($handle);

        while (preg_match($pattern,fgets($handle))) {
            $offset = ftell($handle);
        }

        fseek($handle, $offset, SEEK_SET);

        $annotation = fgetcsv($handle); 
        $annotation[0] = 'variable_name';

        // Annotation label formating
        array_walk($annotation, function(&$label) {
            $label = trim($label);
            $label = strtolower($label);
            $label = str_replace(array(' ', '-'), '_', $label);
        });
        
        $this->headers = array_merge($annotation, $this->headers);
    }

    private function _getVariableAnnotation($variable_name)
    {
        $annotation = array();
        $handle = fopen($this->annotation_file_name, 'r');

        $pattern = '/^#.*/';

        while (preg_match($pattern,fgets($handle))) {}

        $pattern = "/$variable_name/";
        
        while (!feof($handle)) {
            $line = fgetcsv($handle, 4096);
            if (preg_match($pattern, $line[0])) { 
                $annotation = $line; 
            }
        }
        fclose($handle);
        return $annotation;
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
        $this->_loadInformations($this->handle);
        $this->_loadHeaders($this->handle);

        // Check for required fields
        if (!in_array('variable_name',$this->headers) ||
            !in_array('chromosome',$this->headers) ||
            !in_array('start_loc',$this->headers) ||
            !in_array('size',$this->headers)) {
            throw new Exception("Required headers missing");
        }

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
                   $variable_class = 'MethylationBetaValue';
                   break;
               default:
                   $variable_class = 'DataVariable';
                   break;
           }
           $variable = new $variable_class(
               $this->loris_file_id,
               $this->meta['variable_type'],
               $data[0]
           );
           $variable->initialize(
               $annotation_labels,
               $data
           );
           return $variable;
       }
    }
}

class DataVariable
{
    var $_id;
    var $meta = array(
        'doctype' => 'variable',
        'identifier' => array(
            'variable_name' => null,
            'variable_type' => null,
            'genomic_file_id' => null
        )
    );
    var $values = array();
    var $properties = array();
    
    function __construct($file_id, $variable_type, $variable_name)
    {
        if(empty($file_id) || empty($variable_name)) {
            throw new Exception('Missing required field');
        }
        $this->_id = "$file_id-$variable_name";
        $this->meta['identifier']['genomic_file_id'] = $file_id;
        $this->meta['identifier']['variable_type'] = $variable_type;
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

class AnnotationFile
{
// TODO
    var $filename;
    var $handle;
    
    public function getVariableAnnotation($variable_name)
    {
        $annotation = array();

        return $annotation;
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
