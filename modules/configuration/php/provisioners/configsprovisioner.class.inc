<?php declare(strict_types=1);
/**
 * PHP version 7
 *
 * @category Administration
 * @package  Main
 * @author   Xavier Lecours <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */

namespace LORIS\configuration\Provisioners;
use LORIS\configuration\Models\ConfigRow;

/**
 * Configuration object provisioner
 *
 * PHP version 7
 *
 * @category Administration
 * @package  Main
 * @author   Xavier Lecours <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */
class ConfigsProvisioner extends \LORIS\Data\Provisioners\DBObjectProvisioner
{
    /**
     * Create a RowProvisioner
     *
     * @param string $configname An optional configuration name
     */
    public function __construct(string $configname = null)
    {
        $pdoclass = '\LORIS\configuration\Models\Config';
        $config   = $configname ?? '%%';

        parent::__construct(
            '
             SELECT
               cs.Name as name,
               cs.Description as description,
               cs.AllowMultiple as allowmultiple,
               cs.DataType as datatype,
               cs.Parent as parent,
               cs.Label as label,
               GROUP_CONCAT(c.Value SEPARATOR \'|\') as vals
             FROM
               Config c 
             LEFT JOIN ConfigSettings cs
               ON (cs.ID = c.ConfigID)
             WHERE
               cs.Visible = 1 AND
               cs.Name LIKE :v_config
             GROUP BY cs.Name
            ',
            array('v_config' => $config),
            $pdoclass
        );
    }
}
