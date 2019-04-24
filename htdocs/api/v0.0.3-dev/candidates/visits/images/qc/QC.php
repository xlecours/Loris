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
namespace Loris\API\Candidates\Candidate\Visit\Imaging\Qc;
require_once __DIR__ . '/../Image.php';
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
class QC extends \Loris\API\Candidates\Candidate\Visit\Imaging\Image
{
    /**
     * Construct an Image class object to serialize candidate images
     *
     * @param string $method     The method of the HTTP request
     * @param string $CandID     The CandID to be serialized
     * @param string $VisitLabel The visit label to be serialized
     * @param string $Filename   The file name to be serialized
     */
    public function __construct($method, $CandID, $VisitLabel, $Filename)
    {
        $requestDelegationCascade = $this->AutoHandleRequestDelegation;

        $this->AutoHandleRequestDelegation = false;

        if (empty($this->AllowedMethods)) {
            $this->AllowedMethods = [
                                     'GET',
                                    ];
        }

        parent::__construct($method, $CandID, $VisitLabel, $Filename);

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
        $factory    = \NDB_Factory::singleton();
        $DB         = $factory->Database();
        $QCStatus   = $DB->pselectRow(
            "SELECT QCStatus, Selected 
             FROM files_qcstatus
             WHERE FileID in (
                SELECT FileID
                FROM files
                WHERE File LIKE CONCAT('%', :FName)
            )",
            array('FName' => $this->Filename)
        );
        $caveats    = $this->getImageCaveats();
        $this->JSON = array(
            'Meta'     => array(
                'CandID' => $this->CandID,
                'Visit'  => $this->VisitLabel,
                'File'   => $this->Filename,
            ),
            'QC'       => $QCStatus['QCStatus'],
            'Selected' => $QCStatus['Selected'],
            'Caveats'  => $caveats,
        );
    }

    /**
     * Gets the list of Caveats for the file.
     *
     * @return array A list of caveats for the file
     */
    function getImageCaveats(): array
    {
        $factory = \NDB_Factory::singleton();
        $DB = $factory->Database();
        $rows = $DB->pselect(
            "SELECT Severity, Header, Value, ValidRange, ValidRegex 
                FROM files f 
                LEFT JOIN mri_violations_log mvl ON (f.SeriesUID=mvl.SeriesUID)
                WHERE f.File LIKE CONCAT('%', :FName)",
            array('FName' => $this->Filename)
        );
        return $rows;
    }

    /**
     * Calculates the ETag for the current QC status
     *
     * @return string
     */
    public function calculateETag()
    {
        return "";
    }

    /**
     * Handles a PUT request for QC data
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

if (isset($_REQUEST['PrintImageQC'])) {
    $obj = new QC(
        $_SERVER['REQUEST_METHOD'],
        $_REQUEST['CandID'],
        $_REQUEST['VisitLabel'],
        $_REQUEST['Filename']
    );
    print $obj->toJSONString();
}
?>
