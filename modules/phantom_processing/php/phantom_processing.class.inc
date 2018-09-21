<?php

/**
 * This class features the code for the menu portion
 * of the Loris phantom processing module
 *
 * PHP Version 7
 *
 * @category   Processing
 * @package    imaging
 * @author     Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris-Trunk/
 */
namespace LORIS\phantom_processing;

/**
 * Provides the PHP code for the menu filter of that module
 *
 * @category   Processing
 * @package    imaging
 * @author     Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris-Trunk/
 */
class Phantom_Processing extends \NDB_Page
{
    public $AjaxModule   = true;
    public $skipTemplate = true;

    public function hasAccess(\User $user): bool
    {
        try {
            return $user->hasPermission('phantom_processing');
        } catch (\ConfigurationException $e) {
            // Most likely missing permission code in the database
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode(array('error' => $e->getMessage()));
            exit; // Because this is skiping template
        }
    }

    public function _hasAccess()
    {
        return $this->hasAccess(\User::singleton());
    }

    function getJSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            array(
             $baseURL . "/phantom_processing/js/index.js",
            )
        );
    }
}
