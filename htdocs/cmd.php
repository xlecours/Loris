<?php
require '../vendor/autoload.php';
require '../php/libraries/NotificationControler.class.inc';

use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;

$server = IoServer::factory(
    new HttpServer(
        new WsServer(
            new NotificationControler()
        )
    ),
    8089
);

$server->run();
