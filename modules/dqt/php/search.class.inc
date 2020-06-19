<?php declare(strict_types=1);
namespace LORIS\dqt;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

class Search extends \NDB_Page
{
    public $skipTemplate = true;

    /**
     * Returns true if the user has permission to access
     * the dqt module
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool true if user has permission
     */
    public function _hasAccess(\User $user) : bool
    {
        return $user->hasPermission('dataquery_view');
    }

    /**
     * Return which methods are supported by this endpoint.
     *
     * Projects can only be retrieved, not created.
     *
     * @return array supported HTTP methods
     */
    protected function allowedMethods() : array
    {
        return ['POST'];
    }

    /**
     * Handles a request to search the DQT
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        switch ($request->getMethod()) {
        case 'POST':
            return $this->_handlePOST($request);

        case 'OPTIONS':
            return (new \LORIS\Http\Response())
                ->withHeader('Allow', $this->allowedMethods());

        default:
            return new \LORIS\Http\Response\JSON\MethodNotAllowed(
                $this->allowedMethods()
            );
        }
    }   

    /**
     * Execute a query and same the results on the file system. The url of the result
     * will be return in the reaponse's Location header.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    private function _handlePOST(ServerRequestInterface $request): ResponseInterface
    {
        $user = $request->getAttribute('user');
        $data = json_decode((string) $request->getBody(), true);
        $fields = [
            ["category" => "demographics", "field" => "DoB"],
            ["category" => "demographics", "field" => "Sex"],
            ["category" => "ukbb_baseline_characteristics", "field" => "administration"]
        ];
        $filters = [
            "type" => "group",
            "operator" => "AND",
            "items" => [ 
                ["type" => "query", "category" => "demographics", "field" => "Sex", "operator" => "equals", "value" => "Female"],
                [
                    "type" => "group",
                    "operator" => "OR",
                    "items" => [
                        ["type" => "query", "category" => "demographics", "field" => "DoB", "operator" => "equals", "value" => "1936-09-15"],
                        ["type" => "query", "category" => "demographics", "field" => "DoB", "operator" => "equals", "value" => "1936-10-15"],
                        ["type" => "query", "category" => "demographics", "field" => "DoB", "operator" => "equals", "value" => "1936-11-15"],
                        ["type" => "query", "category" => "demographics", "field" => "DoB", "operator" => "equals", "value" => "1942-01-15"]
                    ]
                ]
            ]
        ];

/**
        $filters = ["type" => "query", "category" => "demographics", "field" => "DoB", "operator" => "lessThanEqual", "value" => "1936-09-15"];
        $filters = ["type" => "query", "category" => "demographics", "field" => "DoB", "operator" => "greaterThanEqual", "value" => "1970-01-15"];
        $filters = ["type" => "query", "category" => "demographics", "field" => "DoB", "operator" => "lessThanEqual", "value" => "1934-03-15"];
        $filters = [
            "type" => "group",
            "operator" => "AND",
            "items" => [
                ["type" => "query", "category" => "demographics", "field" => "DoB", "operator" => "greaterThanEqual", "value" => "1920-01-15"],
                ["type" => "query", "category" => "demographics", "field" => "DoB", "operator" => "lessThanEqual", "value" => "1934-03-15"],
            ]
        ];
*/
        return new \LORIS\Http\Response\JsonResponse(
            iterator_to_array($this->_queryFields(
                $fields,
                $this->_queryFilters($filters)
            ))
        );
    }

    private function _queryFields(array $fields, \Traversable $filtered): \Traversable
    {
        // There should be a way to use the SocketWrapper to write keys...
        // Instead/Meanwhile :
        $instruments = array_unique(
            array_map(function ($f) {return $f['category'] ?? null;}, $fields),
            SORT_STRING
        );

        $keys = [];
        $count = 0;
        $super = new \AppendIterator();
        foreach ($filtered as $desired) {
            $value = json_decode($desired, true);
            foreach ($instruments as $instrument){
                $keys[] = [$instrument,$value[0],$value[1]];
                if (++$count % 1000 === 0) {
                    $super->append(new \NoRewindIterator(
                        (new CouchDBViewDocsProvisioner(
                            'DQG-2.0',
                            'instruments',
                            [
                                "reduce" => "false",
                                "keys" => $keys,
                                "include_docs" => "true"
                            ]
                        ))->getAllInstances()
                    ));
                    $keys = [];
                }
            }
        }
        if (!empty($keys)) {
            $super->append(new \NoRewindIterator(
                (new CouchDBViewDocsProvisioner(
                    'DQG-2.0',
                    'instruments',
                    [
                        "reduce" => "false",
                        "keys" => $keys,
                        "include_docs" => "true"
                    ]
                ))->getAllInstances()
            ));
        }
        return $super;
    }

    private function _queryFilters(array $filters): \Traversable
    {
        switch($filters['type'] ?? null) {
        case 'group':
            switch ($filters['operator']) {
            case 'AND': 
                $operation = '_intersect';
                break;
            case 'OR':
                $operation = '_union';
                break;
            default:
                throw new \DomainException('invalid group operator');
            }
            $parent = clone($this);
            return array_reduce($filters['items'], function ($carry, $item) use ($parent, $operation) {
                // TODO :: Use private static methods for intersect and union
                if (is_null($carry)) {
                    return $parent->_queryFilters($item);
                }
                $carry = $parent->$operation($carry, $parent->_queryFilters($item));
                return $carry;
            }, null);
            break;
        case 'query':
            $category = $filters['category'] ?? null;
            $field    = $filters['field'] ?? null;
            $value    = $filters['value'] ?? null;

            // Surround non-numeric string values with double quotes.
            // FIXME:: What about numeric strings that should remain strings? Should they?
            $value    = is_numeric($value) ? $value : "\"$value\"";

            $provisioner = new CouchDBViewValuesProvisioner(
                'DQG-2.0',
                'search',
                []
            );
            $params = ["reduce" => "false"];
            switch($filters['operator'] ?? null) {
            case 'contains':
                $params["startkey"] = '["'.$category.'","'.$field.'"]';
                $params["endkey"]   = '["'.$category.'","'.$field.'",{}]'; 

                $provisioner = $provisioner
                    ->withParams($params)
                    ->withFilter(new ContainsFilter($value));
                break;
            case 'isNull':
                $value = null;
            case 'equals':
                $params["key"] = '["'.$category.'","'.$field.'",'.$value.']';

                $provisioner = $provisioner
                    ->withParams($params);
                break;
            case 'isNotNull':
                $value = null;
            case 'notEqual':
                $params["startkey"] = '["'.$category.'","'.$field.'"]';
                $params["endkey"]   = '["'.$category.'","'.$field.'",{}]';

                $provisioner = $provisioner
                    ->withParams($params)
                    ->withFilter(new NotEqualFilter($value));
                break;
            case 'lessThanEqual':
                // Strict lessThan could be implementing using the 'inclusive_end' param.
                $params["startkey"] = '["'.$category.'","'.$field.'"]';
                $params["endkey"]   = '["'.$category.'","'.$field.'",'.$value.']';
                $params["inclusive_end"] = "true";

                $provisioner = $provisioner
                    ->withParams($params);
                break;
            case 'greaterThanEqual':
                // Strict greaterThan could be implementing using the 'inclusive_end'
                // And descending order params.
                $params["startkey"] = '["'.$category.'","'.$field.'",'.$value.']';
                $params["endkey"]   = '["'.$category.'","'.$field.'",{}]';
                $params["inclusive_end"] = "true";

                $provisioner = $provisioner
                    ->withParams($params);
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

                $params["startkey"] = '["'.$category.'","'.$field.'",'.$value.']';
                $params["endkey"]   = '["'.$category.'","'.$field.'",'.$nextvalue.']';

                $provisioner = $provisioner
                    ->withParams($params);
                break;
            default:
                throw new \Error('operator not supported: ' . $filters['operator']);
            }

            return $provisioner->getAllInstances();
        }
    }

    private function _intersect(\Traversable $iter1, \Traversable $iter2): \Traversable {
        foreach($iter1 as $value1) {
            switch($value1 <=> $iter2->current()) {
                case -1:
                    break;
                case 0:
                    yield $value1;
                    break;
                case 1:
                    while ($iter2->current() < $value1) {
                        $iter2->next();
                        if (!$iter2->valid()) {
                            return;
                        }
                    }
            }
        }
    }

    private function _union(\Traversable $iter1, \Traversable $iter2): \Traversable {
        foreach($iter1 as $value1) {
            switch($value1 <=> $iter2->current()) {
                case -1:
                case 0:
                    yield $value1;
                    break;
                case 1:
                    while ($iter2->current() <= $value1) {
                        yield $iter2->current();
                        $iter2->next();
                        if (!$iter2->valid()) {
                            break; 
                        }
                    }
            }
        }
    }
}
