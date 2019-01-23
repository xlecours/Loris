<?php
/**
 * API Login tests
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
 * Unit test for Login endpoint class
 *
 * @category Tests
 * @package  Test
 * @author   Xavier Lecours <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class LoginTest extends MockeryTestCase
{
    // TODO :: handle
    // TODO :: getLoginAuthenticator

    private $_valid_jwt_key = '!2E4ef%hI klMNopqr5T_';
    /**
     * Test the rules for a strong JWT token
     *
     * @return void
     */
    function testIsKeyStrong() : void
    {
        // fails when less than 20 characters
        $this->assertFalse(
            \LORIS\Api\Endpoints\Login::isKeyStrong(
                ' bcd3fgh!jklmnop rs'
            )
        );

        // fails when nothing but letters
        $this->assertFalse(
            \LORIS\Api\Endpoints\Login::isKeyStrong(
                'AbcdefghiJklmnopqrStuvwxyZ'
            )
        );

        // fails when nothing but numbers
        $this->assertFalse(
            \LORIS\Api\Endpoints\Login::isKeyStrong(
                '123456789012345678901234567890'
            )
        );

        // success if contains numbers, letters, special characters and >20 chars
        $this->assertTrue(
            \LORIS\Api\Endpoints\Login::isKeyStrong(
                $this->_valid_jwt_key
            )
        );
    }

    /**
     * Test the token generation function
     *
     * @return void
     */
    function testGetEncodedToken() : void
    {
        $config = m::mock('NDB_Config')
            ->makePartial();

        $config->shouldReceive('getSetting')
            ->with('www')
            ->andReturn(array('url' => 'https://test.loris.ca'));

        $config->shouldReceive('getSetting')
            ->with('JWTKey')
            ->andReturn($this->_valid_jwt_key);

        $factory = \NDB_Factory::singleton();
        $factory->setConfig($config);

        $login = m::mock('\LORIS\Api\Endpoints\Login')
            ->makePartial()
            ->shouldAllowMockingProtectedMethods();

        $token = $login->getEncodedToken('test_username');
        $this->assertNotEmpty($token);
    }
}


