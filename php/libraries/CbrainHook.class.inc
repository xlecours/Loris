<?php
namespace LORIS;

use \Swagger\Client\Configuration;
use \Swagger\Client\Api\BourreauxApi;
use \Swagger\Client\Api\DataProvidersApi;
use \Swagger\Client\Api\GroupsApi;
use \Swagger\Client\Api\SessionsApi;
use \Swagger\Client\Api\ToolConfigsApi;
use \Swagger\Client\Api\ToolsApi;
use \Swagger\Client\Api\TasksApi;
use \Swagger\Client\Api\UsersApi;
use \Swagger\Client\Api\UserfilesApi;

use \Swagger\Client\Model\Bourreau;
use \Swagger\Client\Model\CbrainTask;
use \Swagger\Client\Model\CbrainTaskModReq;
use \Swagger\Client\Model\DataProvider;
use \Swagger\Client\Model\FileInfo;
use \Swagger\Client\Model\Group;
use \Swagger\Client\Model\MultiRegistrationModReq;
use \Swagger\Client\Model\RegistrationInfo;
use \Swagger\Client\Model\Tool;
use \Swagger\Client\Model\ToolConfig;
use \Swagger\Client\Model\User;
use \Swagger\Client\Model\UserFile;

class CbrainHook
{
    private static $instance = null;

    private $config;

    public static function getInstance(): CbrainHook
    {
        if (self::$instance === null) {
            self::$instance = new CbrainHook();
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
                // A 401 mean that authentication is required again.
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
        $_SESSION['cbrain_token']   = $rep_session_post->getCbrainApiToken();
        $_SESSION['cbrain_user_id'] = $rep_session_post->getUserId();

        end:
        $this->config->setApiKey('cbrain_api_token', $_SESSION['cbrain_token']);
    }

    /**
     * @return Bourreau[]
     */
    public function getBourreaux() : array
    {
        return (new BourreauxApi(null, $this->config))
            ->bourreauxGet();
    }

    /**
     * @return Bourreau
     */
    public function getBourreauByName(string $name) : Bourreau
    {
        $bourreaux = array_filter(
            $this->getBourreaux(),
            function ($b) use ($name) {
                return $b->getName() == $name;
            }
        );

        if (count($bourreaux) < 1) {
            throw new \RuntimeException('Bourreau not found');
        }

        if (count($bourreaux) > 1) {
            throw new \RuntimeException('Bourreau name not unique');
        }

        return array_pop($bourreaux);
    }

    /**
     * @return FileInfo[]
     */
    public function getFileinfosFromDataProvider(DataProvider $dataprovider): array
    {
        return (new DataProvidersApi(null, $this->config))
            ->dataProvidersIdBrowseGet($dataprovider->getId());
    }

    public function getFileinfoFromDataProviderByFilename(DataProvider $dataprovider, string $filename): FileInfo
    {
        $userfiles = array_filter(
            $this->getFileinfosFromDataProvider($dataprovider),
            function ($f) use ($filename) {
                return $f->getName() == $filename;
            }
        );

        if (count($userfiles) < 1) {
            throw new \RuntimeException('Filename not found');
        }

        if (count($userfiles) > 1) {
            throw new \RuntimeException('Filename not unique');
        }

        return array_pop($userfiles);
    }

    public function getUserFileByFileinfo(FileInfo $fileinfo): Userfile
    {
        return (new UserfilesApi(null, $this->config))->userfilesIdGet(
            $fileinfo->getUserfileId()
        );
    }

    /**
     * Return an array of CBRAIN's dataproviders that fits the InputDataProvider
     * value defined in the configs.
     *
     * @return DataProvider
     */
    public function getInputDataProvider(): DataProvider
    {
        $dataprovidername = $cbrain_config = (\NDB_Factory::singleton())->config()
            ->getSetting('CBRAIN')['InputDataProviderName'];

        return $this->getDataproviderByName($dataprovidername);
    }

    /**
     * Return an array of CBRAIN's dataproviders that fits the InputDataProvider
     * value defined in the configs.
     *
     * @return DataProvider
     */
    public function getOutputDataProvider(): DataProvider
    {
        $dataprovidername = $cbrain_config = (\NDB_Factory::singleton())->config()
            ->getSetting('CBRAIN')['OutputDataProviderName'];

        return $this->getDataproviderByName($dataprovidername);
    }

    public function getDataproviderByName(string $name): DataProvider
    {
        $dataproviders = array_filter(
            (new DataProvidersApi(null, $this->config))->dataProvidersGet(),
            function ($dp) use ($name) {
                return $dp->getName() == $name;
            }
        );

        if (count($dataproviders) < 1) {
            throw new \RuntimeException('Input dataprovider not found');
        }

        if (count($dataproviders) > 1) {
            throw new \RuntimeException('Input dataprovider name not unique');
        }

        return array_pop($dataproviders);
    }

    public function getTools(): array
    {
        return (new ToolsApi(null, $this->config))->toolsGet();
    }

    public function getToolbyName(string $name): Tool
    {
        $tools = array_filter(
            $this->getTools(),
            function ($dp) use ($name) {
                return $dp['name'] == $name;
            }
        );

        if (count($tools) < 1) {
            throw new \RuntimeException('Tool not found');
        }

        if (count($tools) > 1) {
            throw new \RuntimeException('Tool name not unique');
        }

        return array_pop($tools);
    }

    /**
     * @return ToolConfig[]
     */
    public function getToolConfigs(): array
    {
        return (new ToolConfigsApi(null, $this->config))->toolConfigsGet();
    }

    /**
     * @return ToolConfig
     */
    public function getToolConfigByToolAndBourreau($tool, $bourreau): ToolConfig
    {
        $toolConfigs = array_filter(
            $this->getToolConfigs(),
            function ($tc) use ($tool, $bourreau) {
                return $tc->getToolId() == $tool->getId() && $tc->getBourreauId() == $bourreau->getId();
            }
        );

        if (count($toolConfigs) < 1) {
            throw new \RuntimeException('ToolConfig not found');
        }

        if (count($toolConfigs) > 1) {
            throw new \RuntimeException('ToolConfig not unique');
        }

        return array_pop($toolConfigs);
    }
    
    public function launchTask(CbrainTask $task): array
    {
        $param = new CbrainTaskModReq(array(
            'cbrain_task' =>  $task
        ));
        return (new TasksApi(null, $this->config))->tasksPost($param);
    }

    public function getCurrentUser(): User
    {
        return (new UsersApi(null, $this->config))->usersIdGet($_SESSION['cbrain_user_id']);
    }

    public function getGroups(): array
    {
        return (new GroupsApi(null, $this->config))->groupsGet();
    }

    public function getGroupByName(string $name) {
        $groups = array_filter(
            $this->getGroups(),
            function ($g) use ($name) {
                return $g->getName() == $name;
            }
        );

        if (count($groups) < 1) {
            throw new \RuntimeException('Group not found');
        }

        if (count($groups) > 1) {
            throw new \RuntimeException('Group not unique');
        }

        return array_pop($groups);
    }

    public function registerFile(DataProvider $dataprovider, Fileinfo $file, string $type): Userfile
    {
        $params = new MultiRegistrationModReq(array(
            'basenames'  => array($file->getName()),
            'filetypes'  => array($type),
            'as_user_id' => $this->getCurrentUser()->getId(),
        ));
        $registrationinfos = (new DataProvidersApi(null, $this->config))
            ->dataProvidersIdRegisterPost($dataprovider->getId(), $params);

        if ($registrationinfos->getError() !== null) {
            throw new \RuntimeException($registrationinfos->getError());
        }

        $userfiles = $registrationinfos->getNewlyRegisteredUserfiles();
        if (empty($userfiles)) {
            $userfiles = $registrationinfos->getPreviouslyRegisteredUserfiles();
        }

        return $userfiles[0];
    }

    public function registerLorisBySubjectAndVisitFile(DataProvider $dataprovider, Fileinfo $file): Userfile 
    {
        $filetype = 'LorisBySubjectAndVisit-' . $file->getName();
        return $this->registerFile($dataprovider, $file, $filetype);
    }
}

