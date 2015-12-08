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
if (!$user->hasPermission('genomic_browser_view_site') &&
    !$user->hasPermission('genomic_browser_view_allsites') ) {
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
    'v_cpgchromosome' => $_REQUEST['chromosome'],
    'v_cpgstartloc'   => $_REQUEST['startLoc'],
    'v_cpgendloc'     => $_REQUEST['endLoc']
);

$DB          = Database::singleton();
$query       = "
SELECT genomic_cpg.cpg,
       genomic_cpg.beta_value,
       genomic_cpg.cpg_loc,
       candidate.pscid,
       candidate.gender
FROM   candidate
       JOIN session session
         ON ( candidate.candid = session.candid )
       LEFT JOIN psc
              ON ( psc.centerid = session.centerid )
       JOIN genomic_cpg
         ON ( genomic_cpg.candid = candidate.candid
              AND genomic_cpg.visit_id = session.id )
WHERE  candidate.entity_type = 'Human'
       AND candidate.active = 'Y'
       AND genomic_cpg.chromosome = :v_cpgchromosome
       AND genomic_cpg.cpg_loc BETWEEN :v_cpgstartloc AND :v_cpgendloc
ORDER  BY cpg,
          gender,
          pscid
";

// TODO :: Add tr...catch for the Database exception
$results = $DB->pselect($query, $params );

// return the results in JSON format
header("content-type:application/json");
ini_set('default_charset', 'utf-8');
print(json_encode($results));
exit();
?>
