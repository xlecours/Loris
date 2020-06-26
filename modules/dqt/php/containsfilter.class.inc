<?php declare(strict_types=1);
namespace LORIS\dqt;

class ContainsFilter
{
    private $_value; 

    public function __construct(string $value)
    {
        $this->_pattern = '/' . $value . '/';
    } 

    public function filter(string $json): bool
    {
        $value = json_decode($json,true)['key'][2];
        // TODO :: To be tested
        return preg_match($this->_pattern, $this->_value, $matches) === 1;
    }
}
