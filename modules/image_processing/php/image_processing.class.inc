<?php
namespace LORIS\image_processing;

use \Psr\Http\Server\RequestHandlerInterface;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

class Image_Processing extends \NDB_Page
{
    public $skipTemplate = true;

    public function _hasAccess()
    {
        return true;
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        switch($request->getMethod()) {
            case 'HEAD':
            case 'GET':
                $response = $this->handleGET($request);
                break;
            default:
                $response = new \LORIS\Http\Error($request, 405);
        }
        return $response;
    }

    private function handleGET(ServerRequestInterface $request): ResponseInterface
    {
        return (new \Zend\Diactoros\Response())
            ->withBody(new \LORIS\Http\StringStream('1,2,3'));
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

