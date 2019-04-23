<?php
/**
 * This file is used by the Dashboard to get the data for
 * the recruitment bar chart via AJAX
 *
 * PHP version 5
 *
 * @category Main
 * @package  Loris
 * @author   Tara Campbell <tara.campbell@mail.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

header("content-type:application/json");
ini_set('default_charset', 'utf-8');

$DB            = Database::singleton();

// todo use $SubprojectsWithMRI
$SubprojectsWithMRI = $DB->pselect(
    "SELECT DISTINCT(title), SubprojectID 
             FROM subproject 
               JOIN session USING (SubprojectID) 
               JOIN candidate c USING (CandID)
             WHERE Scan_done='Y' AND c.Active='Y' AND c.Entity_type='Human' 
               AND c.CenterID <> 1",
    array()
);
// todo use $VisitLabelsWithMRI
$VisitLabelsWithMRI = array(
    "EN00", "BL00", "FU03", "FU12", "FU24", "FU36", "FU48"
);

$genderData    = array();
$list_of_sites = Utility::getAssociativeSiteList(true, false);

$list_of_mri = array();
for ($i=0; $i<count($VisitLabelsWithMRI); $i++) {

    $temp = [];
    for ($j=0; $j<count($SubprojectsWithMRI); $j++) {
        $visit = $VisitLabelsWithMRI[$i];
        $subproject = $SubprojectsWithMRI[$j]['title'];
        $temp[$SubprojectsWithMRI[$j]['title']] = getTotalMRISessions(
            $visit,
            $subproject
        );
    }
    $list_of_mri[] = $temp;

    $label = $VisitLabelsWithMRI[$i];
    $totalRecruitment['labels'][] = $label;

    $totalRecruitment['datasets'][$label] = $temp;

}

//foreach ($list_of_sites as $siteID => $siteName) {
//    $genderData['labels'][] = $siteName;
//    $genderData['datasets']['female'][] = $DB->pselectOne(
//        "SELECT COUNT(c.CandID)
//         FROM candidate c
//         WHERE c.CenterID=:Site AND c.Gender='female' AND c.Active='Y'
//         AND c.Entity_type='Human'",
//        array('Site' => $siteID)
//    );
//    $genderData['datasets']['male'][]   = $DB->pselectOne(
//        "SELECT COUNT(c.CandID)
//         FROM candidate c
//         WHERE c.CenterID=:Site AND c.Gender='male' AND c.Active='Y'
//         AND c.Entity_type='Human'",
//        array('Site' => $siteID)
//    );
//}

print json_encode($totalRecruitment);

return 0;

/**
 * Gets the total count of MRI sessions per visit label and subproject
 *
 * @param string $visit_label visit label without the subproject prefix ("%EN00", "%BL00", "%FU03", "%FU12", "%FU24", "%FU36" or "%FU48")
 *
 * @return int
 */
function getTotalMRISessions($visit_label, $subproject)
{
    $DB    = \Database::singleton();
    $total = $DB->pselectOne(
        "SELECT COUNT(c.CandID)
             FROM candidate c
               JOIN session s USING (CandID) 
               JOIN subproject sub USING (SubprojectID)
             WHERE s.Visit_label LIKE :VisitLabel 
               AND sub.title=:Subproject
               AND Scan_done = 'Y' 
               AND c.Active='Y' 
               AND c.Entity_type='Human'
               AND c.CenterID <> 1",
        array('VisitLabel' => "%$visit_label", 'Subproject' => $subproject)
    );
    return $total;
}

?>
