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

$myAgeArray = [[55,60], [60,65], [65,70], [70,75], [75,80], [80,90]];

for ($i=0; $i<count($myAgeArray); $i++) {

    $totalRecruitment = getTotalByAgeAtBL(($myAgeArray[$i])[0], ($myAgeArray[$i])[1]);

    $myLabel = strval($myAgeArray[$i][0]) . ' to ' . strval($myAgeArray[$i][1]);

    $recruitmentBySiteData[] = array(
                                "label" => $myLabel,
                                "total" => $totalRecruitment,
                               );
}

print json_encode($recruitmentBySiteData);

return 0;

/**
 * Gets the total count of candidates of a specific age range at the baseline
 * visit.
 *
 * @param int $age_min minimum age
 * @param int $age_max maximum age
 */
function getTotalByAgeAtBL($age_min, $age_max)
{
    $DB    = \Database::singleton();
    $total = $DB->pselectOne(
        "SELECT COUNT(c.CandID)
             FROM candidate c
               JOIN session s USING (CandID)
             WHERE s.Age_At_MRI >=:Age_min*12 
               AND s.Age_At_MRI <:Age_max*12
               AND c.Active='Y' 
               AND s.Visit_label LIKE '%BL00'
               AND c.Entity_type='Human' 
               AND c.CenterID <> 1",
        array('Age_min' => $age_min, 'Age_max' => $age_max)
    );
    return $total;
}

?>
