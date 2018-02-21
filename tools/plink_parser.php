<?php
/**
 *
 * https://www.cog-genomics.org/plink2
 *
 * File comment lines MUST start with ##
 * Column header line MUST start with #
 *
 * The .map and .ped file must have the ame name but iwhit their respective
 * extentions.
 *
 *  @category Parser
 *  @package  Genomics
 *  @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 *  @link     https://www.github.com/aces/Loris/
 */

namespace LORIS\genomics;

require_once __DIR__ . "/../vendor/autoload.php";

/**
 *  @category Parser
 *  @package  Genomics
 *  @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 *  @link     https://www.github.com/aces/Loris/
 */
class PLINK_Parser
{
    private $tpedInfo;
    private $logInfo;
    private $tfamInfo;

    private $tpedParser;
    private $tfamParser;

    public function __construct($filesPath)
    {
        // Make sure the file can be opened
        $this->tpedInfo = new \SplFileInfo($filesPath . '.tped');
        $this->tfamInfo = new \SplFileInfo($filesPath . '.tfam');
        $this->logInfo  = new \SplFileInfo($filesPath . '.log');

        if (!$this->tpedInfo->isReadable()) {
            throw new \Exception(".tped file is not readable");
        }

        if (!$this->tfamInfo->isReadable()) {
            throw new \Exception(".tfam file is not readable");
        }

        $this->tpedParser = new PLINK_TPED_Parser($this->tpedInfo);
        $this->tfamParser = new PLINK_TFAM_Parser($this->tfamInfo);
    }

    public function asDataMatrix()
    {
        // Comment lines
        $tmpFile = new \SplTempFileObject(500000000);
        $tmpFile->fwrite('### LORIS PLINK_Parser'.PHP_EOL);

        $date = (new \DateTime())->format('c');
        $tmpFile->fwrite("### $date".PHP_EOL);
        $tmpFile->fwrite("###".PHP_EOL);

        if ($this->logInfo->isReadable()) {
            $logContent = preg_replace(
                "/\n/",
                "|",
                $this->logInfo->openFile("r")->fread($this->logInfo->getSize())
            );
            $tmpFile->fwrite("## plink.log,".$logContent.PHP_EOL);
        } 
        
        // Required fields
        $tmpFile->fwrite("variable_type,genotype/phenotype data".PHP_EOL);
        $tmpFile->fwrite("variable_format,string".PHP_EOL);

        $samples = $this->tfamParser->getIndividuals();
        $tmpFile->fwrite('sample_count, '.count($samples).PHP_EOL);

        // headers
        $tmpFile->fwrite('# variable_name,'.implode(',',$samples).PHP_EOL);
        While (!$this->tpedParser->eof()) {
            $snp = $this->tpedParser->next();   
            if ( $snp !== false ) {
                $tmpFile->fwrite($snp->rsID . ",");
                $tmpFile->fwrite(implode(",",$snp->genotypes).PHP_EOL);
            }
        }

        $tmpFile->rewind();
        $tmpFile->fpassthru();
    }
}

/**
 *  @category Parser
 *  @package  Genomics
 *  @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 *  @link     https://www.github.com/aces/Loris/
 */
class PLINK_TPED_Parser
{
    private $fileInfo;
    private $file;

    public function __construct(\SplFileInfo $fileInfo)
    {
        $this->fileInfo = $fileInfo;
        $this->file = $fileInfo->openFile('r');
    }

    public function next()
    {
        do {
            $line = $this->file->fgets();
        } while ( preg_match("/(^#|^$)/",$line) === 1 && !$this->file->eof());

        if (empty($line)) {
            return false;
        }

        list($chr, $rsID, $dist, $loc, $values) = preg_split(
            "/ /",
            $line,
            5
        ); 

        $genotypes  = preg_split(
            "/(\H\h\H\h)/",
            $values,
            -1,
            PREG_SPLIT_NO_EMPTY|PREG_SPLIT_DELIM_CAPTURE
        );
        array_walk($genotypes, function (&$pair) {
            $pair = trim($pair);
        });

        return new SNP($rsID, $genotypes);
    }

    public function eof()
    {
        return $this->file->eof();
    }
}

class SNP 
{
    public function __construct($rsID, $genotypes)
    {
        $this->rsID       = $rsID;
        $this->genotypes  = $genotypes; 
    }
}

/**
 *  @category Parser
 *  @package  Genomics
 *  @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 *  @link     https://www.github.com/aces/Loris/
 */
class PLINK_TFAM_Parser
{
    private $fileInfo;
    private $file;

    private $individuals = array();

    public function __construct(\SplFileInfo $fileInfo)
    {
        $this->fileInfo = $fileInfo;
        $this->file = $fileInfo->openFile('r');
    }

    public function getIndividuals()
    {
        do {
            $line = $this->file->fgets();
            if (preg_match("/(^#|^$)/",$line) !== 1) {
                $chunks = explode(" ", $line);
                $this->individuals[] = $chunks[0]."_".$chunks[1];
            }
        } while (!$this->file->eof());
        $this->file->rewind();

        return $this->individuals;
    }
}
$p = new PLINK_Parser('/data/loris/data/genomics/genomic_uploader/plink');
$p->asDataMatrix();
