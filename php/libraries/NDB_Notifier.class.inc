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
class NDB_Notifier extends NDB_Notifier_Abstract
{
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
        parent::__construct($module_name,
            $operation_type,
            $extra_tpl_data=array()
        );
    }

    /**
     * Function to be overridden by module using the notification system
     *
     * @param string $custom_message message overriding module-defined message
     * @param bool   $adminNotifier  when true, sends notification as if
     *                  triggered by administrator not user.
     * @param array  $extra_tpl_data additional variables to be sent to the template.
     *
     * @return void
     */
    public function notify(
        $custom_message=null,
        $adminNotifier=false,
        $extra_tpl_data=array()
    ) {
        $this->_tpl_data = $this->_tpl_data + $extra_tpl_data;

        if (!empty($custom_message)) {
            $this->_template ="notifier_custom.tpl";
            $this->_tpl_data['custom_message'] =$custom_message;
        }
        if ($adminNotifier) {
            $this->_notifier =$this->_adminNotifier;
        }

        // Basic email handler
        if (!empty($this->_notified['basic_email'])) {
            $this->_sendEmails();
        }
    }

    /**
     * Send emails to concerned users.
     *
     * @return void
     *
     * TODO add validation for email sent/failed
     */
    private function _sendEmails()
    {
        foreach ($this->_notified['basic_email'] as $name=>$uid) {
            $this->_tpl_data['notified_user'] = $name;
            $this->_tpl_data['notifier_user'] =
                $this->_notifier['name'].' <'.$this->_notifier['email'].'>';
            $email=$this->_getEmail($uid);

            if ($this->_notifier['ID'] === $uid) {
                // TODO send confirmation email instead
            } else {
                error_log("NOTIFIED ->".$email);
                Email::send(
                    $email,
                    $this->_template,
                    $this->_tpl_data
                );
            }
        }
    }

    /**
     * Send sms to concerned users.
     *
     * @return void
     *
     * TODO add validation
     */
    private function _sendSMS()
    {

    }

    /**
     * Send phone call to concerned users.
     *
     * @return void
     *
     * TODO add validation
     */
    private function _sendPhone()
    {

    }
}