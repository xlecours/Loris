<?php declare(strict_types=1);
namespace LORIS\dqt;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\dqt\CouchDBViewProvisioner;
use \LORIS\dqt\CouchDBSortedViewProvisioner;
use \LORIS\dqt\QueryFilterFactory;

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
     * Execute a query and save the results on the file system. The url of the result
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
            ["category" => "demographics", "field" => "Sex"],
            ["category" => "ukbb_baseline_characteristics", "field" => "34_year_of_birth"]
        ];
        $filters = [
            "type" => "group",
            "operator" => "AND",
            "items" => [ 
                ["type" => "filter", "category" => "demographics", "field" => "Sex", "operator" => "equals", "value" => "Female"],
                [
                    "type" => "group",
                    "operator" => "OR",
                    "items" => [
                        ["type" => "filter", "category" => "demographics", "field" => "DoB", "operator" => "equals", "value" => "1936-09-15"],
                        ["type" => "filter", "category" => "demographics", "field" => "DoB", "operator" => "equals", "value" => "1936-10-15"],
                        ["type" => "filter", "category" => "demographics", "field" => "DoB", "operator" => "equals", "value" => "1936-11-15"],
                        ["type" => "filter", "category" => "demographics", "field" => "DoB", "operator" => "equals", "value" => "1942-01-15"]
                    ]
                ]
            ]
        ];

/**
        $filters = ["type" => "query", "category" => "demographics", "field" => "DoB", "operator" => "lessThanEqual", "value" => "1936-09-15"];
        $filters = ["type" => "query", "category" => "demographics", "field" => "DoB", "operator" => "greaterThanEqual", "value" => "1970-01-15"];
        $filters = ["type" => "query", "category" => "demographics", "field" => "DoB", "operator" => "lessThanEqual", "value" => "1934-03-15"];
*/
        $filters = ["type" => "filter", "category" => "demographics", "field" => "Sex", "operator" => "notEqual", "value" => "Female"];
/**
        $filters = [
            "type" => "group",
            "operator" => "OR",
            "items" => [
                //["type" => "query", "category" => "demographics", "field" => "DoB", "operator" => "notEqual", "value" => null],
                ["type" => "filter", "category" => "demographics", "field" => "DoB", "operator" => "greaterThanEqual", "value" => "1970-01-15"],
                ["type" => "filter", "category" => "demographics", "field" => "DoB", "operator" => "equals", "value" => "1968-02-15"],
            ]
        ];
*/


        try {
            $filter = QueryFilterFactory::create($filters);
            $fields  = new QueryFields($fields);
        } catch (\LorisException $e) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                $e->getMessage()
            );
        }

        try {
            $sessions = $filter->getFilteredSessions($user);
            $results  = $fields->getSelectedFields(
                $user,
                $sessions
            );

            // TODO :: Writing on disk takes a while. Increase max_execution_time in php.ini 
            //         or use the serverprocessmanager to launch a process.
            $outputfile = $this->_writeOutputs($results);

            $this->_saveQuery(
                $user,
                $fields,
                $filter,
                $outputfile
            );

        } catch (\LorisException $e) {
            return new \LORIS\Http\Response\JSON\InternalServerError(
                $e->getMessage()
            );
        }

        return new \LORIS\Http\Response\JSON\OK();
    }

    private function _writeOutputs($outputs): \SplFileObject
    {
        $outputfile    = new \SplFileObject("/data/not_backed_up/tmp.txt", "w");

        $outputfile->fwrite('{"data":[');

        // TODO :: There must be a better way to avoid the last comma...
        $comma = '';
        set_time_limit(0);
        foreach ($outputs as $index => $row) {
            $outputfile->fwrite($comma . PHP_EOL . $row);
            $comma = ',';
        }
        $outputfile->fwrite(PHP_EOL . ']}');
        return $outputfile;
    }
 
    /**
     * Saves the query in the database.
     * 
     * TODO:: Use a list function in couchdb instead of SortedViewProvisioner to
     *        handle sorting the results by value. This would allow tu use Etags
     *        in requests sent to couchdb.
     *
     * @param \User          $user       The requesting user.
     * @param QueryFields    $fields     The requested fields in the outputs.
     * @param QueryFilters   $filters    The selection filters.
     * @param \SplFileObject $outputfile The in which the results have been writen.
     */
    private function _saveQuery(\User $user, QueryFields $fields, QueryFilters $filters, \SplFileObject $outputfile): void
    {
        // TODO :: add dqt_query, dqt_saved_query, dqt_shared_query tables.
        error_log('Search:: _saveQuery not implemented');
    }
}
