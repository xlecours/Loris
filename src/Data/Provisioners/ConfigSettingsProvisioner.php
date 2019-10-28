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

namespace LORIS\Data\Provisioners;

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
class ConfigSettingsProvisioner extends DBObjectProvisioner
{
    /**
     * Create a RowProvisioner
     *
     * @param string $configname An optional configuration name
     */
    public function __construct(string $configname = null)
    {
        $pdoclass = '\LORIS\Data\Models\ConfigSettingDTO';
        $config   = $configname ?? '%%';

        parent::__construct(
            '
             SELECT
               cs.Name as name,
               cs.Description as description,
               cs.AllowMultiple as allowmultiple,
               cs.DataType as datatype,
               parent.Name as parent,
               cs.Label as label,
               JSON_ARRAYAGG(c.Value) as vals
             FROM
               ConfigSettings cs 
             LEFT JOIN Config c
               ON (cs.ID = c.ConfigID)
             LEFT JOIN ConfigSettings parent
               ON (parent.ID = cs.Parent)
             WHERE
               cs.Visible = 1 AND
               cs.Parent IS NOT NULL AND
               cs.Name LIKE :v_config
             GROUP BY cs.Name
            ',
            array('v_config' => $config),
            $pdoclass
        );
    }
}
