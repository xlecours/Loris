<?php
/**
 * Handles API requests for the candidate's visit
 *
 * PHP Version 5.5+
 *
 * @category Main
 * @package  API
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace Loris\API\Candidates\Candidate;
set_include_path(
    get_include_path()
    . ":" . __DIR__ . "/../"
    . ':' . __DIR__ . "/../../../../php/libraries/"
);

require_once 'Candidate.php';
require_once 'TimePoint.class.inc';

/**
 * Handles API requests for the candidate's visit. Extends
 * Candidate so that the constructor will validate the candidate
 * portion of URL automatically.
 *
 * @category Main
 * @package  API
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Visit extends \Loris\API\Candidates\Candidate
{
    /**
     * Construct a visit class object to serialize candidate visits
     *
     * @param string $method The method of the HTTP request
     * @param string $CandID The CandID to be serialized
     * @param string $VisitLabel The visit label to be serialized
     * @param string $InputData The data posted to this URL
     */
    public function __construct($method, $CandID, $VisitLabel, $InputData = null)
    {
        $requestDelegationCascade = $this->AutoHandleRequestDelegation;

        $this->AutoHandleRequestDelegation = false;

        if (empty($this->AllowedMethods)) {
            $this->AllowedMethods = [
                'GET',
            ];
        }
        $this->CandID = $CandID;
        $this->VisitLabel = $VisitLabel;

        //   $this->Timepoint = \Timepoint::singleton($timepointID);
        // Parent constructor will handle validation of
        // CandID
        parent::__construct($method, $CandID);
        if ($method === 'PUT') {
            $this->ReceivedJSON = $InputData;
        } else {
            $timepoints = $this->Candidate->getListOfVisitLabels();
            $Visits = array_values($timepoints);

            $session = array_keys($timepoints, $VisitLabel);
            if (isset($session[0])) {
                $this->Timepoint = $this->Factory->TimePoint($session[0]);
            }

            if (!in_array($VisitLabel, $Visits)) {
                $this->header("HTTP/1.1 404 Not Found");
                $this->error("Invalid visit $VisitLabel");
                $this->safeExit(0);
            }
        }

        if ($requestDelegationCascade) {
            $this->handleRequest();
        }

    }

    /**
     * Handles a GET request
     *
     * @return void but populates $this->JSON
     */
    public function handleGET()
    {
        $SubProjTitle = $this->Timepoint->getData("SubprojectTitle");
        $centerID     = $this->Timepoint->getData("CenterID");
        $ageAtMRI     = $this->Timepoint->getData('Age_At_MRI');
        $center       = $this->DB->pselectRow(
            "SELECT Name FROM psc WHERE CenterID =:cid",
            array('cid' => $centerID)
        );
        $centerName = $center['Name'];

        $this->JSON = [
                       "Meta" => [
                                  "CandID"  => $this->CandID,
                                  'Visit'   => $this->VisitLabel,
                                  'Site'    => $centerName,
                                  'Battery' => $SubProjTitle,
                                  'Age_at_MRI' => $ageAtMRI,
                                 ],
                      ];
        if ($this->Timepoint) {
            $stages = [];
            if ($this->Timepoint->getDateOfScreening() !== null) {
                $Date = $this->Timepoint->getDateOfScreening();
                $Status = $this->Timepoint->getScreeningStatus();

                $stages['Screening'] = [
                    'Date' => $Date,
                    'Status' => $Status,
                ];
            }
            if ($this->Timepoint->getDateOfVisit() !== null) {
                $Date = $this->Timepoint->getDateOfVisit();
                $Status = $this->Timepoint->getVisitStatus();

                $stages['Visit'] = [
                    'Date' => $Date,
                    'Status' => $Status,
                ];
            }
            if ($this->Timepoint->getDateOfApproval() !== null) {
                $Date = $this->Timepoint->getDateOfApproval();
                $Status = $this->Timepoint->getApprovalStatus();

                $stages['Approval'] = [
                    'Date' => $Date,
                    'Status' => $Status,
                ];
            }
            $this->JSON['Stages'] = $stages;
        }
    }

    /**
     * Handles a PUT request for a visit
     *
     * @return void
     */
    public function handlePUT()
    {
        $this->header("HTTP/1.1 403 Forbidden");
        $this->error("Permission denied");
        $this->safeExit(0);

        return;
    }

}

if (isset($_REQUEST['PrintVisit'])) {
    $InputDataArray = file_get_contents("php://input");
    $InputData      = json_decode($InputDataArray, true);
    if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        $obj = new Visit(
            $_SERVER['REQUEST_METHOD'],
            $_REQUEST['CandID'],
            $_REQUEST['VisitLabel'],
            $InputData
        );
    } else {
        $obj = new Visit(
            $_SERVER['REQUEST_METHOD'],
            $_REQUEST['CandID'],
            $_REQUEST['VisitLabel']
        );
    }
    print $obj->toJSONString();
}
?>
