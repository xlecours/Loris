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
        $this->_limit     = $params['limit'] ?? 3;
        $this->_startkey  = $params['startkey'] ?? null;
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
        do {
            $page = $this->_queryView();
            if (empty($page)) {
                return;
            }
            yield from $page;
            $this->_startkey = json_encode(end($page)['key']);
        } while (true);
    }

    private function _queryView(): array
    {
        return $this->_couchdb->queryView(
            $this->_designdoc,
            $this->_view,
            array_merge(
                $this->_params,
                [
                    'limit' => $this->_limit,
                    'skip'  => is_null($this->_startkey) ? 0 : 1,
                    'startkey' => $this->_startkey
                ]
            )
        );
    }
}
