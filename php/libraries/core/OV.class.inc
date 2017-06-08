<?php
namespace LORIS\Core;

abstract class OV
{
    /**
     * transform this object in a JSON encoded string.
     *
     * @return void
     */
    public function toJSON() : string
    {
        var_dump(get_class_vars($this));
    }
}
