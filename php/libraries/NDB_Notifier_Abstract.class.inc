<?php
/**
 * PHP Version 7
 *
 * @category Imaging
 * @package  Imaging
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

require_once "Email.class.inc";

/**
 * A class allowing to issue notification using several services including sms,
 * phone, email and loris in-site notifications.
 *
 * @category Imaging
 * @package  Imaging
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
abstract class NDB_Notifier_Abstract
{
    /**
     * Get the current logged in user issuing the notification.
     *
     * @var array [ID,name,email]
     */
    protected $_notifier;

    /**
     * Get the admin user issuing the notification.
     *
     * @var string
     */
    protected $_adminNotifier;

    /**
     * Get list of users to be notified and notification methods.
     *
     * @var array
     */
    protected $_notified =array();

    /**
     * Module for which the notifier is setup
     *
     * @var string
     */
    protected $_module;

    /**
     * Operation for which the notifier is setup
     *
     * @var string
     */
    protected $_operation;

    /**
     * Template to use for email/sms/phone
     *
     * @var string
     */
    protected $_template;

    /**
     * Data to be sent to the template fo filling
     *
     * @var array
     */
    protected $_tpl_data =array();

    /**
     * NDB_Notifier constructor.
     *
     * @param string $module_name    module issuing notification
     * @param string $operation_type operation triggering notification
     * @param array  $extra_tpl_data additional variables to be sent to the tpl.
     *
     * @throws LorisException Exception thrown if module is not supported
     *                        by the notifier.
     */
    public function __construct(
        $module_name,
        $operation_type,
        $extra_tpl_data=array()
    ) {
        $config =& NDB_Config::singleton();

        $this->_module        =$module_name;
        $this->_operation     =$operation_type;
        $this->_notified      =$this->_get2DListToNotify();
        $this->_notifier      =$this->_getLoggedInUser();
        $this->_adminNotifier =$this->_getAdminUser();
        $this->_tpl_data      = $this->_tpl_data + $extra_tpl_data;
        $this->_tpl_data['study_logo'] = $config->getSetting('studylogo');
        $this->_tpl_data['baseurl']    = $config->getSetting('url');
        $this->_tpl_data['study_name'] = $config->getSetting('title');

        switch ($module_name) {
        case 'media':
            if ($operation_type==='download') {
                $this->_template ="notifier_media_download.tpl";
                break;
            } elseif ($operation_type==='upload') {
                $this->_template ="notifier_media_upload.tpl";
                break;
            } else {
                throw new LorisException(
                    "Notifications have not been defined for the ".
                    "$module_name $operation_type operation."
                );
                break;
            }
        case 'bvl_feedback':
            if ($operation_type==='newTicket') {
                break;
            } else {
                throw new LorisException(
                    "Notifications have not been defined for the ".
                    "$module_name $operation_type operation."
                );
                break;
            }
        default:
            throw new LorisException(
                "Notifications have not been defined for this module and operation."
            );
                break;
        }
    }

    /**
     * Getter for user issuing notification
     *
     * @return array   User issuing notification in form [ID,name,email]
     */
    public function getNotifier()
    {
        return $this->_notifier;
    }

    /**
     * Getter for users receiving notification
     *
     * @return array    Users receiving notifications from this module
     */
    public function getNotified()
    {
        return $this->_notified;
    }

    /**
     * Gets information of logged in user and returns a name-email string combination
     *
     * @return string   string in the form `First Last <email@domain.com>`
     */
    private function _getLoggedInUser()
    {
        $user        =& User::singleton();
        $info_array =array();
        $info_array ['ID']   = $user->getData('ID');
        $info_array['name']  = $user->getFullname();
        $info_array['email'] = $user->getData('Email');
        return $info_array;
    }

    /**
     * Gets information of admin user and returns a name-email string combination
     *
     * @return string   string in the form `First Last <email@domain.com>`
     */
    protected function _getAdminUser()
    {
        $DB          = Database::singleton();
        $result      = $DB->pselectRow(
            "SELECT Real_name, Email FROM users WHERE UserID='admin'",
            array()
        );
        $concat_name = $result['Real_name'].' <'.$result['Email'].'>';
        return $concat_name;
    }

    /**
     * Gets 2D list of user emails/phone numbers from database grouped by
     * notification service
     *
     * @return array   2D list of user emails and/or phone numbers grouped by
     *                 available service.
     */
    private function _get2DListToNotify()
    {
        $DB   = Database::singleton();
        $user =& User::singleton();
        $site_concerned =  $user->getCenterID();
        // query needs to take into account the notified user permissions.

        $query  = "SELECT DISTINCT 
                    u.ID as user,
                    u.Real_name, 
                    u.Email, 
                    u.Phone,
                    nm.*, 
                    ns.*
                  FROM users u 
                    JOIN users_notifications_rel unr ON (u.ID = unr.user_id) 
                    JOIN notification_modules nm ON (nm.id = unr.module_id)
                    JOIN notification_services ns ON (ns.id = unr.service_id)
                    JOIN user_perm_rel upr ON (u.ID=upr.UserID)
                  WHERE nm.module_name=:nm
                    AND nm.operation_type=:ot
                    AND (u.CenterID=:cid OR upr.permID=(SELECT permID 
                                    FROM permissions 
                                    WHERE code='access_all_profiles')
                        )
                    ";
        $params = array(
                   "nm"  => $this->_module,
                   "ot"  => $this->_operation,
                   "cid" => $site_concerned,
                  );
        $result = $DB->pselect($query, $params);

        //parse $result and create 2D array
        $notification_list =array();

        foreach ($result as $k=>$row) {
            $notification_list[$row['service']][$row['Real_name']]= $row['user'];
        }
        return $notification_list;
    }

    /**
     * Get email of a user from his ID
     *
     * @param  int     $uid containing the userID
     *
     * @return string  email of the user
     */
    protected function _getEmail($uid) {
        $DB          = Database::singleton();
        $result      = $DB->pselectOne(
            "SELECT Email FROM users WHERE ID=:uid",
            array("uid"=>$uid)
        );
        return $result;
    }

    /**
     * Get phone number of a user from his ID
     *
     * @param  int     $uid containing the userID
     *
     * @return string  Phone number of the user
     */
    protected function _getPhone($uid) {
        $DB          = Database::singleton();
        $result      = $DB->pselectOne(
            "SELECT Phone FROM users WHERE ID=:uid",
            array("uid"=>$uid)
        );

        return $result;
    }

    abstract function notify();

}