<?php
namespace LORIS\Data;

interface DAO
{
    /**
     * Create a new DTO instance
     *
     * @return VO
     */
    public function getObject(array $primary_key);

    /**
     * Update the database with new values
     *
     * @param DTO $modifiedObject the modified object.
     *
     * @return void
     */
    public function update(DTO $modifiedObject);
}

