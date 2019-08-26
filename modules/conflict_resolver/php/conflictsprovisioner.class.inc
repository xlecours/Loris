<?php declare(strict_types=1);
/**
 * PHP Version 7
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Behavioural
 * @author     Xavier Lecours <xavier.lecours@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */

namespace LORIS\conflict_resolver;

/**
 * This class implements a data provisioner to get all possible rows
 * for the unresolved conflicts menu page.
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Behavioural
 * @author     Xavier Lecours <xavier.lecours@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */

class ConflictsProvisioner extends \LORIS\Data\Provisioners\DBObjectProvisioner
{
    /**
     * Create a RowProvisioner
     */
    function __construct()
    {
        parent::__construct(
            '
             SELECT
              conflicts_unresolved.ConflictID as id,
              conflicts_unresolved.TableName as instrument,
              session.CandID as candid,
              candidate.PSCID as pscid,
              session.Visit_label as visitlabel,
              Project.Name as project,
              conflicts_unresolved.FieldName as question,
              conflicts_unresolved.Value1 as value1,
              conflicts_unresolved.Value2 as value2,
              "" as correctanswer,
              NULL as resolutiontimestamp,
              psc.name as site,
              session.CenterID as centerid
             FROM
              conflicts_unresolved 
             LEFT JOIN flag ON (conflicts_unresolved.CommentId1=flag.CommentID)
             LEFT JOIN session ON (flag.SessionID=session.ID)
             LEFT JOIN candidate ON (candidate.CandID=session.CandID)
             LEFT JOIN Project ON (candidate.ProjectID=Project.ProjectID)
             LEFT JOIN psc ON (session.CenterID = psc.CenterID)
             WHERE session.Active="Y" AND candidate.Active ="Y"
             UNION
             SELECT
              conflicts_resolved.ResolvedID as id,
              conflicts_resolved.TableName as instrument,
              session.CandID as candid,
              candidate.PSCID as pscid,
              session.Visit_label as visitlabel,
              Project.Name as project,
              conflicts_resolved.FieldName as question,
              conflicts_resolved.OldValue1 as value1,
              conflicts_resolved.OldValue2 as value2,
              conflicts_resolved.NewValue  as correctanswer,
              conflicts_resolved.ResolutionTimestamp as resolutiontimestamp,
              psc.name as site,
              session.CenterID as centerid
             FROM
              conflicts_resolved
             LEFT JOIN flag ON (conflicts_resolved.CommentId1=flag.CommentID)
             LEFT JOIN session ON (flag.SessionID=session.ID)
             LEFT JOIN candidate ON (candidate.CandID=session.CandID)
             LEFT JOIN Project ON (candidate.ProjectID=Project.ProjectID )
             LEFT JOIN psc ON (session.CenterID = psc.CenterID)
             WHERE session.Active="Y" AND candidate.Active ="Y"
            ',
            array(),
            '\LORIS\conflict_resolver\ConflictDTO'
        );
    }

    /**
     * Creates a new providionner with user specific filter.
     *
     * @param \User $user The requesting user
     *
     * @return CandidatesProvisioner
     */
    public function forUser(\User $user): ConflictsProvisioner
    {
        $new = clone($this);
        if (!$user->hasPermission('access_all_profiles')) {
            $new = $new->filter(
                new \LORIS\Data\Filters\UserSiteMatch()
            );
        }
        return $new;
    }
}
