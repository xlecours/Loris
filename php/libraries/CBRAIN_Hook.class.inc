<?php
namespace LORIS;

// FIXME:: This is temporary. The client should be dowloaded from a public repo
//         using composer instead.
require_once __DIR__ . "/../../vendor/SwaggerClient-php/vendor/autoload.php";

use \Swagger\Client\Configuration;
use \Swagger\Client\Api\SessionsApi;
use \Swagger\Client\Api\DataProvidersApi;

class CBRAIN_Hook
{

    private $config;

    public function __construct()
    {
        $this->config = new Configuration();

        $cbrain_config = (\NDB_Factory::singleton())->config()
            ->getSetting('CBRAIN');

        $this->config->setHost($cbrain_config['host']);

        $session_api = new SessionsApi(
            null, // Will use Guzzle/Http/Client by default
            $this->config
        );

        if (!empty($_SESSION['cbrain_token'])) {
            try {
                $this->config->setApiKey(
                    'cbrain_api_token',
                    $_SESSION['cbrain_token']
                );
                $session_api->sessionGet();
                // The cbrain_token is still valid
                goto end;
            } catch (\Swagger\Client\ApiException $e)  {
                if ($e->getCode() != 401) {
                    throw $e;
                }
            }
        }

        // Get a new token
        $rep_session_post         = $session_api->sessionPost(
            $cbrain_config['username'],
            $cbrain_config['password']
        );
        $_SESSION['cbrain_token'] = $rep_session_post->getCbrainApiToken();

        end:
        $this->config->setApiKey('cbrain_api_token', $_SESSION['cbrain_token']);
    }

    /**
     * @return \Swagger\\Client\\Model\\FileInfo[]
     */
    public function getUserfiles()
    {
        $apiInstance = new DataProvidersApi(
            null, // Will use Guzzle/Http/Client by default
            $this->config
        );
        $id          = 117;
        $dp_api      = $apiInstance->dataProvidersIdBrowseGet($id);
        return $dp_api;
    }
}
