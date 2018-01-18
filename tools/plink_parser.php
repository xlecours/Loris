<?php
/**
 *
 * http://zzz.bwh.harvard.edu/plink/data.shtml#plink
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
    private $tpedParser;

    public function __construct($filesPath)
    {
        // Make sure the file can be opened
        try {
            $tpedInfo = new \SplFileInfo($filesPath . '.tped');
        } catch (\Exception $e) {
            print($e->getMessage());
        }

        $this->tpedParser = new PLINK_TPED_Parser($tpedInfo);
    }

    public function getDescriptor() {
       return array(
          "LROIS PLINK_Parser",
          (new \DateTime())->format('c')
       );
    }

    public function asDataMatrix(\SplFileObject $file)
    {
        $tmpFile = new \SplTempFileObject(500000000);
        
        While (!$this->tpedParser->eof()) {
            $snp = $this->tpedParser->next();   
            if ( $snp !== false ) {
                $tmpFile->fwrite($snp->rsID . ",");
                $tmpFile->fwrite(implode(",",$snp->genotypes).PHP_EOL);
            }
        }

        $tmpFile->rewind();
        $file->fwrite($tmpFile->fread($tmpFile->fstat()['size']));
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

$p = new PLINK_Parser('/data/loris/data/genomics/genomic_uploader/plink');
var_dump($p->getDescriptor());
$p->asDataMatrix(new \SplFileObject('/data/loris/data/genomics/genomic_uploader/output.txt', 'w'));
