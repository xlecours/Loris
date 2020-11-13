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

    /**
     * Returns all the items in the rows property of the results.
     *
     * @return \Traversable
     */
    public function getAllInstances() : \Traversable
    {
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

            if (preg_match('/^(\{.*}),*/', $line, $matches)) {
                // This is a data line
                if ($this->_filter($matches[1])) {
                    yield $this->_map($matches[1]);
                }
            }
        }
    }

    public function withParams(array $params): CouchDBViewProvisioner
    {
        $new = clone($this);
        $new->_params = $params;
        return $new;
    }

    public function withFilter($filter): CouchDBViewProvisioner
    {
        // TODO :: rework this to use the filter interface.
        $new = clone($this);
        $new->_filter = $filter;
        return $new;
    }

    public function withMapper($mapper): CouchDBViewProvisioner
    {
        // TODO :: rework this to use the mapper interface.
        $new = clone($this);
        $new->_mapper = $mapper;
        return $new;
    }

    private function _filter($value): bool {
        if (!isset($this->_filter)) {
            return true;
        }
        return $this->_filter->filter($value);
    }

    private function _map(string $value) {
        if (!isset($this->_mapper)) {
            return $value;
        }
        return $this->_mapper->map($value);
    }


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
