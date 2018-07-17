<?php
namespace LORIS\image_processing;

use \Psr\Http\Server\RequestHandlerInterface;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

class Image_Processing extends \NDB_Page
{
    public $skipTemplate = true;

    public function _process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        return parent::process($request, $handler);
    }

    public function _handle(ServerRequestInterface $request): ResponseInterface
    {
        return prent::handle($request);
    }

    public function getJSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            array(
             $baseURL . "/image_processing/js/index.js",
            )
        );
    }
}

