<?php
/**
 * This file contains a class which encapsulates the concept of a "Project"
 * in LORIS.
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

namespace LORIS;

/**
 * The Project class encapsulates all details of a project.
 *
 * @category Main
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Project
{
    private static $_instances = array();

    protected $id;
    protected $name;
    protected $recruitmenttarget;

    /**
     * Private constructor to make sure that the singleton function is used
     */
    private function __construct(int $id, string $name, int $recruitmenttarget)
    {
        $this->id = $id;
        $this->name = $name;
        $this->recruitmenttarget = $recruitmenttarget;
    }

    /**
     * Get this project's id
     *
     * @return integer This project's id
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set this project's id
     *
     * @param integer $projectId This project's id
     *
     * @return void
     */
    public function setId($projectId)
    {
        $this->_projectId = $projectId;
    }

    /**
     * Get this project's name
     *
     * @return string This project's name
     */
    public function getName()
    {
        return $this->_projectName;
    }

    /**
     * Set this project's name
     *
     * @param string $projectName This project's name
     *
     * @return void
     */
    public function setName($projectName)
    {
        $this->_projectName = $projectName;
    }

    /**
     * Get the project's recruitment target.
     *
     * @note If the database value is null then the return value will be the sum of
     * all this project's subproject recruitment target.
     *
     * @return string This project's name
     */
    public function getRecruitmentTarget()
    {
        if (empty($this->_recruitmentTarget)) {
            $total = array_reduce(
                $this->getSubprojects(),
                function ($carry, $item) {
                    return $carry + $item->_recruitmentTarget;
                },
                0
            );
            // The following assignment is temporary and is not transmitted to the
            // database.
            $this->_recruitmentTarget = $total;
        }
        return $this->_recruitmentTarget;
    }

    /**
     * Get that project subprojects as defined in the project_rel table
     *
     * @return array A list of object representation of subprojects
     */
    public function getSubprojects()
    {
        $factory        = \NDB_Factory::singleton();
        $subProjectData = $factory->database()->pselect(
            "
            SELECT
              sp.subprojectId,
              sp.title,
              sp.useEDC,
              sp.windowDifference,
              sp.recruitmentTarget
            FROM
              project_rel pr
            JOIN 
              subproject sp USING (subprojectId)
            WHERE
              pr.projectId = :v_project_id
            ",
            array('v_project_id' => $this->_projectId)
        );

        return array_map(
            function ($row) {
                return (object) array(
                                 'subprojectId'      => $row['subprojectId'],
                                 'title'             => $row['title'],
                                 'useEDC'            => $row['useEDC'],
                                 'windowDifference'  => $row['windowDifference'],
                                 'recruitmentTarget' => $row['recruitmentTarget'],
                                );
            },
            $subProjectData
        );
    }

    /**
     * Get that project's participants
     *
     * @return array A list of object representation of a basic candidates
     */
    public function getCandidateIds()
    {
        $factory = \NDB_Factory::singleton();

        $p = array($this->_projectId);
        if ($factory->config()->getSetting('useProjects') !== 'true') {
            array_push($p, '-1');
        }
        $candidatesData = $factory->database()->pselect(
            "
            SELECT
              candid
            FROM
              candidate
            WHERE
              active = 'Y' AND
              FIND_IN_SET(IFNULL(projectId, '-1'), :v_project_id)
            ",
            array('v_project_id' => implode(',', $p))
        );
        return array_map(
            function ($row) {
                return $row['candid'];
            },
            $candidatesData
        );
    }
}
