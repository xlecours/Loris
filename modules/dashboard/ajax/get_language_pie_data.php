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

$myHandednessArray = ['French', 'English'];

for ($i=0; $i<count($myHandednessArray); $i++) {

    $totalRecruitment = getTotalLanguage($myHandednessArray[$i]);
    $recruitmentBySiteData[] = array(
                                "label" => $myHandednessArray[$i],
                                "total" => $totalRecruitment,
                               );
}

print json_encode($recruitmentBySiteData);

return 0;

/**
 * Gets the total count of candidates of with a specific study language
 *
 * @param string $language study language (French or English)
 *
 * @return int
 */
function getTotalLanguage($language)
{
    $DB    = \Database::singleton();
    $total = $DB->pselectOne(
        "SELECT COUNT(c.CandID)
             FROM candidate c
             WHERE c.test_language=:Language 
               AND c.Active='Y' 
               AND c.Entity_type='Human'
               AND c.CenterID <> 1",
        array('Language' => $language)
    );
    return $total;
}

?>
