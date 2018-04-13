<?php

namespace LORIS;

class Breadcrumb
{

    protected $label;
    protected $link;

    public function __construct(string $label = '', string $link = '')
    {
        $this->label = $label;
        $this->link = $link;
    }

    public function __toString() : string
    {
        return json_encode(array(
            'text' => $this->label,
            'query' => $this->link
        ), JSON_FORCE_OBJECT);
    }
}
