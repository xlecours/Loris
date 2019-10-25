<?php declare(strict_types=1);
/**
 * PHP Version 7
 *
 * @category Administration
 * @package  Main
 * @author   Xavier Lecours <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

namespace LORIS\configuration\Endpoints;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\Endpoint;
use \LORIS\Middleware\ETagCalculator;
use \LORIS\configuration\Provisioners\ConfigsProvisioner;

/**
 * Request handler to provide all configurations stored in the database.
 *
 * @category Administration
 * @package  Main
 * @author   Xavier Lecours <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class Configs extends Endpoint implements ETagCalculator
{
    /**
     * A cache of the endpoint results, so that it doesn't need to be
     * recalculated for the ETag and handler.
     */
    private $_cache;

    /**
     * Returns true if the user has permission to access
     * the configuration module
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool true if user has permission
     */
    public function hasAccess(\User $user) : bool
    {
        return $user->hasPermission('config');
    }

    /**
     * Implements the ETagCalculator interface.
     *
     * @param ServerRequestInterface $request The PSR7 incoming request.
     *
     * @return string etag summarizing value of this request.
     */
    public function ETag(ServerRequestInterface $request) : string
    {
        return md5(json_encode((string) $this->_handleGET($request)->getBody()));
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
     * Versions of the LORIS API which are supported by this
     * endpoint.
     *
     * This part is not versioned yet.
     *
     * @return array
     */
    protected function supportedVersions() : array
    {
        return array('unknown');
    }

    /**
     * Handles a request to Configs/[$config]
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $config = $request->getAttribute('pathparts');

        if (!empty($config)) {
            // This is a request for a single congfig
            $endpoint = new Config\Config();
            return $endpoint->process($request, $endpoint);
        }

        switch ($request->getMethod()) {
        case 'GET':
            return $this->_handleGET($request);
        case 'OPTIONS':
            return (new \LORIS\Http\Response())
                    ->withHeader('Allow', $this->allowedMethods());
        default:
            return new \LORIS\Http\Response\MethodNotAllowed(
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
    private function _handleGET(ServerRequestInterface $request): ResponseInterface
    {
        if (isset($this->_cache)) {
            return $this->_cache;
        }

        $user        = $request->getAttribute('user');
        $provisioner = new ConfigsProvisioner();

        $configs = (new \LORIS\Data\Table())
            ->withDataFrom($provisioner)
            ->toArray($user);

        $body         = array('Configs' => $configs);
        $this->_cache = new \LORIS\Http\Response\JsonResponse($body);
        return $this->_cache;
    }
}
