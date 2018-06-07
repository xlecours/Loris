<?php
namespace LORIS\Http;

use \Psr\Http\Message\RequestInterface;
use \Psr\Http\Message\ResponseInterface;

class Client
{
    protected $headers = [];

    public function __construct()
    {
        if (!function_exists('curl_version')) {
            throw new \RuntimeException('libcurl package is missing.');
        }
    }

    public function withHeader(string $fieldname, string $value): Client
    {
        $new = clone $this;
        $new->$headers[$fieldname] = $value;

        return $new;
    }

    public function send(RequestInterface $request): ResponseInterface
    {
        $handle = curl_init();
        curl_setopt($handle, CURLOPT_URL, $request->getRequestTarget());
        curl_setopt($handle, CURLOPT_CUSTOMREQUEST, $request->getMethod());
        curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($handle, CURLOPT_HEADER, false);
        curl_setopt($handle, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($handle, CURLOPT_POST, 1);
        //curl_setopt($handle, CURLOPT_POSTFIELDS, json_decode($request->getBody(), true));
        curl_setopt($handle, CURLOPT_POSTFIELDS, '{"username": "demo", "password": "demo"}');

        $data = curl_exec($handle);
if ($data === false) {
    print curl_error($handle);
}
        $reponse = (new \Zend\Diactoros\Response())
            ->withBody(new StringStream($data))
            ->withStatus(curl_getinfo($handle, CURLINFO_HTTP_CODE));


        curl_close($handle); 
        return $reponse;
    }
}
