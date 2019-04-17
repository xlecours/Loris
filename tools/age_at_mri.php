<?php declare(strict_types=1);

require_once 'generic_includes.php';


$query = "SELECT c.CandID,c.DoB,mpf.Date_taken,visit_label
    FROM candidate c
    INNER JOIN session s on s.CandID = c.CandID
    INNER JOIN flag f on s.ID = f.SessionID
    INNER JOIN mri_parameter_form mpf on mpf.CommentID = f.CommentID
    WHERE f.test_name='mri_parameter_form' and f.CommentID NOT LIKE 'DDE%' and (visit_label like 'PRE%' or visit_label like 'NAP%') and date_taken <= '2017-11-27' and f.Administration is not null and f.Administration!='None'";
$result = \Database::singleton()->pselect($query, array());

$template = "UPDATE session SET Age_At_MRI = '%s' WHERE CandID =%s and Visit_label = '%s';";

$UPDATEQueue = array();
$skipped = 0;

foreach ($result as $row) {
    if (empty($row['Date_taken'] || empty($row['CandID']))) {
        $skipped++;
        continue;
    }
    $age = \Utility::calculateAge($row['DoB'], $row['Date_taken']);
    $months = $age['year']*12 + $age['mon'] + ($age['day']/30);
    // 1 Decimal.
    $months = (round($months*10) / 10.0);
    $age = $months;
    $UPDATEQueue[] = sprintf($template, $age, $row['CandID'], $row['visit_label']);
}

echo implode("\n", $UPDATEQueue);

$skippedMessage = "\nSkipped $skipped candidates due to missing DoB in candidate table " .
    "or missing Date_taken in mri_parameter_form table.\n";

fwrite(STDERR, $skippedMessage);
