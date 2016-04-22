<?php
require_once __DIR__ . "/../vendor/autoload.php";
require_once "generic_includes.php";
require_once "Utility.class.inc";

    $db =& Database::singleton();
    $stmt = "SET @prefix = UNIX_TIMESTAMP()";
    $db->run($stmt);

    $stmt = "INSERT INTO genomic_sample_candidate_rel (sample_label, CandID) SELECT CONCAT(@prefix, '_', PSCID), CandID FROM candidate";
    $db->run($stmt);

    $stmt = "INSERT INTO genomic_cpg (sample_label, cpg_name, beta_value) SELECT sample_label, cpg_name, rand() FROM genomic_sample_candidate_rel JOIN genomic_cpg_annotation where sample_label LIKE CONCAT(@prefix,'%')";
    $db->run($stmt);

exit;
