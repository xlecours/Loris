<?php declare(strict_types=1);
/**
 * PHP Version 7
 *
 * @category   Data
 * @package    Main
 * @subpackage Data
 * @author     Xavier Lecours <xavier.lecours@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */

namespace LORIS\dqt;

use \LORIS\Data\Provisioners\CouchDBViewProvisioner;

/**
 * A CouchDBViewProvisioner is an instance of ProvisionerInstance which
 * queries a couchdb view and returns the result as a Traversable.
 *
 * @category   Data
 * @package    Main
 * @subpackage Data
 * @author     Xavier Lecours <xavier.lecours@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class CouchDBViewDocsProvisioner extends CouchDBViewProvisioner
{
    /**
     * This extract the doc element of each json string and returns a generator
     * that yields those objects.
     *
     * @return \Traversable
     */
    public function getAllInstances() : \Traversable
    {
        $include_docs = $this->_params["include_docs"] ?? '';
        if ($include_docs !== "true") {
            throw new \LorisException(
                "CouchDBViewDocsProvisioner :: missing param include_docs"
            );
        }

        $handler = $this->sendQuery();
        while(!$handler->eof()) {
            $line = $handler->gets() ?: '';
           
            // HTTP error handling
            if (preg_match('/^HTTP\/1.0 [45]/', $line, $matches)) {    
                while(!$handler->eof()) {
                    error_log($line);
                    $line = $handler->gets();
                }
                error_log(print_r(get_object_vars($this),true));
                throw new \Error($line);
            }
            
            if (preg_match('/"doc":({"_id":.*}})}/', $line, $matches)) {
                yield json_decode($matches[1]);
            }
        }
    }
}
