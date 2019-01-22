<?php declare(strict_types=1);

use \Psr\Http\Server\RequestHandlerInterface;
use \Psr\Http\Message\ResponseInterface;
use \Psr\Http\Message\ServerRequestInterface;
use \LORIS\Middleware\ETagCalculator;

class MockETagHandler implements RequestHandlerInterface, ETagCalculator
{
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        return new \LORIS\Http\Response();
    }

    public function ETag(ServerRequestInterface $request) : string
    {
        return '';
    }
}
