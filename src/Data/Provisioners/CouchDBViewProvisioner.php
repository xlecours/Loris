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
abstract class CouchDBViewProvisioner extends \LORIS\Data\ProvisionerInstance
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

    /**
     * This creates a new instance of the provisioner but with the new params.
     *
     * @return CouchDBViewProvisioner
     */
    public function withParams(array $params): CouchDBViewProvisioner
    {
        $new = clone($this);
        $new->_params = $params;
        return $new;
    }

    /**
     * GetAllInstances must be implemented by the extending class.
     * ProvisionerInstance by executing the query with PDO Fetch class
     * option.
     *
     * @return \Traversable
     */
    abstract public function getAllInstances() : \Traversable;

    /**
     * Send the http request and return the SocketWrapper from which
     * the response can be read.
     *
     * When keys are provided in the params, a POST request will
     * be sent instead of a GET. This allow to send more data because the
     * keys will be sent in the request body.
     *
     * see: https://docs.couchdb.org/en/stable/api/ddoc/views.html
     *
     * @return \SocketWrapper
     */
    protected function sendQuery(): \SocketWrapper
    {
        $method  = 'GET';
        $payload = '';

        $handler = $this->_couchdb->SocketHandler;
        $handler->setHost($this->_config['hostname']);
        $handler->setPort(intval($this->_config['port']));
        $handler->open();

        if (isset($this->_params['keys'])) {
            $payload = json_encode(
                ["keys" => $this->_params['keys']]
            );
            $method = 'POST';

            $this->_params['keys'] = null;
        }

        $url   = "_design/" . $this->_designdoc . "/_view/" . $this->_view
                     . "?" . http_build_query($this->_params);

        $handler->write(
            $this->_couchdb->_constructURL($method, $url) . " HTTP/1.0\r\n"
        );
        $handler->write(
            "Authorization: Basic "
            . base64_encode(
                $this->_config['admin'] . ":" . $this->_config['adminpass']
            )
            . "\r\n"
        );

        $handler->write("Content-Length: " . strlen($payload) . "\r\n");
        $handler->write("Content-type: application/json\r\n");
        $handler->write("\r\n$payload");

        return $handler;
    }
}
