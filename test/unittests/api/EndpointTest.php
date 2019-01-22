<?php
/**
 * Endpoint tests
 *
 * PHP Version 7
 *
 * @category Tests
 * @package  Test
 * @author   Xavier Lecours <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

require_once __DIR__ . '/../../../vendor/autoload.php';
require_once __DIR__ . '/MockHandler.php';
require_once __DIR__ . '/MockETagHandler.php';
require_once __DIR__ . '/MockRequest.php';

use \Mockery\Adapter\Phpunit\MockeryTestCase;
use \Mockery as m;

use \Psr\Http\Server\RequestHandlerInterface;
use \Psr\Http\Message\ResponseInterface;
use \Psr\Http\Message\ServerRequestInterface;

/**
 * Unit test for SinglePointLogin class
 *
 * @category Tests
 * @package  Test
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class EndpointTest extends MockeryTestCase
{
    public function tearDown()
    {
        \Mockery::close();
    }

    /**
     * @runInSeparateProcess
     * @preserveGlobalState disabled
     */
    function testProcessHandlerHandleIsCalled(): void
    {
        $endpoint = m::mock('\LORIS\Api\Endpoint')
            ->makePartial()
            ->shouldAllowMockingProtectedMethods();

        $endpoint
            ->shouldReceive('supportedVersions')
            ->andReturn(array('test'));

        $request = (new MockRequest())
            ->withattribute('LORIS-API-Version', 'test');

        $handler = m::mock('MockHandler')
            ->shouldReceive('handle')
            ->once()
            ->with($request)
            ->andReturn(new \LORIS\Http\Response())
            ->getMock();

        $response = $endpoint->process($request, $handler);
    }

    /**
     * @runInSeparateProcess
     * @preserveGlobalState disabled
     */
    function testETagHandlerHandleIsNotCalled() : void
    {
        $endpoint = m::mock('\LORIS\Api\Endpoint')
            ->makePartial()
            ->shouldAllowMockingProtectedMethods();

        $endpoint
            ->shouldReceive('supportedVersions')
            ->andReturn(array('test'));

        $request = (new MockRequest())
            ->withattribute('LORIS-API-Version', 'test');

        $etagcalculator = m::mock('overload:\LORIS\Middleware\Etag')
            ->shouldReceive('process')
            ->once()
            ->andReturn(new \LORIS\Http\Response())
            ->getMock();

        $handler = m::mock('MockETagHandler')
            ->shouldReceive('handle')
            ->never()
            ->getMock();

        $response = $this->endpoint->process($request, $handler);
    }
}

