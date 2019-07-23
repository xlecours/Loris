<?php declare(strict_types=1);
/**
 * This file implements a data provisioner to get all possible rows
 * for the candidates endpoint.
 *
 * PHP Version 7
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

namespace LORIS\api;

/**
 * This class implements a data provisioner to get all possible rows
 * for the candidates endpoint.
 *
 * PHP Version 7
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class CandidatesProvisioner extends \LORIS\Data\Provisioners\DBRowProvisioner
{
    /**
     * Create a RowProvisioner, which gets rows for candidates/
     * endpoint.
     */
    function __construct()
    {
        parent::__construct(
            '
             SELECT 
               c.CandID as CandID,
               p.Name as ProjectName,
               c.PSCID as PSCID,
               c.RegistrationCenterID as CenterID,
               s.Name as SiteName,
               c.EDC as EDC,
               c.DoB as DoB,
               c.Sex as Sex
             FROM
               candidate c
             JOIN psc s
               ON (s.CenterID = c.RegistrationCenterID)
             LEFT JOIN Project p
               ON (c.ProjectID = p.ProjectID)
             WHERE c.Active="Y"
            ',
            array()
        );
    }

    /**
     * Creates a new providionner with user specific filter.
     *
     * @param \User $user The requesting user
     *
     * @return CandidatesProvisioner
     */
    public function forUser(\User $user): CandidatesProvisioner
    {
        $new = clone($this);
        if (!$user->hasPermission('access_all_profiles')) {
            $new = $new->filter(
                new \LORIS\Data\Filters\UserSiteMatch()
            );
        }
        return $new;
    }

    /**
     * Returns an instance of a ProjectImagesRow object for a given
     * table row.
     *
     * @param array $row The database row from the LORIS Database class.
     *
     * @return \LORIS\Data\DataInstance An instance representing this row.
     */
    public function getInstance($row) : \LORIS\Data\DataInstance
    {
        return new CandidatesRow($row);
    }
}
