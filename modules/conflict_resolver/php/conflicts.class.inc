<?php
/**
 * PHP Version 7
 *
 * @category Behavioural
 * @package  Main
 * @author   Xavier Lecours <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

namespace LORIS\conflict_resolver;

use \Psr\Http\Server\RequestHandlerInterface;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * Request handler to deal with unresolved conflicts
 *
 * @category Behavioural
 * @package  Main
 * @author   Xavier Lecours <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class Conflicts implements RequestHandlerInterface
{
    /**
     * Handles a login request
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        switch ($request->getMethod()) {
        case 'GET':
            return $this->_handleGET($request);

        case 'POST':
            return $this->_handlePOST($request);

        case 'OPTIONS':
            return (new \LORIS\Http\Response())
                ->withHeader('Allow', $this->_allowedMethods());

        default:
            return new \LORIS\Http\MethodNotAllowed(
                $this->_allowedMethods()
            );
        }
    }

    /**
     * Return an array of valid HTTP methods for this endpoint
     *
     * @return string[] Valid versions
     */
    private function _allowedMethods() : array
    {
        return array(
                'GET',
                'POST',
               );
    }

    /**
     * Items to add to the JSON fieldOptions key, which React components
     * can use for formatting. This is used to send data dependent options
     * to the frontend.
     *
     * @return array
     */
    private function _getFieldOptions() : array
    {
        return array(
                'site'       => \Utility::getSiteList(false),
                'instrument' => \Utility::getAllInstruments(),
                'visitLabel' => \Utility::getVisitList(),
                'project'    => \Utility::getProjectList(),
               );
    }

    /**
     * Return a list of unresolved conflicts
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface
     */
    private function _handleGET(ServerRequestInterface $request) : ResponseInterface
    {
        // TODO :: User permission to acces this and subendpoints ??

        $user = $request->getAttribute('user');

        $provisioner = (new ConflictsProvisioner())
            ->forUser($user);

        $conflicts = (new \LORIS\Data\Table())
            ->withDataFrom($provisioner)
            ->toArray($user);

        return new \LORIS\Http\Response\JsonResponse(
            array(
             'Data'         => $conflicts,
             'fieldOptions' => $this->_getFieldOptions(),
            )
        );
    }

    /**
     * Handles conflict corrections
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface
     */
    private function _handlePOST(ServerRequestInterface $request) : ResponseInterface
    {
        return new \LORIS\Http\Response\NotImplemented();
    }
}
