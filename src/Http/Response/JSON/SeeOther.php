<?php declare(strict_types=1);
/**
 * File contains the PSR7 ResponseInterface implementation for
 * See Other responses.
 *
 * PHP Version 7
 *
 * @category PSR15
 * @package  Http
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 *
 * @see https://www.php-fig.org/psr/psr-7/
 * @see https://www.php-fig.org/psr/psr-15/
 */
namespace LORIS\Http\Response\JSON;

use \LORIS\Http\Response\JsonResponse;

/**
 * A LORIS Http Response is an implementation of the PSR15 ResponseInterface
 * to use in LORIS specifically for the 303 See Other response.
 *
 * @category PSR15
 * @package  Http
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class SeeOther extends JsonResponse
{
    /**
     * Create a Json response specific to 303 See Other
     *
     * @param array $body Data to convert to JSON.
     * @param array $headers Array of headers to use at initialization.
     *
     * @return void
     */
    public function __construct(array $body = [], array $headers = [])
    {
        if (!isset($headers['Location'])) {
            throw new \LorisException(
                'See Other responses must return a Location header.'
            );
        }

        parent::__construct($body, 303, $headers);
    }
}
