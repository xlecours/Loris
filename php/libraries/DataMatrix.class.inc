<?php
/**
 * This is a class representation of an R data.matrix datatype.
 *
 *  @category Dataset
 *  @package  Genomics
 *  @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 *  @link     https://www.github.com/aces/Loris/
 */

namespace LORIS\genomics;

/**
 *  @category Dataset
 *  @package  Genomics
 *  @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 *  @link     https://www.github.com/aces/Loris/
 */
class DataMatrix extends Dataset
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
            throw new \Exception("File not found\n$this->file_name");
        }
        if (!is_readable($this->file_name)) {
            throw new \Exception("File is not readable\n$this->file_name");
        }
        if (!file_exists($this->annotation_file_name)) {
            throw new \Exception("Annotation file not found\n$this->annotation_file_name");
        }
        if (!is_readable($this->annotation_file_name)) {
            throw new \Exception("Annotation file is not readable\n$this->annotation_file_name");
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
            throw new \Exception("Required headers missing");
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
           throw new \Exception("Dataset document headers not initialized");
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

