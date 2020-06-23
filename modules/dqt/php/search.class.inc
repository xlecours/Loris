<?php declare(strict_types=1);
namespace LORIS\dqt;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\dqt\CouchDBViewProvisioner;
use \LORIS\dqt\CouchDBSortedViewProvisioner;

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

        $fields = $data['fields'] ?? [];
        $filters = $data['filters'] ?? [];

        $fields = [
            ["category" => "demographics", "field" => "DoB"],
            //["category" => "demographics", "field" => "Sex"],
            //["category" => "ukbb_baseline_characteristics", "field" => "34_year_of_birth"]
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
        $filters = ["type" => "query", "category" => "demographics", "field" => "Sex", "operator" => "notEqual", "value" => "Female"];
*/
        $filters = [
            "type" => "group",
            "operator" => "OR",
            "items" => [
                //["type" => "query", "category" => "demographics", "field" => "DoB", "operator" => "notEqual", "value" => null],
                ["type" => "query", "category" => "demographics", "field" => "DoB", "operator" => "greaterThanEqual", "value" => "1970-01-15"],
                ["type" => "query", "category" => "demographics", "field" => "DoB", "operator" => "equals", "value" => "1968-02-15"],
            ]
        ];

        try {
            $this->_writeOutputs(
                $this->_queryFields(
                    $user,
                    $fields,
                    $this->_queryFilters(
                        $user,
                        $filters
                    )
                )
            );

            $this->_saveQuery(
                $user,
                $fields,
                $filters
            );

        } catch (\LorisException $e) {
            return new \LORIS\Http\Response\JSON\InternalServerError(
                $e->getMessage()
            );
        }

        return new \LORIS\Http\Response\JSON\OK();
    }

    private function _writeOutputs($outputs): void
    {
        $outputfile    = new \SplFileObject("/data/not_backed_up/tmp.txt", "w");
        $outputfile->fwrite('{"data":[');

        // TODO :: There must be a better way to avoid the last comma...
        $comma = '';
        foreach ($outputs as $index => $row) {
            $outputfile->fwrite($comma . PHP_EOL . $row);
            $comma = ',';
        }
        $outputfile->fwrite(PHP_EOL . ']}');
    }

    private function _saveQuery($fields, $filters): void
    {
        error_log('Search:: _saveQuery not implemented');
    }

    private function _queryFields(\User $user, array $fields, \Traversable $filtered): \Traversable
    {
        // There should be a way to use the SocketWrapper to write keys...
        // Instead/Meanwhile :
        $instruments = array_unique(
            array_map(function ($f) {return $f['category'] ?? null;}, $fields),
            SORT_STRING
        );

        $keys = [];
        $count = 0;
        foreach ($filtered as $desired) {
            $value = json_decode($desired, true);
            foreach ($instruments as $instrument){
                $keys[] = [$instrument,$value[0],$value[1]];
                if (++$count % 50000 === 0) {
                    $prov = new CouchDBViewProvisioner(
                        'DQG-2.0',
                        'instruments',
                        [
                            "reduce" => "false",
                            "keys" => $keys,
                            "include_docs" => "true"
                        ]
                    );
                    $keys = null;
                    $prov = $prov->withMapper(new SelectedFieldsResults($fields));
                    yield from $prov->execute($user);
                }
            }
        }

        if ($keys !== null) {
            $prov = new CouchDBViewProvisioner(
                'DQG-2.0',
                'instruments',
                [
                    "reduce" => "false",
                    "keys" => $keys,
                    "include_docs" => "true"
                ]
            );
            $keys = null;
            $prov = $prov->withMapper(new SelectedFieldsResults($fields));
            yield from $prov->execute($user);
        }
    }

    /**
     *
     */
    private function _queryFilters(\User $user, array $filters): \Traversable
    {
        switch($filters['type'] ?? null) {
        case 'group':

            // If the group operator is AND, the output is the intersection of all
            // it's items results. Otherwise, OR is the union of allit's items
            // results.
            switch ($filters['operator']) {
            case 'AND': 
                $operation = '_intersect';
                break;
            case 'OR':
                $operation = '_union';
                break;
            default:
                throw new \LorisException('Search::_queryFilters: Invalid group operator');
            }

            // Reduce the group's filters to a single Traversable of ordered values.
            return array_reduce($filters['items'], function ($carry, $item) use ($user, $operation) {
                if (is_null($carry)) {
                    return $this->_queryFilters($user, $item);
                }
                $carry = self::$operation($carry, $this->_queryFilters($user, $item));
                return $carry;
            }, null);

        case 'query':
            $category = $filters['category'] ?? null;
            $field    = $filters['field'] ?? null;
            $value    = $filters['value'] ?? null;

            // Produce a \Traversable or ordered value from the query results.
            // The query parameter will differ according to the operator
            // Some operators also add filters to the provisioner.
            $provisioner = new CouchDBSortedViewProvisioner(
                'DQG-2.0',
                'search',
                []
            );

            //TODO :: remove hardcoded limit in param after dev...
            //$params = ["reduce" => "false", "limit" => "10"];
            $params = ["reduce" => "false"];

            switch($filters['operator'] ?? null) {
            case 'contains':
                $provisioner = $provisioner
                    ->withAddedFilter(new ContainFilter($value));

                $params["startkey"] = '["'.$category.'","'.$field.'"]';
                $params["endkey"]   = '["'.$category.'","'.$field.'",{}]'; 
                break;

            case 'isNull':
                $value = null;
            case 'equals':
                $params["key"] = '["'.$category.'","'.$field.'","'.$value.'"]';
                break;

            case 'isNotNull':
                $value = null;
            case 'notEqual':
                $provisioner = $provisioner
                    ->withAddedFilter(new NotEqualFilter($value));

                $params["startkey"] = '["'.$category.'","'.$field.'"]';
                $params["endkey"]   = '["'.$category.'","'.$field.'",{}]';

                break;

            case 'lessThanEqual':
                // Strict lessThan could be implementing using the 'inclusive_end' param.
                $params["startkey"] = '["'.$category.'","'.$field.'"]';
                $params["endkey"]   = '["'.$category.'","'.$field.'","'.$value.'"]';
                $params["inclusive_end"] = "true";
                break;

            case 'greaterThanEqual':
                // Strict greaterThan could be implementing using the 'inclusive_end'
                // And descending order params.
                $params["startkey"] = '["'.$category.'","'.$field.'","'.$value.'"]';
                $params["endkey"]   = '["'.$category.'","'.$field.'",{}]';
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

                $params["startkey"] = '["'.$category.'","'.$field.'","'.$value.'"]';
                $params["endkey"]   = '["'.$category.'","'.$field.'","'.$nextvalue.'"]';
                break;

            default:
                throw new \LorisException('Search::_queryFilters: Operator not supported');
            }

            $provisioner = $provisioner
                ->withParams($params);

            return $provisioner->execute($user);

        default:
            throw new \LorisException('Search::_queryFilters: Invalid or missing filter');
        }
    }

    /**
     * Produce a single ordered Traversable which values are the ones the were present in both 
     * provided Traversables.
     *
     * Both parameters MUST be pre ordered. 
     *
     * @param \Traversable $iter1 
     * @param \Traversable $iter2 
     *
     * @return \Traversable
     */
    private static function _intersect(\Traversable $iter1, \Traversable $iter2): \Traversable {
        foreach($iter1 as $value1) {
            switch($value1 <=> $iter2->current()) {
                case -1:
                    // iter1 is smaller than iter2.
                    // Move to next foreach.
                    break;
                case 0:
                    // Both iter1 and iter2 are equal.
                    // Move iter2 and yield $value before moving to next foreach.
                    $iter2->next();
                    yield $value1;
                    break;
                case 1:
                    // iter1 is greater than iter2.
                    // Advance iter2 until it is greater or equal to iter1.
                    while ($iter2->current() < $value1) {
                        $iter2->next();
                        if (!$iter2->valid()) {
                            return;
                        }
                    }
                    if ($value1 == $iter2->current()) {
                        // Both iter1 and iter2 are equal.
                        // Yield $value before moving to next foreach.
                        yield $value1;
                    }
                    break;
            }
        }
    }

    /**
     * Produce a single ordered Traversable which every elements of the provided 
     * Traversables without duplicates. 
     *
     * Both parameters MUST be pre ordered. 
     *
     * @param \Traversable $iter1 
     * @param \Traversable $iter2 
     *
     * @return \Traversable
     */
    private static function _union(\Traversable $iter1, \Traversable $iter2): \Traversable {
        foreach($iter1 as $value1) {
            // Yield each value of iter1.
            // If iter2 is smaller, yield each value of iter2 until it is greater, equal or empty.
            // If it is equal, iter1 has already been yield do there is no need to yield iter2.
            yield $value1;
            if ($iter2->valid()) {
                while ($iter2->current() < $value1) {
                    yield $iter2->current();
                    $iter2->next();
                    if (!$iter2->valid()) {
                        break;
                    }
                }
            }
        }

        while ($iter2->valid()) {
            // yield each remaining values of iter2.
            yield $iter2->current();
            $iter2->next();
        }
    }
}
