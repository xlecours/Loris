<?php
namespace LORIS;

require_once __DIR__ . "/../../vendor/SwaggerClient-php/vendor/autoload.php";

use \Swagger\Client\Configuration;
use \Swagger\Client\Api\SessionsApi;
use \Swagger\Client\Api\DataProvidersApi;

class CBRAIN_Hook
{

    private $config;
    private $cbrain_config;

    public function __construct()
    {
        $this->config  = new \Swagger\Client\Configuration();

        $this->cbrain_config = (\NDB_Factory::singleton())->config()
            ->getSetting('CBRAIN');

        $this->config->setHost($this->cbrain_config['host']);       

        $session_api      = new \Swagger\Client\Api\SessionsApi(
            null,
            $this->config
        );

        $rep_session_post = $session_api->sessionPost(
            $this->cbrain_config['username'],
            $this->cbrain_config['password']
        );

        $token = $rep_session_post->getCbrainApiToken();
        $this->config->setApiKey('cbrain_api_token', $token);
    }

    /**
     * @return \Swagger\\Client\\Model\\FileInfo[]
     */
    public function getUserfiles()
    {
       $apiInstance = new \Swagger\Client\Api\DataProvidersApi(
          new \GuzzleHttp\Client(),
          $this->config
       ); 
       $id     = 117;
       $dp_api = $apiInstance->dataProvidersIdBrowseGet($id);
       return $dp_api;
    }
}
