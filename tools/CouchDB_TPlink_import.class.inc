<?php
namespace LORIS\CouchDB\genomics;

require_once __DIR__ . "/../vendor/autoload.php";

class CouchDB_TPlink_Import
{
    private $filesetID;
    private $couchFilesetDocID;

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
        $this->couch = $factory->couchDB('genomics_test');

        $this->couchFilesetDocID = $this->mysql->pselectOne(
            "SELECT couchdb_doc_id FROM fileset WHERE fileset_id = :v_fileset_id",
            array('v_fileset_id' => $filesetID)
        );

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
                                                'variable_type'   => 'SNP',
                                                'variable_format' => 'alleles',
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

    public function importDatasetDocument()
    {
        if (empty($this->couchFilesetDocID)) {
            $doc_id = $this->couch->createDoc(
                $this->getDatasetDocument()
            );
            $this->mysql->update(
                'fileset',
                array('couchdb_doc_id' => $doc_id),
                array('fileset_id' => $this->filesetID)
            );
        } else {
            $this->couch->replaceDoc(
                $this->couchFilesetDocID,
                $this->getDatasetDocument()
            );
        }
    }

    public function importValues()
    {
        $valueFile = new TransposedPED($this->datavalueFile);
        $annotationFile = new AxiomBioBank1Annotations($this->annotationFile);

        $docs_count = 0;
        $this->couch->beginBulkTransaction();
        while(!$valueFile->eof()) {
            $variable = $valueFile->getNextVariable();
            if (!empty($variable)) {
                $variable['meta']['identifier']['fileset_id'] = $this->filesetID;

                $var_name = $variable['meta']['identifier']['variable_name'];
                $doc_id = $this->filesetID . '-' . $var_name;
                $variable['_id'] = $doc_id;

                $annotations = $annotationFile->getAnnotations($var_name);
                $variable['properties'] = $annotations;
 
                $this->couch->replaceDoc($doc_id, $variable);
                $docs_count++;

if ($docs_count > 20) {
$this->couch->commitBulkTransaction();
exit;
}
                if ($docs_count % 500 === 0) {
                    $this->couch->commitBulkTransaction();
                    $this->couch->beginBulkTransaction();
                }
            }
        }
        $this->couch->commitBulkTransaction();
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

interface DatavalueFile
{
    public function eof(): bool;
    public function getNextVariable(): array; // This should return a DataVariable implementation class
}

class TransposedPED implements DatavalueFile
{
    // DatavalueFile
    private $descriptor;
    private $file;

    public function __construct(FileDescriptor $fd)
    {
        $this->descriptor = $fd;
        $this->file = $fd->openFile("r");
    }

    public function eof(): bool
    {
        return $this->file->eof();
    }

    public function getNextVariable(): array
    {
        $line = $this->file->current();
        $this->file->next();

        if (strlen($line) === 0) {
            return null;
        }

        list($chr, $name, $dist, $location, $vals) = preg_split('/ /', $line, 5);
        $tuples = preg_split('/([\w-]+ [\w-]+) /', $vals, null, PREG_SPLIT_NO_EMPTY | PREG_SPLIT_DELIM_CAPTURE);
        $alleles = array_map(function($e) {
            return trim($e);
        }, $tuples);

        $variable = array(
            'meta' => array(
                'doctype' => 'variable',
                'identifier' => array(
                    'variable_name' => $name,
                    'chromosome'    => $this->getChrFromCode($chr),
                    'start_loc'     => $location
                )
            ),
            'values' => $alleles
        );
        return $variable;
    }

    private function getChrFromCode($code)
    {
        $mapping = array(
            '0' => 'Unk',
            '1' => 'chr1',
            '2' => 'chr2',
            '3' => 'chr3',
            '4' => 'chr4',
            '5' => 'chr5',
            '6' => 'chr6',
            '7' => 'chr7',
            '8' => 'chr8',
            '9' => 'chr9',
            '10' => 'chr10',
            '11' => 'chr11',
            '12' => 'chr12',
            '13' => 'chr13',
            '14' => 'chr14',
            '15' => 'chr15',
            '16' => 'chr16',
            '17' => 'chr17',
            '18' => 'chr18',
            '19' => 'chr19',
            '20' => 'chr20',
            '21' => 'chr21',
            '22' => 'chr22',
            '23' => 'chrX',
            '24' => 'chrY',
            '25' => 'chrXY',
            '26' => 'MT-dna'
        );

        return $mapping[$code];
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

/**
 * Abstraction of a file that contain annotation for omics variable
 */ 
interface AnnotationFile
{
    /**
     * Getter for annotations of a given variable name
     *
     * @param $variableName string
     *
     * @return An array of the form ['property name' => value, ... ] 
     */
    public function getAnnotations(string $variableName): array;
}

/**
 * A specialized case of annotation file for Affymetrix Axiom BioBank1 chip
 * @see Axiom_BioBank1.na35.annot.csv.zip
 */
class AxiomBioBank1Annotations implements AnnotationFile
{
    // Reference to a SPLFileInfo for that file
    private $descriptor;

    /**
     * List of annotations (properties)
     */
    private $headers;

    /**
     * Mapping of the form  ["variable name" => "row number"]
     * This will be used to seek into the file
     */
    private $mapping;

    public function __construct(FileDescriptor $fd)
    {   
        $this->descriptor = $fd;
    }

    public function getAnnotations(string $name): array
    {
        $headers = $this->getHeaders();

        $file = $this->descriptor->openFile('r');
        $file->seek($this->getAnnotationRow($name));

        
        return array_combine($headers, $file->fgetcsv());
    }

    /**
     * Generate the property list for the variables
     *
     * @return array The list of properties
     */
    private function getHeaders(): array
    {
        // Lazy initialization
        if (empty($this->headers)) {
            // Read and split the first line of the file
            $file = $this->descriptor->openFile('r');
            $this->headers = $file->fgetcsv(',');
        }
        return $this->headers;
    }

    /**
     * Use the mapping to get the row number of a given variable name
     * Create the mapping if it doesn't exists already
     *
     * @param string $name The variable name
     *
     * @return int The Row number for that variable
     */
    private function getAnnotationRow($name)
    {
        // Lazy initialization
        if (empty($this->mapping)) {
            $file = $this->descriptor->openFile('r');
        
            // Read each line to create a array of the form 
            // ["variable name" => "row number", ...]
            while (!$file->eof()) {
                $line = $file->current();
                if (strlen($line) > 0) {
                    list($name, $rest) = preg_split('/,/', $file->current(), 2);
                    $this->mapping[$name] = $file->key() - 1;
                }
                $file->next();
            }
        }
        return $this->mapping[$name];
    }
}

$o = new CouchDB_TPlink_Import(1);
$o->importDatasetDocument();
$o->importValues();
