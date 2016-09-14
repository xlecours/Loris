<?php
/**
 * This file is used by the Genomic module to get a all beta value
 * from the genomic_cpg table via AJAX
 *
 * PHP version 5
 *
 * @category Epigenomics
 * @package  Loris
 * @author   Xavier Lecours Boucher <loris-dev@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */


// Check that the user has genomic_browser_view permission
$user = User::singleton();
if (!$user->hasPermission('genomic_browser_view_site')
        && !$user->hasPermission('genomic_browser_view_allsites')
   ) {
    error_log("ERROR: Permission denied");
    header('HTTP/1.1 403 Forbidden');
    exit(2);
}

// TODO :: Add some validation about the $_REQUEST
if (false) {
    error_log("ERROR: Invalid filename");
    header("HTTP/1.1 400 Bad Request");
    exit(3);
}

// TODO :: Add params from $_SESSION
$params = array(
        'v_chromosome' => $_REQUEST['chromosome'],
        'v_startloc'   => $_REQUEST['startLoc'],
        'v_endloc'     => $_REQUEST['endLoc'],
           );

$DB    = Database::singleton();
$query = "
    SELECT 
      cpg.cpg_name as cpg,
      cpg.beta_value as beta_value,
      l.StartLoc as cpg_loc,
      c.PSCID pscid,
      c.Gender as gender,
      s.title as subproject,
      c.CandID as candidate_id,
      gscr.sample_label as sample_labels
    FROM genomic_cpg_annotation a 
    LEFT JOIN genome_loc l 
      ON (l.GenomeLocId = a.location_id) 
    LEFT JOIN genomic_cpg cpg 
      USING (cpg_name) 
    LEFT JOIN genomic_sample_candidate_rel gscr 
      USING (sample_label) 
    LEFT JOIN candidate c 
      USING (CandID) 
    LEFT JOIN (SELECT s.CandID as CandID, GROUP_CONCAT(p.title) as title FROM session s JOIN subproject p USING (SubprojectID) GROUP BY CandID) s 
      USING (CandID)
    WHERE (
     LOWER(l.chromosome) = LOWER(:v_chromosome) OR
     LOWER(CONCAT('chr',l.chromosome)) = LOWER(:v_chromosome)
    ) AND
    l.StartLoc BETWEEN :v_startloc AND :v_endloc AND
    c.Entity_type = 'Human' AND
    c.Active = 'Y'";
$results = $DB->pselect($query, $params);

// result should look like : [{"cpg":"cg01538301","beta_value":"0.660","cpg_loc":"52837337","pscid":"DCC0008","gender":"Female"},{"cpg":"cg10099572","beta_value":"0.123","cpg_loc":"52866122","pscid":"DCC0008","gender":"Female"},{"cpg":"cg10146780","beta_value":"0.673","cpg_loc":"52897968","pscid":"DCC0008","gender":"Female"}]

// return the results in JSON format
header("content-type:application/json");
ini_set('default_charset', 'utf-8');
print(json_encode($results));
exit();
?>
