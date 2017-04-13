<?php

namespace LORIS\directory_manager;

require_once __DIR__ . '/../cbrain-php-api/vendor/autoload.php';
// TODO :: There is probably a better way...

final class CBRAIN_API
{
    private static $instance = null;

    private $cbrain_user;
    private $session_api;
    private $dataprovider_api;

    private $session_token;
    private $selected_dataprovider_id;

    private function __construct()
    {
        $config_array = parse_ini_file(__DIR__ . '/cbrain_api_config.ini', true);

        $this->cbrain_user = new \Swagger\Client\Model\User();
        $this->cbrain_user->setLogin($config_array['credential']['username']);
        $this->cbrain_user->setPassword($config_array['credential']['password']);

        $this->session_api = new \Swagger\Client\Api\SessionsApi();
        $this->session_api->getApiClient()->getConfig()->setHost($config_array['host']['hostname']);

        $this->dataprovider_api = new \Swagger\Client\Api\DataProvidersApi();
    }

    

    public static function getInstance()
    {
        if (!isset(self::$instance)) {
           self::$instance = new CBRAIN_API();
        }
        return self::$instance;
    }

    // connect to cbrain api using credentials
    public function connect()
    {
        $login    = $this->cbrain_user->getLogin(); // string | The username of the User trying to connect.
        $password = $this->cbrain_user->getPassword(); // string | The CBRAIN User's password

        $this->session_token = json_decode($this->session_api->sessionNewGet(), true)['authenticity_token'];

        try {
            $result = json_decode($this->session_api->sessionPost($login, $password, $this->session_token), true);
        } catch (Exception $e) {
            var_dump($e);
        }
    }

    // return a list of available dataprovider for the connected user.
    private function _getDataProviders()
    {
        return $this->dataprovider_api->dataProvidersGet();
    }

    // Set a dataprovider named $name as the selected one for queries
    public function selectDataproviderByName($name)
    {
        foreach ( $this->_getDataProviders() as $dp) {
            if($dp->getName() == $name) {
                $this->selected_dataprovider_id = $dp->getId();
            }
        }
        if (empty($this->selected_dataprovider_id)) {
            error_log("dataprovider $name not found");
        }
    }

    // Return true if a dataprovider has been selected and if it is alive
    private function _dataProviderReady()
    {
        $is_ready = false;
        if (!empty($this->selected_dataprovider_id)) {
            $is_ready = json_decode(
                $this->dataprovider_api->dataProvidersIdIsAliveGet($this->selected_dataprovider_id),
                true
            )['is_alive'];
        } else {
            error_log('selected_dataprovider is empty');
        }
        return $is_ready;
    }

    public function listDataProviderFile()
    {
        $result = array();
        if ($this->_dataProviderReady()) {
            $result = $this->dataprovider_api->dataProvidersIdBrowseGet($this->selected_dataprovider_id);
        } else {
            error_log('dataprovider is not ready');
        }
        return $result;
    }

    // register each of the files to the selected dataprovider
    // params $file_array an array of Swagger\Client\Model\Userfile
    public function registerFiles($file_array)
    {
        if ($this->_dataProviderReady()) {
            $params = new \Swagger\Client\Model\Params4();
            $params->setBasenames(
                array_map(
                    function ($f) {
                        return $f->getName();
                    },
                    $file_array
                )
            );
            $params->setFiletypes(
                array_map(
                    function ($f) {
                        return 'CSVFile-' . $f->getName();
                    },
                    $file_array
                )
            );
            $params->setAuthenticityToken($this->session_token);

            $this->dataprovider_api->dataProvidersIdRegisterPost(
                $this->selected_dataprovider_id,
                $params
            );
        } else {
            error_log("dataprovider is not ready. id : $this->selected_dataprovider_id");
        }
    }


    // Unregister files
    public function unregisterFiles()
    {
        $params = new \Swagger\Client\Model\Params5();
        $params->setBasenames(['a.csv','b.csv']);
        $params->setAuthenticityToken($this->session_token);

        $this->dataprovider_api->dataProvidersIdUnregisterPost(
            $this->selected_dataprovider_id,
            $params
       );

    }
}
