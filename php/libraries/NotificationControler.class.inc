<?php

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

class NotificationControler implements MessageComponentInterface
{
    protected $clients;
    protected $events;

    public function __construct() 
    {
        $this->clients = new \SplObjectStorage;
        $this->events  = $this->_getEventList();
    }

    public function onOpen(ConnectionInterface $conn) 
    {
        //store the new connection
        $this->clients->attach($conn);
        echo "someone connected\n";
    }

    public function onMessage(ConnectionInterface $from, $msg) 
    {
        //send the message to all the other clients except the one who sent.
        foreach ($this->clients as $client) {
            if ($from !== $client) {
                $client->send($msg);
            }
        }
    }

    public function onClose(ConnectionInterface $conn) 
    {
        $this->clients->detach($conn);
        echo "someone has disconnected";
    }

    public function onError(ConnectionInterface $conn, \Exception $e) 
    {
        echo "An error has occurred: {$e->getMessage()}\n";
        $conn->close();
    }

    public function handleDatabaseEvent($table, $set, $where, $type)
    {
        error_log(print_r($table,true));
        error_log(print_r($set,true));
        error_log(print_r($where,true));
        error_log(print_r($type,true));
        if ($table == 'a') {
            foreach ($this->clients as $client) {
                $client->send($msg);
            }
        }
    }

    private function _getEventList()
    {
        return array();
    }
}
?>
