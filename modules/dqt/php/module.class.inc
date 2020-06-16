<?php
/**
 * PHP Version 7
 *
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
namespace LORIS\dqt;

/**
 * Class module implements the basic LORIS module functionality
 *
 */
class Module extends \Module
{
    /**
     * {@inheritDoc}
     *
     * @param \User $user The user whose access is being checked.
     *
     * @return bool whether access is granted
     */
    public function hasAccess(\User $user) : bool
    {
        return parent::hasAccess($user) && $user->hasPermission('dataquery_view');
    }

    /**
     * {@inheritDoc}
     *
     * @return string The menu category for this module
     */
    public function getMenuCategory() : string
    {
        return "Reports";
    }

    /**
     * {@inheritDoc}
     *
     * @return string The human readable name for this module
     */
    public function getLongName() : string
    {
        return "Data Query Tool 2";
    }
}
