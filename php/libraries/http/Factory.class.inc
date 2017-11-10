<?php
/**
 * This is an implementation of the HTTP_Factory defined in PSR17
 *
 * https://github.com/php-fig/fig-standards/blob/master/proposed/http-factory/http-factory.md
 */
namespace LORIS\HTTP;

use \Psr\Http\Message\RequestFactoryInterface;
use \Psr\Http\Message\ResponseFactoryInterface;
use \Psr\Http\Message\ServerRequestFactoryInterface;
use \Psr\Http\Message\StreamFactoryInterface;
use \Psr\Http\Message\UploadedFileFactoryInterface;
use \Psr\Http\Message\UriFactoryInterface;

class
    Factory
implements
    RequestFactoryInterface,
    ResponseFactoryInterface,
    ServerRequestFactoryInterface,
    StreamFactoryInterface,
    UploadedFileFactoryInterface,
    UriFactoryInterface
{
    /**
     * Create a new request.
     *
     * @param string              $method
     * @param UriInterface|string $uri
     *
     * @return RequestInterface
     */
    public function createRequest($method, $uri)
    {
        return new Request($method, $uri);
    }

    /**
     * Create a new response.
     *
     * @param integer $code HTTP status code
     *
     * @return ResponseInterface
     */
    public function createResponse($code = 200)
    {
        // TODO
        return new ResponseInterface();
    }

    /**
     * Create a new server request.
     *
     * @param string              $method
     * @param UriInterface|string $uri
     *
     * @return ServerRequestInterface
     */
    public function createServerRequest($method, $uri)
    {
        // TODO
        return new ServerRequestInterface();
    }

    /**
     * Create a new server request from server variables.
     *
     * @param array $server Typically $_SERVER or similar structure.
     *
     * @return ServerRequestInterface
     *
     * @throws \InvalidArgumentException
     *  If no valid method or URI can be determined.
     */
    public function createServerRequestFromArray(array $server)
    {
        // TODO
        return new ServerRequestInterface();
    }

    /**
     * Create a new stream from a string.
     *
     * The stream SHOULD be created with a temporary resource.
     *
     * @param string $content
     *
     * @return StreamInterface
     */
    public function createStream($content = '')
    {
        // TODO
        return new StreamInterface();
    }

    /**
     * Create a stream from an existing file.
     *
     * The file MUST be opened using the given mode, which may be any mode
     * supported by the `fopen` function.
     *
     * The `$filename` MAY be any string supported by `fopen()`.
     *
     * @param string $filename
     * @param string $mode
     *
     * @return StreamInterface
     */
    public function createStreamFromFile($filename, $mode = 'r')
    {
        // TODO
        return new StreamInterface();
    }

    /**
     * Create a new stream from an existing resource.
     *
     * The stream MUST be readable and may be writable.
     *
     * @param resource $resource
     *
     * @return StreamInterface
     */
    public function createStreamFromResource($resource)
    {
        // TODO
        return new StreamInterface();
    }

    /**
     * Create a new uploaded file.
     *
     * If a string is used to create the file, a temporary resource will be
     * created with the content of the string.
     *
     * If a size is not provided it will be determined by checking the size of
     * the file.
     *
     * @see http://php.net/manual/features.file-upload.post-method.php
     * @see http://php.net/manual/features.file-upload.errors.php
     *
     * @param string|resource $file
     * @param integer         $size            in bytes
     * @param integer         $error           PHP file upload error
     * @param string          $clientFilename
     * @param string          $clientMediaType
     *
     * @return UploadedFileInterface
     *
     * @throws \InvalidArgumentException
     *  If the file resource is not readable.
     */
    public function createUploadedFile(
        $file,
        $size = null,
        $error = \UPLOAD_ERR_OK,
        $clientFilename = null,
        $clientMediaType = null
    ) {

        // TODO
        return new UploadedFileInterface();
    }

    /**
     * Create a new URI.
     *
     * @param string $uri
     *
     * @return UriInterface
     *
     * @throws \InvalidArgumentException
     *  If the given URI cannot be parsed.
     */
    public function createUri($uri = '')
    {
        // TODO
        return new UriInterface();
    }
}
