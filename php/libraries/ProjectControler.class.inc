<?php
namespace LORIS;

class ProjectControler
{
    protected $database;

    public function __construct(\Database $database)
    {
        if (!$database->isConnected()) {
            throw new \RuntimeException("VisitControler - Database not connected");
        }
        $this->database = $database;
    }

    public function getAllProjects()
    {
        return array_map(
            function ($row) {
                return new \LORIS\Project(
                    $row['id'],
                    $row['name'],
                    $row['recruitmenttarget']
                );
            },
            $this->database->pselect(
                'SELECT 
                  p.ProjectID as "id",
                  p.Name as "name",
                  p.recruitmentTarget as "recruitmenttarget"
                 FROM
                  Project p
                ',
                array()
            )
        );
    }

    /**
     * Get a specific project by it's name
     *
     * @param string $name That project's name
     *
     * @throws \LorisException If there is no project with that name
     * @return \LORIS\Project The project
     */
    public function getProjectByName(string $name): \LORIS\Project
    {
        $row = $this->database()->pSelectRow(
            'SELECT
              p.ProjectID as "id",
              p.Name as "name",
              p.recruitmentTarget as "recruitmenttarget"
             FROM
              Project p
             WHERE Name = :v_project_name
            ',
            array('v_project_name' => $name)
        );

        if (empty($row)) {
            throw new \LorisException("There is no project with taht name.");
        }

        return new Project($row['id'],$row['name'],$row['recruitmenttarget']);
    }

    
}
