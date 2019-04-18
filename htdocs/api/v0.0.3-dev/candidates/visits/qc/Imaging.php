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
namespace Loris\API\Candidates\Candidate\Visit\QC;
require_once '../../Visit.php';
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
class Imaging extends \Loris\API\Candidates\Candidate\Visit
{
    /**
     * Construct a visit class object to serialize candidate visits
     *
     * @param string $method     The method of the HTTP request
     * @param string $CandID     The CandID to be serialized
     * @param string $VisitLabel The visit label to be serialized
     */
    public function __construct($method, $CandID, $VisitLabel)
    {
        $requestDelegationCascade = $this->AutoHandleRequestDelegation;

        $this->AutoHandleRequestDelegation = false;

        if (empty($this->AllowedMethods)) {
            $this->AllowedMethods = [
                                     'GET',
                                    ];
        }
        $this->CandID     = $CandID;
        $this->VisitLabel = $VisitLabel;

        // Parent constructor will handle validation of
        // CandID and VisitLabel
        parent::__construct($method, $CandID, $VisitLabel);

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
        $factory   = \NDB_Factory::singleton();
        $DB        = $factory->database();
         $qcstatus = $DB->pselectRow(
             "SELECT MRIQCStatus, MRIQCPending 
             FROM session s JOIN candidate c ON (c.CandID=s.CandID) 
             WHERE c.Active='Y' AND s.Active='Y'
             AND s.Visit_label=:VL AND c.CandID=:CID",
             array(
              'VL'  => $this->VisitLabel,
              'CID' => $this->CandID,
             )
         );

         $this->JSON = [
                        'Meta' => [
                                   'CandID' => $this->CandID,
                                   'Visit'  => $this->VisitLabel,
                                  ],
                       ];

         $this->JSON['SessionQC'] = $qcstatus['MRIQCStatus'];
         $this->JSON['Pending']   = $qcstatus['MRIQCPending'] === 'N' ? false : true;

    }

    /**
     * Calculate the ETag for the current QC status
     *
     * @return string The JSON's entity tag
     */
    public function calculateETag()
    {
        // mod_rewrite seems to be eatting the ETag for some reason that I won't
        // be able to figure out in time for the release.
        // Return a null ETag so that PUT requests can be processed.
        return null;
    }

    /**
     * Handle a PUT request by validating the metadata matches the URL
     * and updating the database
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

if (isset($_REQUEST['PrintQC'])) {
    $obj = new Imaging(
        $_SERVER['REQUEST_METHOD'],
        $_REQUEST['CandID'],
        $_REQUEST['VisitLabel']
    );
    print $obj->toJSONString();
}
?>
