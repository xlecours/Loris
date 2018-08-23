<?php
/**
 * CBRAIN
 * Stub class.. all this does is check permissions, since everything else is
 * done in the template/javascript
 *
 * PHP Version 7
 *
 * @category Processing
 * @package  CBRAIN
 * @author   Xavier Lecours <xxavier.lecoursboucher@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

namespace LORIS\CBRAIN;
/**
 * CBRAIN
 * Stub class.. all this does is check permissions, since everything else is
 * done in the template/javascript
 *
 * @category Processing
 * @package  CBRAIN
 * @author   Xavier Lecours <xxavier.lecoursboucher@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class CBRAIN extends \NDB_Page
{
    public $skipTemplate = true;

    /**
     * Include additional JS files
     *
     * @return array of JS to be inserted
     */
    function getJSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseurl = $factory->settings()->getBaseURL();
        $depends = parent::getJSDependencies();
        return array_merge(
            $depends,
            array(
             $baseurl . "/cbrain/js/cbrain_client.js",
            )
        );
    }
}
?>
