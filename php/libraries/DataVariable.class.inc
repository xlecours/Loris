<?php
namespace LORIS\genomics;

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
            throw new \Exception('Missing required field');
        }
        $this->_id = "$file_id-$variable_name";
        $this->meta['identifier']['genomic_file_id'] = $file_id;
        $this->meta['identifier']['variable_type'] = $variable_type;
    }

    function initialize($annotation_labels, $data)
    {
        if ($annotation_labels[0] != 'variable_name') {
            throw new \Exception("Invalid annotation_labels");
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
