<?php

require_once __DIR__ . "/../vendor/autoload.php";
require_once 'generic_includes.php';
require_once 'CouchDB.class.inc';
require_once 'Database.class.inc';
require_once 'Utility.class.inc';
class CouchDBMethylation450kImporter
{
    var $SQLDB; // reference to the database handler, store here instead
                // of using Database::singleton in case it's a mock.
    var $CouchDB; // reference to the CouchDB database handler

    function __construct()
    {
        $this->SQLDB   = Database::singleton();
        $this->CouchDB = CouchDB::singleton();
        $this->CouchDB->setDatabase('test_epi');
    }

    function createDataset()
    {
        //$this->CouchDB->beginBulkTransaction();

        $genomic_files = $this->SQLDB->pselect("SELECT GenomicFileID, FileName, AnalysisModality FROM genomic_files WHERE FileType IS NOT NULL",array());
        foreach ($genomic_files as $row) {
            // Read the column headers
            $result = array();
            $outputs = array();
            // todo :: This should use the genomic_path config setting
            exec("head -1 ./$row['FileName']", $outputs, $result);
            
        }

        // Read the column headers
        $result = array();
        $outputs = array();
        // todo :: This should use the genomic_path config setting
        exec('head -1 ../modules/genomic_browser/tools/headers', $outputs, $result);
        $pscids = explode(' ', $outputs[0]);
        //Remove the first element (the probe_id column headers)
        array_shift($pscids);

        $outputs = array();
        exec('wc -l ../modules/genomic_browser/tools/probes | cut -f1 -d \' \'', $outputs, $result);
        $data_rows = intval($outputs[0]);

        //Prepare the document definition
        $file_name = "MAVAN.methylation_2";
        $LORIS_file_id = "1723";
        $doc = array(
            'meta' => array(
                'doctype'       => 'dataset',
                'file_format'   => 'matrix',
                'variable_type' => 'snp',
                'variable_format' => 'allele',
                'identifier'    => array(
                    'file_name'     => $file_name,
                    'LORIS_file_id' => $LORIS_file_id
                ),
            ),
            'data' => array(    
                'samples' => $pscids,
                'probe_count' => $data_rows,
            )
        );

        $this->CouchDB->replaceDoc($LORIS_file_id, $doc);
       // $this->CouchDB->commitBulkTransaction();
    }

    function importData()
    {
        // todo :: This should use the genomic_path config setting
        $handle = @fopen("../modules/genomic_browser/tools/betavalue", "r");
        if ($handle) {

            $probe_count = 0;
            $this->CouchDB->beginBulkTransaction();
            $file_name = "MAVAN.methylation_2";
            $LORIS_file_id = "1723";

            while (($line = fgets($handle)) !== false) {
                $beta_values = explode(',', $line);
                $probe_name = array_shift($beta_values);
                $beta_values = array_map( function($v) {return trim($v);}, $beta_values);

                $mysqlQueryString  = "SELECT * FROM genome_loc gl JOIN genomic_cpg_annotation gca ON gl.GenomeLocID = gca.location_id where gca.cpg_name = '$probe_name'";
                $preparedStatement = $this->SQLDB->prepare($mysqlQueryString, array());
                $preparedStatement->execute();

                $row = $preparedStatement->fetch(PDO::FETCH_ASSOC);

                $doc_id = "$LORIS_file_id-$probe_name";
                $doc = array(
                    'meta' => array(
                        'doctype'       => 'betavalue',
                        'identifier'    => array(
                            'data_type' => 'Methylation beta values',
                            'file_name' => $file_name,
                            'LORIS_file_id' => $LORIS_file_id,
                            'probe_name' => $probe_name,
                            'chromosome' => $row['Chromosome'],
                            'location' => $row['StartLoc']
                        ),
                    ),
                    'data' => $beta_values,
                    'annotation' => $row
                );
                $this->CouchDB->putDoc($doc_id, $doc);
                $probe_count++;

                if($probe_count % 200 == 0) {
                    $this->CouchDB->commitBulkTransaction();
                    echo "+200 :: $doc_id\n";
                    $this->CouchDB->beginBulkTransaction();
                }
            }
            $this->CouchDB->commitBulkTransaction();

if ($probe_count >= 2000) {
    fclose($handle);
    return;
}
            if (!feof($handle)) {
                echo "Error: unexpected fgets() fail\n";
            }

            fclose($handle);
        }
    }

    function run()
    {
        $this->createDataset();
        $this->importData();
    }
}

// Don't run if we're doing the unit tests, the unit test will call run..
if (!class_exists('UnitTestCase')) {
    $Runner = new CouchDBMethylation450kImporter();
    $Runner->run();
}
?>
