<?php
namespace LORIS\Data\DTO;

abstract class DTO
{
    public function __toString()
    {
        return json_encode($this->asArray());
    }

    public function asArray()
    {
        // get all object vars
        $object_vars = get_object_vars($this);

        // Remove the '_' prefix from the keys
        $new_keys = array_map(function($key) {return ltrim($key, '_'); }, array_keys($object_vars));

        return array_combine($new_keys, array_values($object_vars));
    }

}
