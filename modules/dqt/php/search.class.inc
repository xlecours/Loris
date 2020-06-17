<?php declare(strict_types=1);
namespace LORIS\dqt;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\Data\Provisioners\CouchDBViewProvisioner;

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

        return new \LORIS\Http\Response\JsonResponse(
            iterator_to_array($this->_queryFields(
                $fields,
                $this->_queryFilters($filters)
            ))
        );
        return new \LORIS\Http\Response\JsonResponse(iterator_to_array($this->_queryFilters($filters)));
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
            foreach ($instruments as $instrument){
                $keys[] = [$instrument,$desired->value[0],$desired->value[1]];
                if (++$count % 1000 === 0) {
                    $super->append(new \NoRewindIterator(
                        (new CouchDBViewProvisioner(
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
                (new CouchDBViewProvisioner(
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
            return (new CouchDBViewProvisioner(
                'DQG-2.0',
                'search',
                [
                    "reduce" => "false",
                    "key" => '["'.$category.'","'.$field.'","'.$value.'"]',
                ]
            ))->getAllInstances();
            break;
        }
    }

    private function _intersect(\Traversable $iter1, \Traversable $iter2): \Traversable {
        foreach($iter1 as $value1) {
            switch($value1->value <=> $iter2->current()->value) {
                case 0:
                    yield $value1;
                    break;
                case 1:
                    while ($iter2->current()->value < $value1->value) {
                        $iter2->next();
                        if (!$iter2->valid()) {
                            return;
                        }
                    }
            }
        }
        return;
    }

    private function _union(\Traversable $iter1, \Traversable $iter2): \Traversable {
        foreach($iter1 as $value1) {
            switch($value1->value <=> $iter2->current()->value) {
                case -1:
                case 0:
                    yield $value1;
                    break;
                case 1:
                    while ($iter2->current()->value <= $value1->value) {
                        yield $iter2->current();
                        $iter2->next();
                        if (!$iter2->valid()) {
                            break; 
                        }
                    }
            }
        }
        return;
    }
}

