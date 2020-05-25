<?php declare(strict_types=1);
/**
 * This contains tests relevant to the API
 *
 * PHP Version 7
 *
 * @category   API
 * @package    Tests
 * @subpackage Login
 * @author     Simon Pelletier <simon.pelletier@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */


namespace LORIS\api\Test;
ini_set('memory_limit', '1024M');

require './vendor/autoload.php';

use phpDocumentor\Reflection\Types\AbstractList;
use phpDocumentor\Reflection\Types\Array_;
use PHPUnit\Framework\TestCase;
use Laminas\Diactoros\ServerRequest;
use GuzzleHttp\Client;

/**
 * PHPUnit class for API testsuite
 *
 * @category   API
 * @package    Tests
 * @subpackage Login
 * @author     Simon Pelletier <simon.pelletier@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */


class projectsTest extends TestCase
{

    private $_client;
    /**
     * @var string[]
     */
    private $_headers;
    private $_base_uri;

    /**
     * @var string[]
     */

    private function _login()
    {
        $this->_base_uri = 'https://test-loris-dev.loris.ca/api/v0.0.3/';
        $this->_client = new \GuzzleHttp\Client(['base_uri' => $this->_base_uri]);
        $response = $this->_client->request('POST', 'https://test-loris-dev.loris.ca/api/v0.0.3/login', ['json' => ['username' => 'admin', 'password' => 'LORISitb100%']]);
        $token = $response->getBody()->getContents();
        $token = substr(json_decode((string)json_encode($token), true), 10, -2);
        $headers = ['Authorization' => 'Bearer ' . $token,
            'Accept' => 'application/json',];
        $this->_headers = $headers;
    }


    private function allNamesGet($json_arr, array $path_arr, string $path)
    {
        $a = '';
        $sub = array_shift($path_arr);
        if($sub[0] === '{' and $sub[-1] === '}'){
            $a = array_keys($json_arr)[0];
            if ($sub == "{tarname}"){
                $a = array_keys($json_arr)[1];
            }
            if ($sub == "{filename}"){
                $a = array_keys($json_arr)[1];
            }
            if ($a == "Meta") {
                $a = array_keys($json_arr)[1];
            }
            if($a === 'Projects') {
                $sub = array_keys($json_arr[$a]);
            } elseif ($a === 'Candidates' or $a === "Visits"or $a === "Instruments" or $a === "Files" or $a === "DicomTars") {
                $tmp = $sub;
                $sub = array();
                $keys = array_keys($json_arr[$a]);

                foreach($keys as $key){
                    $substr = substr($tmp, 1, -1);
                    if ($substr === 'candid'){
                        $substr = 'CandID';
                        array_push($sub, $json_arr[$a][$key][$substr]);
                    } elseif ($substr === 'visit') {
                        $a = 'Visits';
                        $upper = ucfirst($json_arr[$a][$key]);
                        array_push($sub, $upper);
                    } elseif ($substr === 'instruments') {
                        $a = 'Instruments';
                        $upper = ucfirst($json_arr[$a][$key]);
                        array_push($sub, $upper);
                    } elseif ($substr === 'filename') {
                        $a = 'Files';
                        $upper = $json_arr[$a][$key]["Filename"];
                        array_push($sub, $upper);
                    } elseif ($substr === 'tarname') {
                        $b = 'Tarname';
                        $upper = ucfirst($json_arr[$a][$key][$b]);
                        array_push($sub, $upper);
                    }
                }
            }
        } else {
            $sub = array($sub);
        }
        if (gettype($sub) == 'string'){
            $sub = array($sub);
        }
        foreach ($sub as $s)
        {
            if ($a !== "Visits" and $a !== "Files" and $a !== "DicomTars"){
                $s = strtolower($s);
            }

            if (preg_match("/v[0-9]+/", $s)){
                $s = ucfirst($s);
            }

            if ($s !== "qc" and $s != "format"){
                try{
                    $response = $this->_client->request('GET', $path . '/' . $s, ['headers' => $this->_headers]);
                    $json_string = $response->getBody()->getContents();
                    $json_arr = json_decode((string) utf8_encode($json_string), true);
                    if (count($path_arr) > 0 ) {
                        $this->allNamesGet($json_arr, $path_arr, $path . '/' . $s);
                    }
                    else {
                        // Verify the status code
                        $this->assertEquals(200, $response->getStatusCode());

                        // Verify the endpoint has a header
                        $headers = $response->getHeaders();
                        $this->assertNotEmpty($headers);
                        foreach($headers as $header)
                        {
                            $this->assertNotEmpty($header);
                            //$this->assertIsString($header[0]); # The method assertIsString is not found
                        }

                        // Verify the endpoint has a body
                        $body = $response->getBody();

                        $this->assertNotEmpty($body);
                    }

                } catch (\Exception $e){
                    echo $e->getMessage(), "\n\n";
                }
            }
        }
    }

    private function allNamesPost($json_arr, array $path_arr, string $path, $json)
    {
        $a = '';
        $sub = array_shift($path_arr);
        if($sub[0] === '{' and $sub[-1] === '}'){
            $a = array_keys($json_arr)[0];
            if ($sub == "{tarname}"){
                $a = array_keys($json_arr)[1];
            }
            if ($a == "Meta") {
                $a = array_keys($json_arr)[1];
            }
            if($a === 'Projects') {
                $sub = array_keys($json_arr[$a]);
            } elseif ($a === 'Candidates' or $a === "Visits"or $a === "Instruments" or $a === "Files" or $a === "DicomTars") {
                $tmp = $sub;
                $sub = array();
                $keys = array_keys($json_arr[$a]);

                foreach($keys as $key){
                    $substr = substr($tmp, 1, -1);
                    if ($substr === 'candid'){
                        $substr = 'CandID';
                        array_push($sub, $json_arr[$a][$key][$substr]);
                    } elseif ($substr === 'visit') {
                        $a = 'Visits';
                        $upper = ucfirst($json_arr[$a][$key]);
                        array_push($sub, $upper);
                    } elseif ($substr === 'instruments') {
                        $a = 'Instruments';
                        $upper = ucfirst($json_arr[$a][$key]);
                        array_push($sub, $upper);
                    } elseif ($substr === 'filename') {
                        $a = 'Files';
                        $upper = ucfirst($json_arr[$a][$key]["Filename"]);
                        array_push($sub, $upper);
                    } elseif ($substr === 'tarname') {
                        $b = 'Tarname';
                        $upper = ucfirst($json_arr[$a][$key][$b]);
                        array_push($sub, $upper);
                    }
                }
            }
        } else {
            $sub = array($sub);
        }
        if (gettype($sub) == 'string'){
            $sub = array($sub);
        }
        foreach ($sub as $s)
        {
            if ($a !== "Visits" and $a !== "Files" and $a !== "DicomTars"){
                $s = strtolower($s);
            }
            if (preg_match("/v[0-9]+/", $s)){
                $s = ucfirst($s);
            }

            if ($s !== "qc" and $s != "format"){
                try{
                    $response = $this->_client->request('POST', $path . '/' . $s, ['headers' => $this->_headers,
                        'json' => $json]);

                    $json_string = $response->getBody()->getContents();
                    $json_arr = json_decode((string) utf8_encode($json_string), true);
                    if (count($path_arr) > 0 ) {
                        $this->allNamesPost($json_arr, $path_arr, $path . '/' . $s, $json);
                    }
                    else {
                        // Verify the status code
                        $this->assertEquals(201, $response->getStatusCode());

                        // Verify the endpoint has a header
                        $headers = $response->getHeaders();
                        $this->assertNotEmpty($headers);
                        foreach($headers as $header)
                        {
                            $this->assertNotEmpty($header);
                            //$this->assertIsString($header[0]);
                        }

                        // Verify the endpoint has a body
                        $body = $response->getBody();

                        $this->assertNotEmpty($body);
                    }

                } catch (\Exception $e){
                    echo $e->getMessage(), "\n\n";
                }
            }
        }
    }

    private function allTestsGet(array $path_arr, $p)
    {
        $response = $this->_client->request('GET', $this->_base_uri . $p, ['headers' => $this->_headers]);
        $json_string = $response->getBody()->getContents();
        $json_arr = json_decode((string) utf8_encode($json_string), true);
        foreach($path_arr['GET'] as $path)
        {
            $path_arr = explode('/', $path);
            array_shift($path_arr);
            $this->allNamesGet($json_arr, $path_arr, $path=$this->_base_uri);
        }
    }

    private function allTestsPost(array $path_arr, $p, $json)
    {
        $response = $this->_client->request('POST', $this->_base_uri . $p, [
            'headers' => $this->_headers,
            'json' => $json
        ]);
        $json_string = $response->getBody()->getContents();
        $json_arr = json_decode((string) utf8_encode($json_string), true);
        foreach($path_arr['POST'] as $path)
        {
            $path_arr = explode('/', $path);
            array_shift($path_arr);
            $this->allNamesPost($json_arr, $path_arr, $path=$this->_base_uri, $json);
        }
    }

    public function testProjectsEndpoints(): void
    {
        $endpoints = array(
            "GET" =>
                array(
                    '/projects',
                    '/projects/{project}',
                    '/projects/{project}/candidates',
                    '/projects/{project}/images',
                    '/projects/{project}/instruments',
                    '/projects/{project}/instruments/{instrument}',
                    '/projects/{project}/visits',
                )
        );
        $this->_login();

        $this->allTestsGet($endpoints, 'projects');
    }

    public function testCandidatesGetEndpoints(): void
    {
        $this->base_url = 'https://test-loris-dev.loris.ca/api/v0.0.3/';
        $endpoints = array(
            "GET" =>
                array(
                    // Candidates
                    '/candidates',
                    '/candidates/{candid}',

                    // Visit
                    '/candidates/{candid}/{visit}',
                    '/candidates/{candid}/{visit}/qc/imaging',

                    // Instruments
                    '/candidates/{candid}/{visit}/instruments',
                    '/candidates/{candid}/{visit}/instruments/{instrument}',
                    '/candidates/{candid}/{visit}/instruments/{instrument}/flags',
                    '/candidates/{candid}/{visit}/instruments/{instrument}/dde',
                    '/candidates/{candid}/{visit}/instruments/{instrument}/dde/flags',
                    // images
                    '/candidates/{candid}/{visit}/images',
                    '/candidates/{candid}/{visit}/images/{filename}',
                    //'/candidates/{candid}/{visit}/images/{filename}/qc',

                    '/candidates/{candid}/{visit}/images/{filename}/format/brainbrowser',
                    '/candidates/{candid}/{visit}/images/{filename}/format/raw',
                    '/candidates/{candid}/{visit}/images/{filename}/format/thumbnail',
                    '/candidates/{candid}/{visit}/images/{filename}/headers',
                    '/candidates/{candid}/{visit}/images/{filename}/headers/full',
                    '/candidates/{candid}/{visit}/images/{filename}/headers/{headername}',
                    // Dicoms
                    '/candidates/{candid}/{visit}/dicoms',
                    '/candidates/{candid}/{visit}/dicoms/{tarname}',
                    '/candidates/{candid}/{visit}/dicoms/{tarname}/processes',
                    '/candidates/{candid}/{visit}/dicoms/{tarname}/processes/{processid}',
                )
        );
        $this->_login();

        $this->allTestsGet($endpoints, 'candidates');
    }
    public function testCandidatesPostEndpoints(): void
    {
        $this->base_url = 'https://test-loris-dev.loris.ca/api/v0.0.3/';
        $endpoints = array(
            "POST" =>
                array(
                    '/candidates',
                    // Dicoms
                    //'/candidates/{candid}/{visit}/dicoms',
                    //'/candidates/{candid}/{visit}/dicoms/{tarname}/processes'
                )
        );
        $this->_login();

        $json1 = [
            'Candidate' =>
                [
                    'CandID' => "111111",
                    'Project' => "Rye",
                    'PSCID' => "DCC355",
                    'Site' => "Data Coordinating Center",
                    'EDC' => "2020-01-03",
                    'DoB' => "2020-01-03",
                    'Sex' => "Male"
                ]
        ];
        $json_exist = [
            'Candidate' =>
                [
                    'CandID' => "115787",
                    'Project' => "Pumpernickel",
                    'PSCID' => "DCC355",
                    'Site' => "Data Coordinating Center",
                    'EDC' => "2020-01-01",
                    'DoB' => "2020-01-01",
                    'Sex' => "Female"
                ]
        ];

        $this->allTestsPost($endpoints, 'candidates', $json1);
        $this->allTestsPost($endpoints, 'candidates', $json_exist);

    }
}

