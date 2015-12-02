<?php
/**
 * Opens a reference file or document used as part of the genomic module.
 * The file is only opened if the user is logged in has the 'epigenomic_full_data'
 * or 'epigenomic_restricted' permissions.
 * The file is printed as text.
 *
 * PHP Version 5
 *
 * @category Genomics
 * @package  Loris
 * @author   Xavier Lecours <xavierlb.mavan@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

set_include_path(get_include_path().":../project/libraries:../php/libraries:");
ini_set('default_charset', 'utf-8');

require_once __DIR__ . "/../../../vendor/autoload.php";

$user = User::singleton();

// Check that the user has epigenomics_data permission, or is an trainer
if (!$user->hasPermission('genomic_browser_view_allsites') &&
    !$user->hasPermission('genomic_browser_view_site') ) {
    error_log("ERROR: Permission denied for accessing $file");
    header('HTTP/1.1 403 Forbidden');
    exit(2);
}

$params = array(
    'v_cpgchromosome' => $_REQUEST['chromosome'],
    'v_cpgstartloc'   => $_REQUEST['startLoc'],
    'v_cpgendloc'     => $_REQUEST['endLoc']
);

$DB   = Database::singleton();
$rows = $DB->pselect(
    "
    SELECT 
        candidate.Gender, 
        cpg.cpg as name, 
        cpg.chromosome as chr,
        cpg.cpg_loc as mapinfo,
        COUNT(candidate.PSCID) AS nb_sample, 
        ROUND(AVG(cpg.beta_value),3) as mean, 
        ROUND(MAX(cpg.beta_value),3) AS maximum, 
        ROUND(MIN(cpg.beta_value),3) as minimum,
        ROUND(VARIANCE(cpg.beta_value),3) as var,  
        ROUND(SQRT(VARIANCE(cpg.beta_value)),3) as sd
    FROM candidate
        JOIN session session ON (candidate.CandID = session.CandID) 
        LEFT JOIN psc ON (psc.CenterID = session.CenterID)
        JOIN genomic_cpg cpg ON (cpg.CandID = candidate.CandID and cpg.visit_id = session.ID )
    WHERE candidate.Entity_type = 'Human' AND 
        candidate.Active = 'Y' AND
        cpg.chromosome = :v_cpgchromosome AND
        cpg.cpg_loc BETWEEN :v_cpgstartloc AND :v_cpgendloc
    GROUP BY cpg.cpg, candidate.Gender 
    ORDER BY candidate.Gender, cpg.cpg_loc
    ",
    $params
);

// Create an array for CpG and an
// an array for each group.
$temporary_array = array();
foreach ($rows as $row) {

    $cpg_name = $row['name'];
    $cpg_location = $row['mapinfo'];
    $gender = $row['Gender'];
    $mean = $row['mean'];

    if (isset($temporary_array[$cpg_name])) {
        $temporary_array[$cpg_name][$gender]=floatval($mean);
    } else {
        $temporary_array[$cpg_name] = array('CpG'=>intval($cpg_location), $gender=>floatval($mean));
    }

}
$json_response = array();
foreach ($temporary_array as $cpg=>$data) {
    array_push($json_response, $data);
}

// TODO :: Not working properly. CpG -> value correspondance is lost.
//$json_response[0] = array_merge(array(0 => 'genome_loc'), array_values($header_data));
//$json_response[1] = array_merge(array(0 => 'Male'), $groups_data['Male']);
//$json_response[2] = array_merge(array(0 => 'Female'), $groups_data['Female']);

header("content-type:application/json");
ini_set('default_charset', 'utf-8');
print(json_encode($json_response));

exit(0);
?>
