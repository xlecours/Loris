<?php declare(strict_types=1);

namespace LORIS\Data\Models;

class ConfigSettingDTO implements \LORIS\Data\DataInstance
{
    public function __construct()
    {
        // The constructr is called after the instance variables have been set.
        // Since vals are results from JSON_ARRARG, json_decode must be used.
        $this->vals = json_decode($this->vals);
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getValue()
    {
        return $this->vals;
    }

    public function toArray(): array
    {
        return array(
             'Meta'  => array(
                         'name'          => $this->name,
                         'description'   => $this->description,
                         'allowmultiple' => $this->allowmultiple,
                         'datatype'      => $this->datatype,
                         'parent'        => $this->parent,
                         'label'         => $this->label,
                        ),
             'Value' => $this->vals,
            );
    }

    public function toJSON(): string
    {
        return json_encode(
            $this->toArray(),
            JSON_FORCE_OBJECT
        );
    }

    /**
     * @param array|string $newvalue The new value.
     */
    public function withValue($newvalue): ConfigSettingDTO
    {
        $new = clone($this);
        $new->vals = $newvalue;
        return $new;
    }
}
