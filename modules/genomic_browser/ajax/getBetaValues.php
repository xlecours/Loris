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
       AND genomic_cpg.chromosome = '1'
       AND genomic_cpg.cpg_loc BETWEEN 1 AND 100000000
ORDER  BY cpg,
          gender,
          pscid
";

// TODO :: Add tr...catch for the Database exception
$results = $DB->pselect($query, array() );

// Arrange the results by calculation statics.
$json = array();

// return the results in JSON format
header("content-type:application/json");
ini_set('default_charset', 'utf-8');
print(json_encode($json));
exit();



?>
