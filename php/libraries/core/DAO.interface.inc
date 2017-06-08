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
    public function createValueObject(array $primary_key): OV;

    /**
     * Update the database with new values
     *
     * @param OV the modified object.
     *
     * @return void
     */
    public function updateValueObject(OV $modifiedObject);
}
