<?php
namespace LORIS\tools;

require_once __DIR__ . "/../vendor/autoload.php";

use \LORIS\Http\Client;
use \LORIS\Http\StringStream;
use \Zend\Diactoros\Request;
use \Zend\Diactoros\Uri;

class CurlTest
{
    public function test()
    {
        $client = new Client();
        $uri     = new Uri('https://demo.loris.ca/api/v0.0.2/login');
        $request = (new Request())
            ->withMethod('POST')
            ->withRequestTarget($uri)
            ->withHeader('Content-Type', 'application/json')
            ->withHeader('Accept', 'application/json, text/html;q=0.9')
            ->withBody(new StringStream('{"username": "demo", "password": "demo"}'));

        $response = $client->send($request);
        print $response->getStatusCode();
        print $response->getBody();
    }
}

$test = new CurlTest();
$test->test();
