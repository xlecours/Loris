<?php
/**
 * This file is used by the Dashboard to get the data for
 * the recruitment pie chart via AJAX
 *
 * PHP version 5
 *
 * @category Main
 * @package  Loris
 * @author   Tara Campbell <tara.campbell@mail.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */

ini_set('default_charset', 'utf-8');

$DB = Database::singleton();

$recruitmentBySiteData = array();

$myHandednessArray = ['Right-handed', 'Left-handed', 'Ambidextrous'];

for ($i=0; $i<count($myHandednessArray); $i++) {

    $totalRecruitment = getTotalHandedness($myHandednessArray[$i]);
    $recruitmentBySiteData[] = array(
                                "label" => $myHandednessArray[$i],
                                "total" => $totalRecruitment,
                               );
}

print json_encode($recruitmentBySiteData);

return 0;

/**
 * Gets the total count of candidates of a specific handedness
 *
 * @param string $handedness handedness interpretation (Right-handed, Left-handed or Ambidextrous)
 *
 * @return int
 */
function getTotalHandedness($handedness)
{
    $DB    = \Database::singleton();
    $total = $DB->pselectOne(
        "SELECT COUNT(c.CandID)
             FROM candidate c
               JOIN session s USING (CandID) 
               JOIN flag f ON (f.SessionID=s.ID)
               JOIN handedness h USING (CommentID) 
             WHERE h.interpretation=:Handedness 
               AND c.Active='Y' 
               AND c.Entity_type='Human'
               AND c.CenterID <> 1",
        array('Handedness' => $handedness)
    );
    return $total;
}

?>
