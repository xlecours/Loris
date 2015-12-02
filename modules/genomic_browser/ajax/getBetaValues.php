<?php
/**
 * This file is used by the Dashboard to get the data for
 * the recruitment bar chart via AJAX
 *
 * PHP version 5
 *
 * @category Epigenomics
 * @package  Loris
 * @author   Loris Team <loris-dev@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

header("content-type:application/json");
ini_set('default_charset', 'utf-8');

$DB            = Database::singleton();
$beta_values   = array();
$query         = "";
$groups        = explode(' ',$_REQUEST['groups']);
$select = "SELECT '17' as chromosome,
               t.position as position,
               t.cpg as cpg,
               MIN(t.Beta_value) as min,
               AVG(t.Beta_value) as mean,
               MAX(t.Beta_value) as max,
               COUNT(t.Beta_value) as count";
$from = " FROM
               (
               SELECT
                   candidate.PSCID as candidate,
                   candidate.gender as gender,
                   cohort.SubprojectID as subproject,
                   genomic_cpg.CpG as cpg,
                   genomic_cpg.Beta_value as beta_value,
                   genome_loc.StartLoc as position
               FROM candidate
               LEFT JOIN (select s.CandID, min(s.subprojectID) as SubprojectID
                          from session s GROUP BY s.CandID) AS cohort
                   ON (cohort.CandID = candidate.CandID)
                   JOIN genomic_cpg 
                   ON (candidate.CandID = genomic_cpg.CandID)
                   LEFT JOIN genome_loc 
                   ON (genome_loc.GenomeLocID = genomic_cpg.GenomeLocID)
                   LEFT JOIN genotyping_platform 
                   ON (genomic_cpg.PlatformID = genotyping_platform.PlatformID)
               WHERE
                   candidate.Entity_type = 'Human' AND 
                   candidate.Active = 'Y'
               ) as t ";

$group_by = "GROUP BY chromosome, cpg";

if ( !empty($groups) ) {

    $select .= ", " . implode(", ", $groups);
    $group_by .= ", " . implode(", ", $groups);
    $query = $select . $from . $group_by;

}

$results = $DB->pselect($query, array() );

// Arrange the results by regrouping grouped values on the same row.

//print json_encode($beta_values);
print(json_encode($results));
exit();

?>
