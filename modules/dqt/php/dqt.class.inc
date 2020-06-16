<?php declare(strict_types=1);
/**
 * PHP Version 7
 *
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
namespace LORIS\dqt;

/**
 * Data Querying Module
 */
class DQT extends \NDB_Page
{
    public $skipTemplate = true;

    /**
     * Check user access permission
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    function _hasAccess(\User $user) : bool
    {
        // check user permissions
        return $user->hasPermission('dataquery_view');
    }

    /**
     * Include the column formatter required to display the feedback link colours
     * in the candidate_list menu
     *
     * @return array of javascript to be inserted
     */
    function getJSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            array(
                $baseURL . "/dqt/js/dqtIndex.js",
            )
        );
    }
}
