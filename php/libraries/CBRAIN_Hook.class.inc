<?php
namespace LORIS;

use \Swagger\Client\Configuration;
use \Swagger\Client\Api\SessionsApi;
use \Swagger\Client\Api\DataProvidersApi;
use \Swagger\Client\Api\ToolConfigsApi;
use \Swagger\Client\Api\ToolsApi;
use \Swagger\Client\Api\TasksApi;

class CBRAIN_Hook
{
    private static $instance = null;

    private $config;

    public static function getInstance(): CBRAIN_Hook
    {
        if (self::$instance === null) {
            self::$instance = new CBRAIN_Hook();
        }
        return self::$instance;
    }

    private function __construct()
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
     * @return \Swagger\Client\Model\FileInfo[]
     */
    public function getUserfilesFromDataProvider(int $dataproviderid): array
    {
        return (new DataProvidersApi(null, $this->config))
            ->dataProvidersIdBrowseGet($dataproviderid);
    }

    /**
     * Return an array of CBRAIN's dataproviders that fits the InputDataProvider
     * value defined in the configs.
     *
     * @return \Swagger\Client\Model\DataProvider[]
     */
    public function getInputDataProvider(): array
    {
        $dataprovidername = $cbrain_config = (\NDB_Factory::singleton())->config()
            ->getSetting('CBRAIN')['InputDataProviderName'];

        return array_filter(
            (new DataProvidersApi(null, $this->config))->dataProvidersGet(),
            function ($dp) use ($dataprovidername) {
                return $dp['name'] == $dataprovidername;
            }
        );
    }

    /**
     * Return an array of CBRAIN's dataproviders that fits the InputDataProvider
     * value defined in the configs.
     *
     * @return \Swagger\Client\Model\DataProvider[]
     */
    public function getOutputDataProvider(): array
    {
        $dataprovidername = $cbrain_config = (\NDB_Factory::singleton())->config()
            ->getSetting('CBRAIN')['OutputDataProviderName'];

        return array_filter(
            (new DataProvidersApi(null, $this->config))->dataProvidersGet(),
            function ($dp) use ($dataprovidername) {
                return $dp['name'] == $dataprovidername;
            }
        );
    }
    public function getAvailableTools(): array
    {
        var_dump((new ToolsApi(null, $this->config))->toolsGet());
        return (new ToolConfigsApi(null, $this->config))->toolConfigsGet();
    }
}
