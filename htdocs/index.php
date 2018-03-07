<?php
/**
 * This file contains the entry point for a LORIS PSR15-based router.
 * The entrypoint constructs a ServerRequestInterface PSR7 object
 * (currently by using Zend Diactoros), adds generic LORIS middleware,
 * and then delegates to a LORIS BaseRouter.
 *
 * The this entry point then prints the resulting value to the user.
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Loris
 * @author   Loris Team <loris-dev@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
require_once __DIR__ . '/../vendor/autoload.php';

// FIXME: The code in NDB_Client should mostly be replaced by middleware.
$client = new \NDB_Client;
$client->initialize();

$user    = \User::singleton();
$config  = \NDB_Config::singleton();

// Middleware that happens on every request. This doesn't include
// any authentication middleware, because that's done dynamically
// based on the module router, depending on if the module is public.
$middlewarechain = (new \LORIS\Middleware\ContentLength())
    ->withMiddleware(new \LORIS\Middleware\HeadersGenerator())
    ->withMiddleware(new \LORIS\Middleware\PageDecorationMiddleware(
        $user,
        $config
    ))
    ->withMiddleware(new \LORIS\Middleware\ResponseGenerator());

$serverrequest = \Zend\Diactoros\ServerRequestFactory::fromGlobals();

// Now that we've created the ServerRequest, handle it.

$entrypoint = new \LORIS\Router\BaseRouter(
    $user,
    __DIR__ . "/../project/",
    __DIR__ . "/../modules/"
);

// Now handle the request.
$response = $middlewarechain->process($serverrequest, $entrypoint);
print $response->getBody();

