<?php
/**
 * This file contains code to lauch the phantom_pipeline tool.
 *
 * PHP Version 7
 *
 * @category Processing
 * @package  Imaging
 * @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
namespace LORIS\server_processes_manager;

/**
 * Class specific to the phantom pipeline tool server process
 *
 * @category Processing
 * @package  Imaging
 * @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

class PhantomPipeline extends AbstractServerProcess
{
    /**
     * String identifying the type of process for all objects of this class.
     */
    const PROCESS_TYPE = 'phantom_pipeline';

    /**
     * Phantom pipeline source location
     * TODO :: This should come from the database
     */
    const SOURCE_LOCATION = __DIR__ . '/../../../tools/phantom_pipeline.php';

    /**
     * The sessionid associated to the cbrain userfileid
     *
     * @var integer
     */
    private $sessionId;

    /**
     * The CBRAIN userfile_id
     *
     * @var integer
     */
    private $userfileId;

    /**
     * Builds a new PhantomPipeline process
     *
     * @param int    $userfileId     CBRAIN userfile_id.
     * @param string $sourceLocation Source full path
     * @param int    $id             ID of the process in the database.
     * @param int    $pid            PID for this process
     * @param string $stdoutFile     full path of file used to store the process's
     *                               stdout
     * @param string $stderrFile     full path of file used to store the process's
     *                               stderr
     * @param string $exitCodeFile   full path of file used to store the process's
     *                               exit code
     * @param int    $exitCode       process's exit code
     * @param string $userid         ID of the user who launched the process
     * @param string $startTime      time at which the process was started
     * @param string $endTime        time at which the process ended
     * @param string $exitText       result of the process in text form
     */
    public function __construct(
        $userfileId = null, $sessionId= null, $id = null, $pid = null,
        $stdoutFile = null, $stderrFile = null,
        $exitCodeFile = null, $exitCode = null, $userid = null,
        $startTime = null, $endTime = null, $exitText = null
    ) {
        $this->sessionId  = $sessionId;
        $this->userfileId = $userfileId;

        parent::__construct(
            $id,
            $pid,
            self::PROCESS_TYPE,
            $stdoutFile,
            $stderrFile,
            $exitCodeFile,
            $exitCode,
            $userid,
            $startTime,
            $endTime,
            $exitText
        );
    }

    /**
     * Gets the shell command used to start this process.
     *
     * @return string shell command.
     */
    public function getShellCommand()
    {
        $script_absolute_path = self::SOURCE_LOCATION;
        return "php $script_absolute_path $this->userfileId";
    }

    /**
     * Computes the current process progress.
     *
     * @return string computed progress.
     */
    public function getProgress()
    {
        // To be implemented in a later stage
        error_log('PhantomPipeline::getProgress');
        return '';
    }

    /**
     * Computes the process the should output when is terminates.
     *
     * @param int    $exitCode process exit code.
     * @param string $endTime  time at which the process ended.
     *
     * @return string process exit text.
     */
    public function computeExitText($exitCode, $endTime)
    {
        // TODO
        if (is_null($exitCode)) {
            return null;
        } elseif (is_numeric($exitCode) && $exitCode == 0) {
            return "Finished MRI uploading (pid = " . $this->getPid() . ")"
                   . " End time:" . $endTime;
        } else {
            return "MRI upload task (pid = " . $this->getPid() . ")"
                   . " failed: error code is $exitCode";
        }
    }

    /**
     * Accessor for the process type.
     *
     * @return string process type.
     */
    public function getType()
    {
        return self::PROCESS_TYPE;
    }

    /**
     * Whether $outfile, $_errfile and $_exitCodeFile should be deleted once the
     * process is finished. These files will be deleted only if the pipeline
     * executed successfully (i.e. with exit code 0).
     *
     * @return boolean true if the files should be deleted, false otherwise
     */
    public function deleteProcessFiles()
    {
        return false;
    }

    public function addSessionProcessRel()
    {
        $database = $this->getDatabaseProvider()->getDatabase();

        $stmt = $database->prepare(
            '
          INSERT INTO session_server_processes_rel 
            (sessionID, processID) 
          SELECT :v_session_id, id 
          FROM server_processes 
          WHERE pid = :v_process_id
        '
        );

        $database->execute(
            $stmt,
            array(
             'v_session_id' => $this->sessionId,
             'v_process_id' => $this->getPid(),
            ),
            array('nofetch' => true)
        );
    }
}

?>
