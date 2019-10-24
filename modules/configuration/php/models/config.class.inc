<?php declare(strict_types=1);

namespace LORIS\configuration\Models;

class Config implements \LORIS\Data\DataInstance
{
    public function toJSON(): string
    {
        $this->vals = $this->vals ?? '';
        $value      = explode('|', $this->vals);
        if (count($value) === 1) {
            $value = $value[0];
        }

        return json_encode(
            array(
             'Meta'  => array(
                         'name'          => $this->name,
                         'description'   => $this->description,
                         'allowmultiple' => $this->allowmultiple,
                         'datatype'      => $this->datatype,
                         'parent'        => $this->parent,
                         'label'         => $this->label,
                        ),
             'Value' => $value,
            ),
            JSON_FORCE_OBJECT
        );
    }
}
