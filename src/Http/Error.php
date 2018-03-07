<?php
/**
 * This file implements a HTTP Client Error, a simple wrapper which converts
 * a PHP string into a PSR7 StreamInterface compatible with other PSR7
 * interfaces.
 *
 * PHP Version 7
 *
 * @category PSR7
 * @package  Http
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 *
 * @see https://www.php-fig.org/psr/psr-7/
 */
namespace LORIS\Http;
use \Zend\Diactoros\Response;
use \Psr\Http\Message\ServerRequestInterface;

/**
 * A StringStream provides a simple wrapper over a string to convert
 * it to a \Psr\Http\Message\StreamInterface.
 *
 * @category PSR7
 * @package  Http
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Error extends Response
{
    /**
     * Takes the value $val and converts it to a PSR7 StreamInterface.
     *
     * @param string $val The string value to convert to a stream.
     */
    public function __construct(ServerRequestInterface $request, int $status, string $message = '')
    {
        // TODO :: Extract baseurl from request. The '/' might break if the DirectoryRoot is different
        $tpl_data = array(
                     'message' => $message,
                     'baseurl' => '/',
                    );
        $template_file = (string) $status . '.tpl';
        $body          = (new \Smarty_neurodb())
            ->assign($tpl_data)
            ->fetch($template_file);

        parent::__construct(
            (new \LORIS\Http\StringStream($body)),
            $status,
            array()
        );
    }
}
