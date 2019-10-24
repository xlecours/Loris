<?php declare(strict_types=1);

namespace LORIS\configuration\Models;

class Configs implements \LORIS\Data\DataInstance
{
    public function toJSON(): string
    {
        return json_encode(
            array(
             'name'          => $this->name,
             'description'   => $this->description,
             'allowmultiple' => $this->allowmultiple,
             'datatype'      => $this->datatype,
             'parent'        => $this->parent,
             'label'         => $this->label,
            ),
            JSON_FORCE_OBJECT
        );
    }
}
