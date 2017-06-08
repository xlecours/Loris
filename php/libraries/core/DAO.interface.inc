<?php
namespace LORIS\Core;

use LORIS\Core\OV;


interface DAO
{
    /**
     * Create a new DOA instance of the object
     *
     * @return OV
     */
    public static function createValueObject(array $primary_key): OV;
}
