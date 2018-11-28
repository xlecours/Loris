<?php

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
        $this->task = $this->cbrainhook->launchTask($this->task)[0];
        return $this->task;
    }
}



