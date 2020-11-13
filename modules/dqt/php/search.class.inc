<?php declare(strict_types=1);
namespace LORIS\dqt;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \Psr\Http\Server\RequestHandlerInterface;
use \LORIS\dqt\CouchDBViewProvisioner;
use \LORIS\dqt\CouchDBSortedViewProvisioner;
use \LORIS\dqt\QueryFilterFactory;

class Search implements RequestHandlerInterface
{
    public function process(
        ServerRequestInterface $request,
        RequestHandlerInterface $handler
    ) : ResponseInterface {
        return $handler->handle($request);
    }

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

    public function loadResources(\User $user, ServerRequestInterface $request): void
    {
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
        $data = json_decode((string) $request->getBody(), true, 512,  JSON_OBJECT_AS_ARRAY);

        $fields = $data['fields'] ?? [];
        $filters = $data['filters'] ?? [];

        try {
            $query = QueryFactory::create($user, $fields, $filters);
        } catch (\LorisException $e) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                $e->getMessage()
            );
        }

        try {
            // Save the query first to make it available in queries history
            $db = $request->getAttribute('loris')->getDatabaseConnection();
            $this->_saveQuery($db, $query);

            // TODO :: Writing on disk takes a while. Increase max_execution_time in php.ini 
            //         or use the serverprocessmanager to launch a process.
            $this->_writeOutputs($query);

        } catch (\LorisException $e) {
            return new \LORIS\Http\Response\JSON\InternalServerError(
                $e->getMessage()
            );
        }

        $hash = $query->hash();
        $url  = '/dqt/results?hash=' . $hash ;
        return new \LORIS\Http\Response\JSON\SeeOther(
            [],
            [
                'Location' => $url
            ]
        );
    }

    private function _writeOutputs(Query $query): void
    {
        $hash = $query->hash();
        $outputfile = new \SplFileObject("/data/not_backed_up/$hash.json", "w");

        //set_time_limit(0);
        $outputfile->fwrite('{"rows":[' . PHP_EOL);
        foreach ($query->execute() as $index => $row) {
            $outputfile->fwrite($row . ',' . PHP_EOL);
        }

        // Erase last comma and EOL
        $last_position = $outputfile->ftell();
        $outputfile->ftruncate($last_position - 2);
        $outputfile->fseek($last_position - 2);
        
        // Complete the array valid synthax
        $outputfile->fwrite(PHP_EOL . ']}' . PHP_EOL);
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
    private function _saveQuery(\Database $db, Query $query): void
    {
        // TODO :: add dqt_query, dqt_saved_query, dqt_shared_query tables.
        //$db->insertIgnore('dqt_query', $query->hasSQLTableRow());
        $stmt = $db->prepare('INSERT IGNORE INTO dqt_query (hash, creator_userid, content) VALUES (:hash, :creator_userid, :content)');
        $stmt->execute($query->hasSQLTableRow());
    }
}
