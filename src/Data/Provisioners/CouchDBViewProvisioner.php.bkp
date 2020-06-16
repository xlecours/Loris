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

    private $_config;
    private $_view;
    private $_params;

    /**
     * Constructor
     *
     */
    public function __construct(string $view, array $params)
    {
        $this->_config = \NDB_Factory::singleton()->config()->getSetting('CouchDB');
        $this->_view   = $view;
        $this->_params = $params;
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
        $handler = new \SocketWrapper();
        $handler->setHost($this->_config['hostname']);
        $handler->setPort(intval($this->_config['port']));
        $handler->open();

        $url = 'GET /' . $this->_config['dbName'] . '/_design/DQG-2.0/_view/sessions?' . http_build_query(["reduce" => "true", "group"  => "true"]);

        $handler->write($url . " HTTP/1.0\r\n");
        $handler->write(
            "Authorization: Basic "
            . base64_encode(
                $this->_config['admin'] . ":" . $this->_config['adminpass']
            )
            . "\r\n"
        );
        $handler->write("\r\n");

        $headers = '';
        do {
            $curLine = $handler->gets();
            $headers .= $curLine;
        } while($curLine !== "\r\n");

        if (!preg_match("/^HTTP\/1.0 200 OK/", $headers)) {
            error_log($headers);
            $content = '';
            do {
                $content .= $handler->gets();
            } while(!$handler->eof());
            throw new \RuntimeException($content);
        }
        
        do {
            $curLine = $handler->gets();
            print(rtrim(trim($curLine), ','));
            $obj = json_decode(rtrim(trim($curLine), ','));
            var_dump($obj);
        } while(!$handler->eof());

        $handler->close();
        return new \ArrayIterator([]);
    }
}
