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

namespace LORIS\Data\Provisioners;

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
class CouchDBViewProvisioner extends \LORIS\Data\ProvisionerInstance
{
    /**
     * Constructor
     *
     */
    public function __construct(string $designdoc, string $view, array $params)
    {
        $factory = \NDB_Factory::singleton();
        $config  = $factory->config()->getSetting('CouchDB');
        $this->_config = $config;

        $this->_couchdb   = $factory->couchdb(
            $config['dbName'],
            $config['hostname'],
            intval($config['port']),
            $config['admin'],
            $config['adminpass']
        );
        $this->_designdoc = $designdoc;
        $this->_view      = $view;
        $this->_params    = $params;
    }

    public function withParams(array $params): CouchDBViewProvisioner
    {
        $new = clone($this);
        $new->_params = $params;
        return $new;
    }

    /**
     * GetAllInstances implements the abstract method from
     * ProvisionerInstance by executing the query with PDO Fetch class
     * option.
     *
     * @return \Traversable
     */
    public function getAllInstances() : \Traversable
    {
        $handler = $this->_queryView();
        while(!$handler->eof()) {
            $line = $handler->gets() ?: '';
            if (preg_match('/^HTTP\/1.0 [45]/', $line, $matches)) {    
                while(!$handler->eof()) {
                    error_log($line);
                    $line = $handler->gets();
                }
                error_log(print_r(get_object_vars($this),true));
                throw new \Error($line);
            }
            
            if (preg_match('/^(\{.*}),*/', $line, $matches)) {
                yield json_decode($matches[1]);
            }
        }
    }

    private function _queryView(): \SocketWrapper
    {
        $http_method = 'GET';
        $body = null;
        if (isset($this->_params['keys'])) {
            $http_method = 'POST';
            $body = json_encode([
                "keys" => $this->_params['keys']
            ]);
            $this->_params['keys'] = null;
        }
        $url   = "_design/" . $this->_designdoc . "/_view/" . $this->_view
                     . "?" . http_build_query($this->_params);

        $handler = $this->_couchdb->SocketHandler;
        $handler->setHost($this->_config['hostname']);
        $handler->setPort(intval($this->_config['port']));

        $handler->open();
        $handler->write($this->_couchdb->_constructURL($http_method, $url) . " HTTP/1.0\r\n");
        $handler->write(
            "Authorization: Basic "
            . base64_encode(
                $this->_config['admin'] . ":" . $this->_config['adminpass']
            )
            . "\r\n"
        );

        if ($http_method == 'POST') {
            $handler->write("Content-Length: " . strlen($body) . "\r\n");
            $handler->write("Content-type: application/json\r\n");
        }

        $handler->write("\r\n$body");

        return $handler;
    }
}
