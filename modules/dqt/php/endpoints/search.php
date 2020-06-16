<?php declare(strict_types=1);
namespace LORIS\dqt\Endpoints;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\Data\Provisoners\CouchDBViewProvisioner;

class Search extends \NDB_Page
{
    $skipTemplate = true;

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
     * Create an array representation of this endpoint's response body
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    private function _handlePOST(ServerRequestInterface $request): ResponseInterface
    {
        $user = $request->getAttribute('user');
        $data = json_decode((string) $request->getBody(), true);

        $data = [
            "type" => "group",
            "operator" => "AND",
            "items" => [ 
                ["type" => "query", "category" => "demographics", "field" => "Sex", "operator" => "equals", "value" => "Female"],
                ["type" => "query", "category" => "demographics", "field" => "DoB", "operator" => "equals", "value" => "1936-09-15"],
            ]
        ];

        return new \LORIS\Http\Response\JsonResponse($data);
    }
}

