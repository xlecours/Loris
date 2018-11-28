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

class LegoPhantomPipeline extends AbstractServerProcess
{
    /**
     * String identifying the type of process for all objects of this class.
     */
    const PROCESS_TYPE = 'lego_phantom_pipeline';

    /**
     * Phantom pipeline source location
     * TODO :: This should come from the database
     */
    const SOURCE_LOCATION = __DIR__ . '/../../../tools/phantom_pipeline_launcher.php';

    /**
     * The session to call the pipeline on
     *
     * @var integer
     */
    private $timepoint;

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
        \Timepoint $timepoint = null, $id = null, $pid = null,
        $stdoutFile = null, $stderrFile = null,
        $exitCodeFile = null, $exitCode = null, $userid = null,
        $startTime = null, $endTime = null, $exitText = null
    ) {
        $this->timepoint  = $timepoint;

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
        $username = $this->getUserId();
        $script_path = self::SOURCE_LOCATION;
        $cbrainfilename = $this->timepoint->getVisitLabel();
        return "USER=$username php $script_path $cbrainfilename";
    }

    /**
     * Computes the current process progress.
     *
     * @return string computed progress.
     */
    public function getProgress()
    {
        // To be implemented in a later stage
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
        if ($exitCode === null) {
            return null;
        }

        if ($exitCode === '0') {
            $fileinfo = new \SplFileInfo($this->getStdoutFile());

        } else {
            $fileinfo = new \SplFileInfo($this->getStderrFile());
        }

        if (!$fileinfo->isReadable()) {
            return 'unknown';
        }

        $file = $fileinfo->openFile('r');
        return $file->fread($file->getSize());
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
             'v_session_id' => $this->timepoint->getSessionID(),
             'v_process_id' => $this->getPid(),
            ),
            array('nofetch' => true)
        );
    }
}

