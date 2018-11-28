<?php
/**
 * Endpoint for phantom_processing
 *
 * PHP Version 7
 *
 * @category   Endpoint
 * @package    Imaging
 * @subpackage Processing
 * @author     Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris-Trunk/
 */
namespace LORIS\phantom_processing;

/**
 * Endpoint handler for phantom_processing
 *
 * PHP Version 7
 *
 * @category   Endpoint
 * @package    Imaging
 * @subpackage Processing
 * @author     Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris-Trunk/
 */
class PhantomProcessMySQLAccessor
{
    public function __construct(\Database $db)
    {
        $this->database = $db;
    }

    public function getSessionServerProcesses(\Timepoint $session): array
    {
        $stmt = $this->database->prepare('
         SELECT
           sp.id,
           sp.exit_code,
           sp.exit_text,
           sp.userid,
           sp.start_time,
           sp.end_time
         FROM session_server_processes_rel sspr
         LEFT JOIN server_processes sp
           ON (sp.id = sspr.processID)
         JOIN server_process_type spt
           ON (sp.ProcessTypeID = spt.ProcessTypeID)
         WHERE
           spt.Name = "lego_phantom_pipeline" AND
           sspr.sessionID = :v_sessionid
        ');

        return $this->database->execute($stmt, array('v_sessionid' => $session->getSessionID()));
    }
} 

