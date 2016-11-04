<?php
class NotificationController
{
    private static $initialized = false;

    private static function initialize()
    {
        if (!self::$initialized) {
    	    self::$initialized = true;
        }
        return;
    }

    public function handleDatabaseEvent($table, $set, $where, $type)
    {
        self::initialize();
        var_dump($this);
    }
}
?>
