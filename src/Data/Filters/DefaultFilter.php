<?php
/**
 * PHP Version 7
 *
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
namespace LORIS\Data\Filters;

/**
 * this fitlers nothing because it always return true. It is usefull for 
 * provisioner that except at least one filter.
 * 
 * @category   Data
 * @package    Main
 * @subpackage Data
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class DefaultFilter 
{
    /**
     * Implements the \LORIS\Data\Filter interface
     *
     * @param \User                    $user     The user that the data is being
     *                                           filtered for.
     * @param \LORIS\Data\DataInstance $resource The data being filtered.
     *
     * @return bool true if the user has a site in common with the data
     */
    #public function filter(\User $user, \Loris\Data\DataInstance $resource) : bool
    public function filter($item) : bool
    {
        return true;
    }
}
