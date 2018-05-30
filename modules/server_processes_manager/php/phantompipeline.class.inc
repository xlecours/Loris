<?php
/**
 * This file contains code to perform a complete MRI upload on the server.
 *
 * PHP Version 5
 *
 * @category ServerProcessLauncher
 * @package  Loris
 * @author   Nicolas Brossard <nicolasbrossard.mni@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
namespace LORIS\server_processes_manager;

/**
 * A class for holding a set of functions to perform a complete MRI
 * upload on the server.
 *
 * @category ServerProcessLauncher
 * @package  Loris
 * @author   Nicolas Brossard <nicolasbrossard.mni@gmail.com>
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
     * Basename of the file used to set the environment variables before the
     * upload can take place.
     */
    const ENVIRONMENT_BASENAME = 'environment';

    /**
     * Location of the MRI file uploaded.
     *
     * @var string
     */
    private $_sourceLocation;

    /**
     * Builds a new MriUploadServerProcess
     *
     * @param int    $userfileID     CBRAIN userfileID.
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
        $userfileID = null, $sourceLocation= null, $id = null, $pid = null,
        $stdoutFile = null, $stderrFile = null,
        $exitCodeFile = null, $exitCode = null, $userid = null,
        $startTime = null, $endTime = null, $exitText = null
    ) {
        //FIXME :: this should come from configs or database
        $this->_sourceLocation = $sourceLocation;
        $this->userfileId      = $userfileID;

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
        return "php $this->_sourceLocation $this->userfileId";
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
        $exitCode = parent::getExitCode();

        return !is_null($exitCode) && is_numeric($exitCode) && $exitCode == 0;
    }
}

?>
