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

use \Mockery\Adapter\Phpunit\MockeryTestCase;
use \Mockery as m;

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
    /**
     * Test that the endpoint abstract class process function is calling
     * handle on the handler that it receive.
     *
     * @return void
     */
    function testProcessHandlerHandleIsCalled(): void
    {
        $endpoint = m::mock('\LORIS\Api\Endpoint')
            ->makePartial()
            ->shouldAllowMockingProtectedMethods();

        $endpoint
            ->shouldReceive('supportedVersions')
            ->andReturn(array('test'));

        $request = (new \Zend\Diactoros\ServerRequest())
            ->withattribute('LORIS-API-Version', 'test');

        $handler = m::mock('\Psr\Http\Server\RequestHandlerInterface')
            ->shouldReceive('handle')
            ->once()
            ->with($request)
            ->andReturn(new \LORIS\Http\Response())
            ->getMock();

        $response = $endpoint->process($request, $handler);
    }

    /**
     * Test that the endpoint abstract class process function is not calling
     * handle on the handler that it receive when it implements ETagCalculator.
     *
     * @return void
     */
    function testETagHandlerHandleIsNotCalled() : void
    {
        $endpoint = m::mock('\LORIS\Api\Endpoint')
            ->makePartial()
            ->shouldAllowMockingProtectedMethods();

        $endpoint
            ->shouldReceive('supportedVersions')
            ->andReturn(array('test'));

        $request = (new \Zend\Diactoros\ServerRequest())
            ->withattribute('LORIS-API-Version', 'test');

        $etagcalculator = m::mock('overload:\LORIS\Middleware\Etag')
            ->shouldReceive('process')
            ->once()
            ->andReturn(new \LORIS\Http\Response())
            ->getMock();

        $handler = m::mock(
            '\Psr\Http\Server\RequestHandlerInterface',
            '\LORIS\Middleware\ETagCalculator'
        )
            ->shouldReceive('handle')
            ->never()
            ->getMock();

        $response = $endpoint->process($request, $handler);
    }
}

