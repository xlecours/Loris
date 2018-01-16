<?php
/**
 *
 * http://zzz.bwh.harvard.edu/plink/data.shtml#plink
 * File comment lines MUST start with ##
 * Column header line MUST start with #
 *
 *  @category Installer
 *  @package  Genomics
 *  @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 *  @link     https://www.github.com/aces/Loris/
 */

namespace LORIS\genomics;

require_once __DIR__ . "/../vendor/autoload.php";

/**
 *  @category Installer
 *  @package  Genomics
 *  @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 *  @link     https://www.github.com/aces/Loris/
 */
class PLINK_Parser
{
    private $comments = array();

    private $headers = array();

    public function __construct($file_path)
    {
        try {
            $this->file = new \SplFileObject($file_path . '.map');

            $this->headers = array_reduce(
                iterator_to_array($this->file),
                function ($carry, $line) {
                    if (preg_match('/^##/',$line) === 1) {
                        $carry[] = $line;
                    }
                    return $carry;
                },
                array()
            );

            $this->file_comments = array_reduce(
                iterator_to_array($this->file),
                function ($carry, $line) {
                    if (preg_match('/^##/',$line) === 1) {
                        $carry[] = $line;
                    }
                    return $carry;
                },
                array()
            );

        } catch (\Exception $e) {
            var_dump($e);
        }
    }

    public function getHeaders()
    {
        return $this->headers;
    }
}

$p = new Plink_Parser('awdad/data/loris/data/genomics/genomic_uploader/KS_BB1_P002_plink');
