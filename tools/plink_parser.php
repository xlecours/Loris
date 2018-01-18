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
    private $mapParser;
    private $pedParser;

    public function __construct($filesPath)
    {
        // Make sure the file can be opened
        try {
            $mapFile = new \SplFileObject($filesPath . '.map');
            $pedFile = new \SplFileObject($filesPath . '.ped');
        } catch (\Exception $e) {
            print($e->getMessage());
        }

        $this->mapParser = new PLINK_MAP_Parser($mapFile);
        $this->pedParser = new PLINK_PED_Parser($pedFile);
    }

    public function asDataMatrix()
    {
        $tmpFile = new \SplTempFileObject();

        for ($i=0; !$this->mapParser->eof(); $i++) {
            $line = $this->mapParser->getNextDataLine();
var_dump($line);
            $tmpFile->fwrite($line[1]);
var_dump($this->pedParser->getColumnData(1));
            $tmpFile->fwrite("A\n");
$tmpFile->rewind();
$tmpFile->fpassthru();
        }
    }
}

/**
 *  @category Parser
 *  @package  Genomics
 *  @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 *  @link     https://www.github.com/aces/Loris/
 */
class PLINK_PED_Parser
{
    private $file;

    private $comments = array();

    private $headers = array(
        'Family ID',
        'Individual ID',
        'Paternal ID',
        'Maternal ID',
        'Sex', # (1=male; 2=female; other=unknown)
        'Phenotype'
    );

    public function __construct(\SplFileObject $file)
    {
        $this->file = $file;

        // Extract headers and comments from the file
        $nonDataLine = array_filter(
            iterator_to_array($this->file),
            function ($line) {
                return preg_match('/^#/',$line);
            }
        );
        $this->file->rewind();

        $headersLine = array_filter(
            $nonDataLine,
            function ($line) {
                return (preg_match('/^#[^#]/',$line) === 1);
            }
        );

        if (!empty($headersLine)) {
            if (count($headersLine) > 1) {
                throw new \FileFormatException("More than one header line");
            }
            $this->headers = explode("\t", ltrim(array_shift($headersLine),'#'));
        }
        $commentLines = array_filter(
            $nonDataLine,
            function ($line) {
                return (preg_match('/^##/',$line) === 1);
            }
        );
        $this->comments = $commentLines;
    }
    public function getHeaders()
    {
        return $this->headers;
    }

    public function getComments()
    {
        return $this->comments;
    }

    public function getColumnData($column_index = 0)
    {
        return array_map(
            function ($line) use ($column_index) {
                $value = explode("\t",$line)[$column_index];
                return $value;
            }, 
            array_filter(
                iterator_to_array($this->file),
                function ($line) { 
                    return (preg_match('/^#/',$line) !== 1);
                }
            )
        );
    }
}
/**
 *  @category Parser
 *  @package  Genomics
 *  @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 *  @link     https://www.github.com/aces/Loris/
 */
class PLINK_MAP_Parser
{
    private $file;

    private $comments = array();

    private $headers = array(
        'chromosome',
        'rs#',
        'distance',
        'position'
    );

    public function __construct(\SplFileObject $file)
    {
        $this->file = $file;

        // Extract headers and comments from the file
        $nonDataLine = array_filter(
            iterator_to_array($this->file),
            function ($line) {
                return preg_match('/^#/',$line);
            }
        );
        $this->file->rewind();

        // Set controls and flags
        $delim = "\t";
        $enclosure = '"';
        $escape    = "\\";
        $this->file->setCsvControl($delim, $enclosure, $escape);

        $headersLine = array_filter(
            $nonDataLine,
            function ($line) {
                return (preg_match('/^#[^#]/',$line) === 1);
            }
        );

        if (!empty($headersLine)) {
            if (count($headersLine) > 1) {
                throw new \FileFormatException("More than one header line");
            }
            $this->headers = explode($delim, ltrim(array_shift($headersLine),'#'));
        }

        $commentLines = array_filter(
            $nonDataLine,
            function ($line) {
                return (preg_match('/^##/',$line) === 1);
            }
        );
        $this->comments = $commentLines;

    }

    public function getHeaders()
    {
        return $this->headers;
    }

    public function getComments()
    {
        return $this->comments;
    }

    public function getNextDataLine()
    {
        do {
            $line = $this->file->fgetcsv();
        } while (preg_match('/^#/',$line[0]) === 1 && !$this->file->eof());
        return $line;
    }

    public function eof()
    {
        return $this->file->eof();
    }
}

$p = new PLINK_Parser('/data/loris/data/genomics/genomic_uploader/KS_BB1_P002_plink');
$p->asDataMatrix();
