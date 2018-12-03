<?php
namespace LORIS\tools;

require_once __DIR__ . "/../vendor/autoload.php";

use \Swagger\Client\Model\CbrainTask;

class LegoPhantomPipelineLauncher
{
    protected $cbrainhook;

    public function __construct(
        string $filename,
        string $groupname,
        string $toolname,
        string $bourreauname
    ) {
        $calling_user = \User::singleton(get_current_user());
        if (!$calling_user->hasPermission('phantom_processing')) {
            throw new \LorisException('Permission denied');
        }

        if (empty($filename)) {
            throw new \RuntimeException('filename is required');
        }

        $this->cbrainhook = \LORIS\CbrainHook::getInstance();

        $user       = $this->cbrainhook->getCurrentUser();
        $group      = $this->cbrainhook->getGroupByName($groupname);
        $tool       = $this->cbrainhook->getToolbyName($toolname);
        $bourreau   = $this->cbrainhook->getBourreauByName($bourreauname);
        $toolconfig = $this->cbrainhook->getToolConfigByToolAndBourreau(
            $tool,
            $bourreau
        );
        $input_dp   = $this->cbrainhook->getInputDataProvider();
        $output_dp  = $this->cbrainhook->getOutputDataProvider();
        $fileinfo   = $this->cbrainhook->getFileinfoFromDataProviderByFilename(
            $input_dp,
            $filename
        );

        // Make sure the file is registered
        if ($fileinfo->getUserfileId() === null) {
            $userfile = $this->cbrainhook->registerLorisBySubjectAndVisitFile(
                $input_dp,
                $fileinfo
            );
        } else {
            $userfile = $this->cbrainhook->getUserFileByFileinfo($fileinfo);
        }
        $userfile_id = $userfile->getId();

        $this->task = new CbrainTask(
            array(
             'user_id'                  => $user->getId(),
             'group_id'                 => $group->getId(),
             'bourreau_id'              => $bourreau->getId(),
             'tool_config_id'           => $toolconfig->getId(),
             'results_data_provider_id' => $output_dp->getId(),
             'params'                   => array(
                                            'interface_userfile_ids' => array($userfile_id),
                                            'file_collect'           => $userfile_id,
                                           ),
             'description'              => "LegoPhantomPipelineLauncher",
            )
        );
    }

    public function getTask(): CbrainTask
    {
        return $this->task;
    }

    public function launch(): CbrainTask
    {
        $this->task = $this->cbrainhook->launchTask($this->task);
        return $this->task;
    }
} // LegoPhantomPipelineLauncher

/*******************************************************
 *************** BEGINING OF THE SCRIPT ****************
 *******************************************************/

if ($argc !== 2 || $argv[1] == '--help' or $argv[1] == '-h') {
    print_usage();
    exit(1);
}

$configFile = __DIR__."/../project/config.xml";
$client     = new \NDB_Client();
$client->makeCommandLine();
$client->initialize($configFile);

$filename = $argv[1];

$groupname = $cbrain_config = (\NDB_Factory::singleton())->config()
            ->getSetting('CBRAIN')['groupname'];
try {
    $launcher = new LegoPhantomPipelineLauncher(
        $filename,
        $groupname,
        'PhantomProc_09',
        'AceLab-VH-2'
    );
    $task     = $launcher->launch();
    fwrite(STDOUT, $task);
    exit(0);
} catch (\Runtimeexception $e) {
    fwrite(STDERR, $e->getMessage() . PHP_EOL);
    exit(1);
}

function print_usage()
{
    $scriptname = basename(__FILE__);

    echo "\e[1mUSAGE:\e[0m" . PHP_EOL;
    echo "This script launch a PhantomProc_09 task on CBRAIN." . PHP_EOL;
    echo PHP_EOL . "\e[1mEXAMPLE\e[0m" . PHP_EOL;
    echo "USER=\e[4musername\e[0m php $scriptname \e[4mvisitlabel\e[0m" . PHP_EOL;
    echo PHP_EOL . "\e[1mPARAMS:\e[0m" . PHP_EOL;
    echo "\e[4musername\e[0m A corresponding LORIS user with the appropriate permission" . PHP_EOL;
    echo "\e[4mvisitlabel\e[0m The visit label of a phantom session with files on the dataprovider" . PHP_EOL;
    echo PHP_EOL;
}
