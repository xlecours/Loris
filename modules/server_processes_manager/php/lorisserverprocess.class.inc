<?php
/**
 * This file contains code to perform a complete LORIS server process.
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
use \LORIS\ToolDescriptors\ToolDescriptor;

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

class LORISServerProcess extends AbstractServerProcess
{
    private $toolDescriptor;

    public function withTool(ToolDescriptor $descriptor): LORISServerProcess
    {
        $new = clone $this;
        $new->toolDescriptor = $descriptor;
        return $new;
    }

    /**
     * Specifies the Unix shell command used to run the process
     *
     * @return   string Unix shell command
     */
    public function getShellCommand()
    {
        return $this->toolDescriptor->getcommandLine();
    }

    /**
     * Specifies how to compute the current process progress
     *
     * @return   string current progress text
     */
    public function getProgress()
    {
        return '';
    }

    /**
     * Specifies how to compute the text returned when the process is finished
     *
     * @param int    $exitCode process exit code
     * @param string $endTime  time at which the process ended
     *
     * @return   string current return text
     */
    public function computeExitText($exitCode, $endTime)
    {
        return "[$endTime] Task exited with $exitCode";
    }

    /**
     * Specifies the ID for the task type
     *
     * @return   string type of task
     */
    public function getType()
    {
        return 'loris internal';
    }

}
