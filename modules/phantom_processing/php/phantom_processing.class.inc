<?php
/**
 * Endpoint for phantom_processing
 *
 * PHP Version 7
 *
 * @category   Endpoint
 * @package    Imaging
 * @subpackage Processing
 * @author     Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris-Trunk/
 */
namespace LORIS\phantom_processing;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \Psr\Http\Server\RequestHandlerInterface;

/**
 * Endpoint handler for phantom_processing
 *
 * PHP Version 7
 *
 * @category   Endpoint
 * @package    Imaging
 * @subpackage Processing
 * @author     Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris-Trunk/
 */
class Phantom_Processing extends \NDB_Page
{
    public $skipTemplate = true;

    /**
     * Handle the request and delegat it to proper endpoints
     *
     * @param ServerRequestInterface  $request The PSR7 request being processed.
     *
     * @return ResponseInterface the PSR15 response
     */
    public function handle(ServerRequestInterface $request): ResponseInterface {
        return (new \Zend\Diactoros\Response())
            ->withBody(new \LORIS\Http\StringStream(json_encode('Not Implemented')))
            ->withStatus(501);
    }
}

