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
           sp.*
         FROM session_server_processes_rel sspr
         LEFT JOIN server_processes sp
           ON (sp.id = sspr.processID)
         JOIN server_process_type spt
           ON (sp.ProcessTypeID = spt.ProcessTypeID)
         WHERE
           spt.Name = "phantom_pipeline" AND
           sspr.sessionID = :v_sessionid
        ');

        return [
        'isPhantom' => true,
        'pipelineRuns' => [
            ['taskid'=> 603756, 'server'=>'AceLab-VH-2', 'status'=> 'Failed', 'run'=> 1, 'startts'=> '2018-11-14 16:55:37 EST', 'lastts'=> '2018-11-14 20:14:32 EST'],
            ['taskid'=> 603780, 'server'=>'AceLab-VH-2', 'status'=> 'Completed', 'run'=> 1, 'startts'=> '2018-11-14 20:53:06 EST', 'lastts'=> '2018-11-15 00:11:54 EST']
        ]
      ];

        return $this->database->execute($stmt, array('v_sessionid' => $session->getSessionID()));
    }
} 

