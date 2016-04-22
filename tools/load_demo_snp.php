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

    $sql = "SELECT 
              name,
              chrom,
              chromStart,
              chromEnd,
              strand,
              refNCBI,
              observed,
              class,
              valid,
              func,
              locType,
              alleles,
              alleleFreqs,
              'dbSNP build 144' as source
            FROM 
              snp144Common
            WHERE 
              chrom = 'chr14' AND
              chromEnd - chromStart = 1 
            LIMIT 200";

    $genome_loc_values    = array();
    $SNP_values           = array();
    $SNP_candidate_values = array();
    $row_count            = 0;

    $candidate_list = getListCandID();
    if (empty($candidate_list)) {
        print "Please, create your candidates first\n";
        exit;
    }

    $plateform_id = create_SNP_platform();

    foreach ($conn->query($sql,  PDO::FETCH_ASSOC) as $row) {
        $chrom  = $row['chrom'];
        $start  = $row['chromStart'];
        $end    = $row['chromEnd'];
        $strand = ($row['strand'] == '+') ? 'Forward' : 'Reverse';

        array_push(
            $genome_loc_values,
            "('$chrom', $start, $end, '$strand')"
        ); 

        $name    = $row['name'];
        $source  = $row['source'];
        $refBase = $row['refNCBI'];

        array_push(
            $SNP_values,
            "('$name', '$source', '$refBase', (SELECT GenomeLocID FROM genome_loc WHERE Chromosome = '$chrom' AND StartLoc = $start AND EndLoc = $end))"
        );

        $alleles            = explode(',', $row['alleles']);
        $allele_frequencies = explode(',', $row['alleleFreqs']);
        $valid_array        = explode(',', $row['valid']);
        $validation_method  = $valid_array[array_rand($valid_array)];
        $validated          = (empty($validation_method)) ? '1' : '0';
        
        foreach ($candidate_list as $CandID) {

            $observed_base = (rand(0,10000)/10000 < $allele_frequencies[0]) ? $alleles[0] : $alleles[1] ;
            $observed_base = ($observed_base == '-') ? $alleles[0] : $observed_base;

            array_push(
                $SNP_candidate_values,
                "((SELECT SNPID FROM SNP WHERE rsID = '$name' LIMIT 1), $CandID, '$observed_base', '$validation_method', $validated, $plateform_id)"
            );
            // Note : The 'LIMIT 1' in the subquery is there because there is rsID is not a unique column. 
        }

        $row_count++;

        if($row_count % 100 == 0) {
            insert_genome_loc($genome_loc_values);
            $genome_loc_values = array();
            insert_SNP($SNP_values);
            $SNP_values = array();
            insert_SNP_candidate_rel($SNP_candidate_values);
            $SNP_candidate_values = array();
        }
    }

    insert_genome_loc($genome_loc_values);
    insert_SNP($SNP_values);
    insert_SNP_candidate_rel($SNP_candidate_values);

    fillGWAS();

    $conn = null;
    exit;

function create_SNP_platform() 
{
    $stmt = "INSERT IGNORE INTO genotyping_platform (Name, Description) VALUES ('Custom SNP array', 'A platform inserted for demo purposes')";

    $db =& Database::singleton();
    $db->run($stmt);

    return $db->pselectOne("SELECT PlatformID FROM genotyping_platform WHERE Name = 'Custom SNP array'", array());
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

function insert_SNP(&$values)
{
    if (!empty($values) && is_array($values)) {

        $stmt = 'INSERT IGNORE INTO SNP (rsID, SNPExternalSource, ReferenceBase, GenomeLocID) VALUES ';
        $stmt .= join(',', $values);

        $db =& Database::singleton();
        $db->run($stmt);
    }
}

function insert_SNP_candidate_rel(&$values)
{
    if (!empty($values) && is_array($values)) {

        $stmt = 'INSERT IGNORE INTO SNP_candidate_rel (SNPID, CandID, ObservedBase, ValidationMethod, Validated, PlatformID) VALUES ';
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

function fillGWAS()
{
    $db =& Database::singleton();

    $stmt = "INSERT INTO GWAS (SNPID, MajorAllele) select s.SNPID, s.ReferenceBase as MajorAllele FROM SNP s";
    $db->run($stmt);
/*
    $stmt = "DELETE FROM GWAS WHERE MinorAllele is NULL";
    $db->run($stmt);

    $stmt = "UPDATE GWAS SET MAF = ROUND(RAND()/2,3)"; 
    $db->run($stmt);
*/
}
?>
