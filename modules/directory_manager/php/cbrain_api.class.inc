<?php

namespace LORIS\directory_manager;

require_once __DIR__ . '/../../.././vendor/cbrain-php-api/autoload.php';
// TODO :: There is probably a better way...

final class CBRAIN_API
{
    private static $instance = null;

    private $cbrain_user;
    private $session_api;
    private $dataprovider_api;
    private $userfile_api;

    private $session_token;
    private $session_id;
    private $user_id;
    private $selected_dataprovider_id;

    private function __construct()
    {
        $config_array = parse_ini_file(__DIR__ . '/../../../project/cbrain_api_config.ini', true);

        $this->cbrain_user = new \Swagger\Client\Model\User();
        $this->cbrain_user->setLogin($config_array['credential']['username']);
        $this->cbrain_user->setPassword($config_array['credential']['password']);

        $this->session_api = new \Swagger\Client\Api\SessionsApi();
        $this->session_api->getApiClient()->getConfig()->setHost($config_array['host']['hostname']);

        $this->dataprovider_api = new \Swagger\Client\Api\DataProvidersApi();
        $this->userfile_api = new \Swagger\Client\Api\UserfilesApi();
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
         
        try {

            if (empty($_SESSION['cbrain_token']) || true) {
                $token = json_decode($this->session_api->sessionNewGet(), true)['authenticity_token'];
error_log($token);
                $this->session_api->sessionPost($login, $password, $token);
                $_SESSION['cbrain_token'] = $token;
            } 
            $this->session_token = $_SESSION['cbrain_token'];
            
        } catch (ApiException $e) {
            unset($_SESSION['cbrain_token']);
            error_log(print_r($e,true));
        } catch (Exception $e) {
            unset($_SESSION['cbrain_token']);
            error_log(print_r($e,true));
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

    public function registerFiles($file_tuples)
    {
        $params = new \Swagger\Client\Model\Params4();
        $params->setBasenames(
            array_map(
                function ($f) {
                    return $f->file_name;
                },
                $file_tuples
            )
        );
        $params->setFiletypes(
            array_map(
                function ($f) {
                    return $f->file_type;
                },
                $file_tuples
            )
        );
        $params->setAuthenticityToken($this->session_token);
        $this->dataprovider_api->dataProvidersIdRegisterPost(
            $this->selected_dataprovider_id,
            $params
        );
    }


    // Unregister files
    public function unregisterFiles($filenames)
    {
        $params = new \Swagger\Client\Model\Params5();
        $params->setBasenames($filenames);
        $params->setDelete(false);
        $params->setAuthenticityToken($this->session_token);
        $x = $this->dataprovider_api->dataProvidersIdUnregisterPost(
            $this->selected_dataprovider_id,
            $params
        );
    }

    public function myCheckSum()
    {
        $tool_config_id = 457;

        $tool_api = new \Swagger\Client\Api\ToolsApi();
        $tool = array_reduce($tool_api->toolsGet(), function ($carry, $item) {
            if (empty($carry) && $item->getName() == 'MyCksum')  {
                $carry = $item;
            }
            return $carry;
        }, null);

        $params   = new \Swagger\Client\Model\Params19();
        $params->setToolConfigId($tool_config_id);

        $task = new \Swagger\Client\Model\CbrainTask();
        $task->setToolConfigId($tool_config_id);

        $task_input_params = array(
            "interface_userfile_ids" => array(
                "927529"
            ),
            "output_file_prefix" =>"ck_",
            "struct_with_day_and_month" => array(
                "day" => "3",
                "month" => "Jan"
            ),
            "an_odd_number" => "3"
        );


        $task->setParams($task_input_params);
        $params->setCbrainTask($task);
        $params->setAuthenticityToken($this->session_token);
        $task_api = new \Swagger\Client\Api\TasksApi();
        $task_api->tasksPost($params);
    }
}
