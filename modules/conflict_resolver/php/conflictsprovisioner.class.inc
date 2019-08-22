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
              conflicts_unresolved.TableName as instrument,
              session.CandID as candID,
              candidate.PSCID as pscid,
              session.Visit_label as visit_label,
              Project.Name as Project,
              conflicts_unresolved.FieldName as question,
              "" as Correct_Answer,
              conflicts_unresolved.Value1 as Value1,
              conflicts_unresolved.Value2 as Value2,
              MD5(
                 CONCAT_WS(
                     ":",
                     conflicts_unresolved.TableName,
                     conflicts_unresolved.ExtraKeyColumn,
                     conflicts_unresolved.ExtraKey1,
                     conflicts_unresolved.ExtraKey2,
                     conflicts_unresolved.FieldName,
                     conflicts_unresolved.CommentId1,
                     conflicts_unresolved.CommentId2
                 )
             )
             as Hash,
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
