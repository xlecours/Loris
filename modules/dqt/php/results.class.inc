<?php declare(strict_types=1);
namespace LORIS\dqt;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \Psr\Http\Server\RequestHandlerInterface;

class Results implements RequestHandlerInterface
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
        return ['GET'];
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
        case 'GET':
            return $this->_handleGET($request);

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
     * Retreve the results from a query.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface
     */
    private function _handleGET(ServerRequestInterface $request) : ResponseInterface
    {
        $hash = $request->getQueryParams()['hash'] ?? null; 
        if ($hash === null) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                'Missing query_id'
            );
        }

        // Check if the query exists and if the user has access to it.
        $db     = $request->getAttribute('loris')->getDatabaseConnection();
        $userid = $request->getAttribute('user')->getId();

        $row = $db->pselectOne(
            '
             SELECT 
               hash
             FROM
               dqt_query
             WHERE
               hash = :v_hash AND
               (
                 creator_userid = :v_userid OR
                 shared IS TRUE
               )
            ',
            [
                'v_hash' => $hash,
                'v_userid' => $userid
            ]
        );

        if (empty($row)) {
            return new \LORIS\Http\Response\JSON\NotFound();
        }

        // return file content
        // TODO :: get this from config
        $filepath = '/data/not_backed_up/' . $hash . '.json';
        return new \LORIS\Http\Response(
            new \LORIS\Http\FileStream($filepath)   
        );
    }
}
