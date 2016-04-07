<?php
require_once "../../../php/exceptions/LorisException.class.inc";
require_once "../../../php/exceptions/DatabaseException.class.inc";
require_once "../../../php/libraries/Database.class.inc";


    $db =& Database::singleton('LORIS', 'root', '$Demo4022', 'localhost');
    $stmt = "SET @prefix = UNIX_TIMESTAMP()";
    $db->run($stmt);

    $stmt = "INSERT INTO genomic_sample_candidate_rel (sample_label, CandID) SELECT CONCAT(@prefix, '_', PSCID), CandID FROM candidate";
    $db->run($stmt);

    $stmt = "INSERT INTO genomic_cpg (sample_label, cpg_name, beta_value) SELECT sample_label, cpg_name, rand() FROM genomic_sample_candidate_rel JOIN genomic_cpg_annotation where sample_label LIKE CONCAT(@prefix,'%')";
    $db->run($stmt);

exit;
