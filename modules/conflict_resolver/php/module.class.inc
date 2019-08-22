<?php
/**
 * This serves as a hint to LORIS that this module is a real module.
 * It does nothing but implement the module class in the module's namespace.
 *
 * PHP Version 5
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Conflict_Resolver
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris-Trunk/
 */
namespace LORIS\conflict_resolver;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * Class module implements the basic LORIS module functionality
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Conflict_Resolver
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris-Trunk/
 */
class Module extends \Module
{
    /**
     * Return true if the given user should have access to this module.
     *
     * By default, this will assume that anonymous users do not have access
     * to non-public modules, but otherwise everyone has access to anything.
     *
     * @param \User $user The user to check access for.
     *
     * @return bool True if the user has access
     */
    public function hasAccess(\User $user): bool
    {
        return $user->hasPermission('conflict_resolver');
    }

    /**
     * This overide is to make sure that conflict_resolver request sent to
     * subpages (conflicts and resolved) do not try to load the as HTML Pages.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        switch($request->getURI()->getPath()) {
        case '/conflicts':
            return (new Conflicts())->handle($request);

        case '/resolved':
            return (new Resolved())->handle($request);

        default:
            return parent::handle($request);
        }
    }
}
