<?php declare(strict_types=1);
/**
 * File that describe the ConfigSetting class
 *
 * PHP Version 7
 *
 *  @category Imaging
 *  @package  Main
 *  @author   Xavier Lecours <xavier.lecours@mcin.ca>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 *  @link     https://www.github.com/aces/Loris/
 */
namespace LORIS;

use \LORIS\Data\Provisioners\ConfigSettingsProvisioner;
use \LORIS\Data\Models\ConfigSettingDTO;

/**
 * This class defines an ConfigSetting and business logic related to 
 * retreiving and altering Configuration metadata and values.
 *
 *  @category Imaging
 *  @package  Main
 *  @author   Xavier Lecours <xavier.lecours@mcin.ca>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 *  @link     https://www.github.com/aces/Loris/
 */
class ConfigSettings
{
    public function __construct(\Database $db, \User $user)
    {
        $this->_db   = $db;
        $this->_user = $user;
    }

    public function getAllConfigSetting(): array
    {
        $provisioner = new ConfigSettingsProvisioner();

        $config = (new \LORIS\Data\Table())
            ->withDataFrom($provisioner)
            ->getRows($this->_user);

        if (empty($config)) {
            return  new \NotFound('Config not found');
        }

        return iterator_to_array($config);
    }

    public function getConfigSetting(string $configname): ConfigSettingDTO
    {
        $provisioner = new ConfigSettingsProvisioner($configname);

        $configiterator = (new \LORIS\Data\Table())
            ->withDataFrom($provisioner)
            ->getRows($this->_user);

        $config = iterator_to_array($configiterator);
        if (empty($config)) {
            throw new \NotFound('Config not found');
        }

        return array_shift($config);
    }

    public function update(ConfigSettingDTO $dto): void
    {
        $configname = $dto->getName();

        $this->_db->beginTransaction();

        $this->_db->run('
            DELETE FROM Config 
            WHERE
              ConfigID = (
                SELECT ID FROM ConfigSettings
                WHERE Name = \'' . $configname .'\'
              )
        ');

        $dtovals    = $dto->getValue();
        $newvalues  = is_array($dtovals) ? $dtovals : array($dtovals);

        $stmt   = $this->_db->prepare('
            INSERT INTO Config (ConfigID, Value) 
            SELECT ID, :v_newval
            FROM ConfigSettings
            WHERE Name = \'' . $configname . '\'
        ');
        $option = array('nofetch' => true);
        foreach ($newvalues as $val) {
            $params = array(
                'v_newval' => $val
            );
            $this->_db->execute($stmt, $params, $option);
        }

        $this->_db->commit();
        
    }
}
