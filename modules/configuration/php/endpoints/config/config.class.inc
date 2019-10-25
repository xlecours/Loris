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

namespace LORIS\configuration\Endpoints\Config;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\Endpoint;
use \LORIS\Middleware\ETagCalculator;

/**
 * Request handler to provide all configurations stored in the database.
 *
 * This intentionaly retrain the configs to the ones in the database. Those
 * in the config.xml must be viewed/edited via the backend.
 *
 * @category Administration
 * @package  Main
 * @author   Xavier Lecours <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class Config extends Endpoint implements ETagCalculator
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
        return ['GET', 'PATCH', 'PUT'];
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
        switch ($request->getMethod()) {
        case 'GET':
            return $this->_handleGET($request);

        case 'PATCH':
            return $this->_handlePATCH($request);

        case 'PUT':
            return new \LORIS\Http\Response\NotImplemented(
                'Only config value updates are currently supported'
            );

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

        $pathparts  = $request->getAttribute('pathparts');
        $configname = array_shift($pathparts);

        $db   = \NDB_factory::singleton()->database();
        $user = $request->getAttribute('user');

        $configsettings = new \LORIS\ConfigSettings($db, $user);
        
        try {
            $config = $configsettings->getConfigSetting($configname);
        } catch(\NotFound $e) {
            return  new \LORIS\Http\Response\NotFound(
                $e->getMessage()
            );
        }

        $body = $config->toJSON();
        $this->_cache = new \LORIS\Http\Response\JsonResponse(json_decode($body));
        return $this->_cache;
    }

    /**
     * Handle a request to update an existing config value.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    private function _handlePATCH(ServerRequestInterface $request): ResponseInterface
    {
        $pathparts   = $request->getAttribute('pathparts');
        $configname  = array_shift($pathparts);

        $requestdata = json_decode((string) $request->getBody(), true);
 
        // Request validations
        if (!array_key_exists('Meta', $requestdata)) {
            return new \LORIS\Http\Response\BadRequest('Missing field');
        }

        if (!array_key_exists('Value', $requestdata)) {
            return new \LORIS\Http\Response\BadRequest(
                'Missing `Value` field. To DELETE a value, set it to null.'
            );
        }

        $requestconfigname = $requestdata['Meta']['name'] ?? null;
        if ($configname !== $requestconfigname) {
            return new \LORIS\Http\Response\BadRequest(
                'Config name in URL do not match the name in the Meta field'
            );
        }

        // Update
        $db   = \NDB_factory::singleton()->database();
        $user = $request->getAttribute('user');
        
        $configsettings = new \LORIS\ConfigSettings($db, $user);

        try {
            $config = $configsettings->getConfigSetting($configname);
        } catch (\NotFound $e) {
            return  new \LORIS\Http\Response\NotFound('Config not found');
        }
        
        $config = $config->withValue($requestdata['Value']);
        try {
            $configsettings->update($config);
        } catch (\Throwable $e) {
            error_log($e->getMessage());
            return new \LORIS\Http\Response\InternalServerError(
                'Config update failed'
            );
        }
 
        return  (new \LORIS\Http\Response())->withStatus(204);
    }
}
