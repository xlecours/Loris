<?php
namespace LORIS\CouchDB\genomics;

require_once __DIR__ . "/../vendor/autoload.php";

class CouchDB_TPlink_import 
{
    function __construct($filesetID)
    {
        $factory = new \NDB_Factory(__DIR__ . '../project/config.xml');
        $this->mysql = $factory->database();
        $this->couch = $factory->couchDB('genomics');

        $query = $this->mysql->prepare(
            "SELECT FileName FROM genomic_files LEFT JOIN fileset_role USING (fileset_role_id) WHERE fileset_id = :v_fileset_id AND fileset_role.name = :v_fileset_role"
        );

        // Datavalue file
        $datavalue_record = $this->mysql->execute(
            $query,
            array(
                'v_fileset_id'   => $filesetID,
                'v_fileset_role' => 'data-value'
            )
        );

        if (count($datavalue_record) !==1 ) {
            throw new \Exception('There should be one and only one data-value file');
        }
        $this->datavalue_file = new \SPLFileInfo($datavalue_record[0]['FileName']);
        if (!$this->datavalue_file->isReadable()) {
            throw new \Exception('Datavalue file is not readable');
        }

        // Mapping File
        $mapping_record = $this->mysql->execute(
            $query,
            array(
                'v_fileset_id'   => $filesetID,
                'v_fileset_role' => 'sample-mapping'
            )
        );

        if (count($mapping_record) !==1 ) {
            throw new \Exception('There should be one and only one mapping file');
        }
        $this->mapping_file = new \SPLFileInfo($mapping_record[0]['FileName']);
        if (!$this->mapping_file->isReadable()) {
            throw new \Exception('Mapping file is not readable');
        }

        // Annotation File
        $annotation_record = $this->mysql->execute(
            $query,
            array(
                'v_fileset_id'   => $filesetID,
                'v_fileset_role' => 'variable-annotations'
            )
        );

        if (count($annotation_record) !==1 ) {
            throw new \Exception('There should be one and only one annotation file');
        }
        $this->annotation_file = new \SPLFileInfo($annotation_record[0]['FileName']);
        if (!$this->annotation_file->isReadable()) {
            throw new \Exception('Annotation file is not readable');
        }

        // Provenance
        $provenance_record = $this->mysql->execute(
            $query,
            array(
                'v_fileset_id'   => $filesetID,
                'v_fileset_role' => 'provenance'
            )
        );

        if (!empty($provenance_record)) {
            $this->provenance_files = array_map(function ($rec) {
                $fileInfo = new \SPLFileInfo($rec['FileName']);
                if (!$fileInfo->isReadable()) {
                    error_log($rec['FileName'] . " not readable");
                    throw new \Exception('Provenance file is not readable');
                }
                return $fileInfo;
            }, $provenance_record);
        }
    }

    public function getDatasetDocument()
    {
        $document = array(
            'mapping_file' => array()
        );
    }
}

$o = new CouchDB_TPlink_import(1);
var_dump($o);
