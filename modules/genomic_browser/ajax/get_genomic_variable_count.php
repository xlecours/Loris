<?php
/**
 * This provide the count of a genomic variable type for a specific candidate.
 *
 * PHP Version 5
 *
 *  @category   Loris
 *  @package    Genomic_Module
 *  @author     Loris Team <loris.mni@bic.mni.mcgill.ca>
 *  @contriutor Xavier Lecours boucher <xavier.lecoursboucher@mcgill.ca>
 *  @license    Loris license
 *  @link       https://github.com/aces/Loris-Trunk
 */

$userSingleton =& User::singleton();
if (!$userSingleton->hasPermission('genomic_browser_view_site')
    && !$userSingleton->hasPermission('genomic_browser_view_allsites')
) {
    header("HTTP/1.1 403 Forbidden");
    exit;
}

if (empty($_REQUEST['CandID']) || empty($_REQUEST['variable_type'])) {
    header("HTTP/1.1 400 Bad Request");
    exit;
} 

switch ($_REQUEST['variable_type']) {
    case 'CNVs':
        $query = 'SELECT COUNT(CNVID) as CNVs
            FROM CNV
            WHERE CandID = :v_CandID';
        break;
    case 'CPGs':
        $query = 'SELECT COUNT(cpg_name) as CPGs 
            FROM genomic_cpg 
            JOIN genomic_sample_candidate_rel USING (sample_label)
            WHERE CandID = :v_CandID';
        break;
    case 'SNPs':
        $query = 'SELECT count(SNPID) as SNPs
            FROM SNP_candidate_rel
            WHERE CandID = :v_CandID';
        break;
    default:
        header("HTTP/1.1 400 Invalid variable type");
        exit;
        break;
}
$DB     =& Database::singleton();
$result = $DB->pselect($query, array('v_CandID' => $_REQUEST['CandID']));

header('Content-Type: application/json; charset=UTF-8');
echo json_encode($result);
exit;
?>
