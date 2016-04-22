<?php
require_once __DIR__ . "/../vendor/autoload.php";
require_once "generic_includes.php";
require_once "Utility.class.inc";

    $conn = new PDO(
        'mysql:host=genome-mysql.cse.ucsc.edu;dbname=hg19',
        'genome'
    );

    $conn->setAttribute(
        PDO::ATTR_ERRMODE,
        PDO::ERRMODE_EXCEPTION
    );

    $sql = "
        SELECT
          name,
          chrom,
          chromStart,
          chromEnd,
          strand,
          attrTags,
          attrVals
        FROM
          cnvDevDelayCase
        WHERE
          chrom = 'chr14' AND
          chromStart BETWEEN 25000000 AND 35000000
        LIMIT 100
    ";

    $genome_loc_values    = array();
    $CNV_values           = array();
    $row_count            = 0;

    $candidate_list = getListCandID();
    if (empty($candidate_list)) {
        print "Please, create your candidates first\n";
        exit;
    }

    $plateform_id = create_CNV_platform();

    foreach ($conn->query($sql,  PDO::FETCH_ASSOC) as $row) {
        $chrom  = $row['chrom'];
        $start  = $row['chromStart'];
        $end    = $row['chromEnd'];
        switch ($row['strand']) {
            case '+':
                $strand = 'Forward';
                break;
            case '-':
                $strand = 'Reverse';
                break;
            default:
                $strand = 'undefined';
        }

        array_push(
            $genome_loc_values,
            "('$chrom', $start, $end, '$strand')"
        ); 

        $tags = explode(',', $row['attrTags']);
        $vals = explode(',', $row['attrVals']);
        $attributes = array_combine($tags, $vals);

        $CandID             = $candidate_list[array_rand($candidate_list)]; 
        $description        = $row['name'];
        $event_name         = $attributes['var_type'];
        switch ($event_name) {
            case 'copy_number_gain':
                $type = 'gain';
                $copy_number_change = rand(1,5);
                break;
            case 'copy_number_loss':
                $type = 'loss';
                $copy_number_change = rand(1,5);
                break;
            default: 
                $type = 'unknown';
                $copy_number_change = null;
        }

        $common             = 'Y';

        $enum = array('Benign','Pathogenic','Unknown');
        $characteristics    = $enum[array_rand($enum)];

        $enum = array('de novo','NA','unclassified','unknown','maternal','paternal');
        $inheritance        = $enum[array_rand($enum)];

        $enum = array('Normal','Abnormal','Pending','Uncertain');
        $array_report       = $enum[array_rand($enum)];
        
        array_push(
            $CNV_values,
            "($CandID, '$description','$type', '$event_name', '$common', '$characteristics', $copy_number_change, '$inheritance', '$array_report', $plateform_id, (SELECT GenomeLocID FROM genome_loc WHERE Chromosome = '$chrom' AND StartLoc = $start AND EndLoc = $end) )"
        );

        $row_count++;

        if($row_count % 100 == 0) {
            insert_genome_loc($genome_loc_values);
            $genome_loc_values = array();
            insert_CNV($CNV_values);
            $CNV_values = array();
        }
    }

    insert_genome_loc($genome_loc_values);
    insert_CNV($CNV_values);

    $conn = null;
    exit;

function create_CNV_platform() 
{
    $stmt = "INSERT IGNORE INTO genotyping_platform (Name, Description) VALUES ('Custom CNV array', 'A platform inserted for demo purposes')";

    $db =& Database::singleton();
    $db->run($stmt);

    return $db->pselectOne("SELECT PlatformID FROM genotyping_platform WHERE Name = 'Custom CNV array'", array());
}

function insert_genome_loc(&$values) 
{
    if (!empty($values) && is_array($values)) {

        $stmt = 'INSERT IGNORE INTO genome_loc (Chromosome, StartLoc, EndLoc, Strand) VALUES ';
        $stmt .= join(',', $values);

        $db =& Database::singleton(); 
        $db->run($stmt); 
    }
}

function insert_CNV(&$values)
{
    if (!empty($values) && is_array($values)) {

        $stmt = 'INSERT IGNORE INTO CNV (CandID, Description, Type, EventName, Common_CNV, Characteristics, CopyNumChange, Inheritance, ArrayReport, PlatformID, GenomeLocID) VALUES ';
        $stmt .= join(',', $values);

        $db =& Database::singleton();
        $db->run($stmt);
    }
}

function getListCandID()
{
    $db =& Database::singleton();
    return array_map( function($row) {
        return $row['CandID'];
    }, $db->pselect("SELECT CandID FROM candidate where Active = 'Y' AND Entity_type = 'Human'", array()));
}
?>
