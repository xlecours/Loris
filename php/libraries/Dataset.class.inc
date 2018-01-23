<?php
namespace LORIS\genomics;

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
