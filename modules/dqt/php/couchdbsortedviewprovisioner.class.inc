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
 * A CouchDBSortedViewProvisioner is an instance of ProvisionerInstance which
 * queries a couchdb view and returns sorted results as a Traversable.
 *
 * It can be memory consuming since the results need to be copied in memory to
 * be sorted. 
 *
 * @category   Data
 * @package    Main
 * @subpackage Data
 * @author     Xavier Lecours <xavier.lecours@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class CouchDBSortedViewProvisioner extends \LORIS\Data\Provisioners\CouchDBListViewProvisioner
{
}
