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
 * @category   Data
 * @package    Main
 * @subpackage Data
 * @author     Xavier Lecours <xavier.lecours@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
abstract class DQTRowProvisioner extends \LORIS\Data\ProvisionerInstance
{
    private $_query;
    private $_classname;

    /**
     * Constructor
     *
     * @param string $query     The SQL query to prepare and run
     * @param array  $params    The prepared statement bind parameters
     * @param string $classname The class name of the returned objects
     */
    public function __construct(\DQTSavedQuery $query, string $classname)
    {
        $this->_query = $query;
        if (!class_exists($classname)) {
            throw new \NotFound($classname . ' not found.');
        }
        $this->_classname = $classname;
    }

    /**
     * GetAllInstances implements the abstract method from
     * ProvisionerInstance by executing the query and returning
     * a Traversable of rows (arrays.)
     *
     * @return \Traversable
     */
    public function getAllInstances() : \Traversable
    {
        $DQT        = (\NDB_Factory::singleton())->database();
        $conditions = $this->_query->getConditions();
        return $stmt;
    }
}
