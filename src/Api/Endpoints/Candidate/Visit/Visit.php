<?php declare(strict_types=1);
/**
 * This implements the Visit endpoint class under Candidates/$candid
 *
 * PHP Version 7
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  Loris license
 * @link     https://github.com/aces/Loris
 */
namespace LORIS\Api\Endpoints\Candidate\Visit;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\Api\Endpoint;

/**
 * A class for handling the /candidates/$candidate/$visit_label endpoint.
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  Loris license
 * @link     https://github.com/aces/Loris
 */
class Visit extends Endpoint implements \LORIS\Middleware\ETagCalculator
{
    /**
     * The requested Candidate
     *
     * @var \Candidate
     */
    protected $candidate;

    /**
     * The requested Visit
     *
     * @var \Timepoint
     */
    protected $visit;

    /**
     * Contructor
     *
     * @param \Candidate  $candidate The requested candidate
     * @param ?\Timepoint $visit     The requested visit; can be null in PUT requests
     */
    public function __construct(\Candidate $candidate, ?\Timepoint $visit)
    {
        $this->candidate = $candidate;
        $this->visit     = $visit;
    }

    /**
     * Return which methods are supported by this endpoint.
     *
     * @return array supported HTTP methods
     */
    protected function allowedMethods() : array
    {
        return array(
                'GET',
                'PUT',
               );
    }

    /**
     * Versions of the LORIS API which are supported by this
     * endpoint.
     *
     * @return array a list of supported API versions.
     */
    protected function supportedVersions() : array
    {
        return array(
                'v0.0.1',
                'v0.0.2',
                'v0.0.3-dev',
               );
    }

    /**
     * Handles a request that starts with /candidates/$candid
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $pathparts = $request->getAttribute('pathparts');
        if (count($pathparts) === 0) {
            switch ($request->getMethod()) {
            case 'GET':
                if ($this->visit === null) {
                    return new \LORIS\Http\Response\NotFound();
                }
                return new \LORIS\Http\Response\JsonResponse(
                    (new \LORIS\Api\Views\Visit($this->visit))
                        ->toArray()
                );

            case 'PUT':
                return $this->_handlePUT($request);

            case 'OPTIONS':
                return (new \LORIS\Http\Response())
                    ->withHeader('Allow', $this->allowedMethods());

            default:
                return new \LORIS\Http\Response\MethodNotAllowed(
                    $this->allowedMethods()
                );
            }
        }

        // Delegate to sub-endpoints
        $subendpoint = array_shift($pathparts);
        switch($subendpoint) {
        case 'instruments':
            $handler = new Instruments($this->visit);
            break;
        case 'images':
            $handler = new Images($this->visit);
            break;
        case 'qc':
            $handler = new Qc($this->visit);
            break;
        case 'dicoms':
            $handler = new Dicoms($this->visit);
            break;
        default:
            return new \LORIS\Http\Response\NotFound();
        }

        $newrequest = $request
            ->withAttribute('pathparts', $pathparts);

        return $handler->process(
            $newrequest,
            $handler
        );
    }

    /**
     * Handles a PUT request that creates or replace a candidate visit
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    private function _handlePUT(ServerRequestInterface $request): ResponseInterface
    {
        $user = $request->getAttribute('user');
        $data = json_decode((string) $request->getBody(), true);

        $requiredfields = array(
                           'CandID',
                           'Visit',
                           'Site',
                           'Battery',
                          );
        $diff           = array_diff($requiredfields, array_keys($data));
        if (!empty($diff)) {
            return new \LORIS\Http\Response\BadRequest(
                'Field(s) missing: ' . implode(', ', $diff)
            );
        }

        if ($data['CandID'] !== $this->candidate->getCandID()) {
            return new \LORIS\Http\Response\BadRequest(
                'CandID do not match this candidate'
            );
        }

        $sessionid = array_search(
            $data['Visit'],
            $this->candidate->getListOfVisitLabels()
        );

        $centerid = array_search($data['Site'], \Utility::getSiteList());

        if (!in_array($centerid, $user->getCenterIDs())) {
            return new \LORIS\Http\Response\Forbidden(
                'You can`t create candidates visit for that site'
            );
        }

        $subprojectid = array_search(
            $data['Battery'],
            \Utility::getSubprojectList()
        );

        if ($sessionid !== false) {
            // If the visit label already exists for that candidate
            $timepoint = \NDB_Factory::singleton()->timepoint($sessionid);
            if ($timepoint->getCurrentStage() !== 'Not Started') {
                return new \LORIS\Http\Response\Conflict(
                    'This visit is already started'
                );
            }

            $username = $user->getUsername();
            $today    = date("Y-m-d");
            // TODO :: Add a replace function in \Timepoint.class.inc
            $timepoint->setData('CenterID', $centerid);
            $timepoint->setData('Visit_label', $data['Visit']);
            $timepoint->setData('SubprojectID', $subprojectid);
            $timepoint->setData('Active', 'Y');
            $timepoint->setData('Date_active', $today);
            $timepoint->setData('RegisteredBy', $username);
            $timepoint->setData('UserID', $username);
            $timepoint->setData('Date_registered', $today);
            $timepoint->setData('Testdate', $today);

            $link = '/' . $request->getUri()->getPath();
            return (new \LORIS\Http\Response())
                ->withStatus(204)
                ->withHeader('Content-Location', $link);
        }

        try {
            \TimePoint::isValidVisitLabel(
                $data['CandID'],
                $subprojectid,
                $data['Visit']
            );
        } catch (\LorisException $e) {
            return new \LORIS\Http\Response\BadRequest(
                $e->getMessage()
            );
        }

        \TimePoint::createNew(
            $data['CandID'],
            $subprojectid,
            $data['Visit'],
            $centerid
        );

        $link = '/' . $request->getUri()->getPath();
        return (new \LORIS\Http\Response())
            ->withStatus(201)
            ->withHeader('Content-Location', $link);
    }

    /**
     * Implements the ETagCalculator interface
     *
     * @param ServerRequestInterface $request The PSR7 incoming request.
     *
     * @return string etag summarizing value of this request.
     */
    public function ETag(ServerRequestInterface $request) : string
    {
        return md5(json_encode($this->visit));
    }
}