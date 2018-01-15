<?php
/**
 * Wrapper around CouchDB MRI functions
 *
 *  @category Installer
 *  @package  Genomics
 *  @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 *  @link     https://www.github.com/aces/Loris/
 */

namespace LORIS\install;

require_once __DIR__ . "/../vendor/autoload.php";

/**
 * Wrapper around CouchDB MRI functions
 *
 *  @category Installer
 *  @package  Genomics
 *  @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 *  @link     https://www.github.com/aces/Loris/
 */
class GenomicInstaller
{ 

    public function __construct()
    {
        $factory = new \NDB_Factory(CONFIG_FILE_PATH);
        $this->couchDB = $factory->couchDB(GENOMICS_DB_NAME);
    }

    public function run()
    {
        $fp     = fopen(DESING_DOC_PATH, 'r');
        $doc    = fread($fp,filesize(DESING_DOC_PATH));
        $result = json_decode(
            $this->couchDB->putDoc(
                '_design/genomic_browser',
                json_decode($doc)
            )
        );
    }
}

const CONFIG_FILE_PATH = __DIR__ . '../project/config.xml';
const DESING_DOC_PATH  = __DIR__ . '/../docs/design_documents/genomics.js';
const GENOMICS_DB_NAME = 'genomics';

$i = new GenomicInstaller();
$i->run();

