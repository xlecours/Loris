<?php declare(strict_types=1);

namespace LORIS\dqt;

/**
 * Either a FilterGroup of a FilterItem
 */
class QueryFilter implements QueryFilters
{
    private $_operator;
    private $_category;
    private $_field;
    private $_value;

    public function __construct(array $data)
    {
        $this->_operator = $data['operator'] ?? null;
        $this->_category = $data['category'] ?? null;
        $this->_field    = $data['field'] ?? null;
        $this->_value    = $data['value'] ?? null;
    }

    public function getFilteredSessions(\User $user): \Traversable 
    {
        $provisioner = new CouchDBSortedViewProvisioner(
            'DQG-2.0',
            'sorted',
            'search',
            []
        );

        $params = ["reduce" => "false"];

        switch($this->_operator) {
        case 'contains':
            $provisioner = $provisioner
                ->withAddedFilter(new ContainsFilter($this->_value));

            $params["startkey"] = '["'.$this->_category.'","'.$this->_field.'"]';
            $params["endkey"]   = '["'.$this->_category.'","'.$this->_field.'",{}]';
            break;

        case 'isNull':
            $this->_value = null;
        case 'equals':
            $params["key"] = '["'.$this->_category.'","'.$this->_field.'","'.$this->_value.'"]';
            break;

        case 'isNotNull':
            $this->_value = null;
        case 'notEqual':
            $provisioner = $provisioner
                ->withAddedFilter(new NotEqualFilter($this->_value));

            $params["startkey"] = '["'.$this->_category.'","'.$this->_field.'"]';
            $params["endkey"]   = '["'.$this->_category.'","'.$this->_field.'",{}]';

            break;

        case 'lessThanEqual':
            // Strict lessThan could be implementing using the 'inclusive_end' param.
            $params["startkey"] = '["'.$this->_category.'","'.$this->_field.'"]';
            $params["endkey"]   = '["'.$this->_category.'","'.$this->_field.'","'.$this->_value.'"]';
            $params["inclusive_end"] = "true";
            break;

        case 'greaterThanEqual':
            // Strict greaterThan could be implementing using the 'inclusive_end'
            // And descending order params.
            $params["startkey"] = '["'.$this->_category.'","'.$this->_field.'","'.$this->_value.'"]';
            $params["endkey"]   = '["'.$this->_category.'","'.$this->_field.'",{}]';
            break;

        case 'starstWith':
            // PHP doesn't have any /u9999 unicode escaping, so
            // we use mb_convert_encoding to embed a high
            // unicode character
            $nextvalue = $value . mb_convert_encoding(
                '&#x9999;',
                'UTF-8',
                'HTML-ENTITIES'
            );

            $params["startkey"] = '["'.$this->_category.'","'.$this->_field.'","'.$this->_value.'"]';
            $params["endkey"]   = '["'.$this->_category.'","'.$this->_field.'","'.$nextvalue.'"]';
            break;

        default:
            throw new \LorisException('Unsuported QueryField operator');
        }

        $provisioner = $provisioner
            ->withParams($params);

        return $provisioner->execute($user);
     }

     public function jsonSerialize()
     {
         return [
            'type'     => 'filter',
            'operator' => $this->_operator,
            'category' => $this->_category,
            'field'    => $this->_field,
            'value'    => $this->_value,
        ];
     }
}
