<?php
namespace LORIS\CouchDB\genomics;

require_once __DIR__ . "/../vendor/autoload.php";

class CouchDB_TPlink_Import
{
    private $filesetID;
    private $mysql;
    private $couch;

    private $datavalueFile; // .tped
    private $mappingFile;
    private $annotationFile;
    private $provenanceFiles;

    function __construct($filesetID = null)
    {
        $factory     = new \NDB_Factory(__DIR__ . '../project/config.xml');
        $this->mysql = $factory->database();
        $this->couch = $factory->couchDB('genomics');

        $query = $this->mysql->prepare(
            "
            SELECT
              GenomicFileID,
              FileName
            FROM
              genomic_files
            LEFT JOIN fileset_role
              USING (fileset_role_id)
            WHERE
              fileset_id = :v_fileset_id AND
              fileset_role.name = :v_fileset_role
            "
        );

        // Datavalue file
        $datavalue_record = $this->mysql->execute(
            $query,
            array(
             'v_fileset_id'   => $filesetID,
             'v_fileset_role' => 'data-value',
            )
        );

        if (count($datavalue_record) !==1 ) {
            throw new \Exception('There should be one and only one data-value file');
        }

        $this->datavalueFile = new FileDescriptor(
            $datavalue_record[0]['GenomicFileID'],
            $datavalue_record[0]['FileName']
        );

        // Mapping File
        $mapping_record = $this->mysql->execute(
            $query,
            array(
             'v_fileset_id'   => $filesetID,
             'v_fileset_role' => 'sample-mapping',
            )
        );

        if (count($mapping_record) !==1 ) {
            throw new \Exception('There should be one and only one mapping file');
        }

        $this->mappingFile = new FileDescriptor(
            $mapping_record[0]['GenomicFileID'],
            $mapping_record[0]['FileName']
        );

        // Annotation File
        $annotation_record = $this->mysql->execute(
            $query,
            array(
             'v_fileset_id'   => $filesetID,
             'v_fileset_role' => 'variable-annotations',
            )
        );

        if (count($annotation_record) !==1 ) {
            throw new \Exception('There should be one and only one annotation file');
        }

        $this->annotationFile = new FileDescriptor(
            $annotation_record[0]['GenomicFileID'],
            $annotation_record[0]['FileName']
        );

        // Provenance
        $provenance_record = $this->mysql->execute(
            $query,
            array(
             'v_fileset_id'   => $filesetID,
             'v_fileset_role' => 'provenance',
            )
        );

        if (!empty($provenance_record)) {
            $this->provenanceFiles = array_map(
                function ($rec) {
                    return new FileDescriptor(
                        $rec['GenomicFileID'],
                        $rec['FileName']
                    );
                },
                $provenance_record
            );
        }

        $this->filesetID = $filesetID;
    }

    private function getDatasetDocument()
    {
        $document = array(
                     'meta'                 => array(
                                                'doctype'         => 'dataset',
                                                'file_format'     => 'datamatrix',
                                                'variable_type'   => 'SNP',
                                                'variable_format' => 'string',
                                                'variable_count'  => $this->datavalueFile->getLineCount(),
                                               ),
                     'loris_fileset'        => array(
                                                'fileset_id'       => $this->filesetID,
                                                'datavalue_file'   => $this->datavalueFile->toArray(),
                                                'annotation_file'  => $this->annotationFile->toArray(),
                                                'mapping_file'     => $this->mappingFile->toArray(),
                                                'provenance_files' => array_map(
                                                    function (FileDescriptor $fd) {
                                                        return $fd->toArray();
                                                    },
                                                    $this->provenanceFiles
                                                ),
                                               ),
                     'sample_pscid_mapping' => (new MappingFile($this->mappingFile))->getMapping(),
                    );
        return $document;
    }

    public function run()
    {
        $dataset = $this->getDatasetDocument();
        return $dataset;
    }
}

class FileDescriptor
{
    private $lorisGenomicFilesID;
    private $fileInfo;
    private $sha1;

    public function __construct($fileID, $fileName)
    {
        $this->lorisGenomicFilesID = $fileID;
        $this->fileInfo            = new \SPLFileInfo($fileName);

        if (!$this->fileInfo->isReadable()) {
            throw new \Exception('File is not readable');
        }
    }

    public function getFileID() : string
    {
        return $this->lorisGenomicFilesID;
    }

    public function getRealPath() : string
    {
        return $this->fileInfo->getRealPath();
    }

    public function getSha1() : string
    {
        if (!isset($this->sha1)) {
            $this->sha1 = sha1_file($this->fileInfo->getRealPath());
        }
        return $this->sha1;
    }

    public function getLineCount()
    {
        $file = $this->fileInfo->openFile('r');
        $file->seek(PHP_INT_MAX);
        return $file->key() + 1;
    }

    public function toArray() : array
    {
        return array(
                'loris_genomic_files_id' => $this->getFileID(),
                'real_path'              => $this->getRealPath(),
                'sha1'                   => $this->getSha1(),
               );
    }

    public function openFile(string $mode = "r") : \SPLFileObject
    {
        return $this->fileInfo->openFile($mode);
    }
}

class MappingFile
{
    private $descriptor;

    public function __construct(FileDescriptor $fd)
    {
        $this->descriptor = $fd;
    }

    public function getMapping() : array
    {
        $file = $this->descriptor->openFile('r');
        return array_reduce(
            iterator_to_array($file),
            function ($carry, $line) {
                // Skip empty lines
                if (strlen($line) === 0) {
                    return $carry;
                }

                // Extract sample_mapping and pscid
                $matches = preg_split('/,/', $line, null, PREG_SPLIT_NO_EMPTY);
                if (count($matches) !== 2) {
                    throw new LorisException("Can't parse line");
                }
                $sample_label = trim($matches[0]);
                $pscid        = trim($matches[1]);

                if (isset($carry[$sample_label])) {
                    throw new \LorisException("There is a duplicate sample_label for: $sample_label");
                }

                $carry[$sample_label] = $pscid;
                return $carry;
            },
            array()
        );
    }
}
$o = new CouchDB_TPlink_Import(1);
var_dump($o->run());
