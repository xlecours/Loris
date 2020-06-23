<?php declare(strict_types=1);
namespace LORIS\dqt;

class NotEqualFilter
{
    private $_value; 

    public function __construct(string $value)
    {
        $this->_value = $value;
    } 

    public function filter(string $json): bool
    {
        $value = json_decode($json,true)['key'][2];
        return $value !== $this->_value;
    }
}
