<?php declare(strict_types=1);

namespace LORIS\dqt;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Server\RequestHandlerInterface;
use \Psr\Http\Message\ResponseInterface;

class Queries implements RequestHandlerInterface
{
    public function process(
        ServerRequestInterface $request,
        RequestHandlerInterface $handler
    ) : ResponseInterface {
        return $handler->handle($request);
    }

    public function _hasAccess(\User $user) : bool
    {
        return $user->hasPermission('dataquery_view');
    }

    public function loadResources(\User $user, ServerRequestInterface $request): void
    {
    }

    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        switch ($request->getMethod()) {
        case 'GET':
            return $this->_handleGET($request);
        default:
            return new \LORIS\Http\Response\JSON\NotImplemented();
        }
    }

    private function _handleGET(ServerRequestInterface $request) : ResponseInterface
    {
        $query = [
            'fields'  => [
                ['category' => 'demographics', 'field' => 'DoB', 'visits' => []],
                ['category' => 'demographics', 'field' => 'Sex', 'visits' => []],
            ],
            'filters' => [
                ["type" => "filter", "category" => "demographics", "field" => "Sex", "operator" => "equals", "value" => "Female"],
                [
                    "type" => "group",
                    "operator" => "OR",
                    "items" => [
                        ["type" => "filter", "category" => "demographics", "field" => "DoB", "operator" => "equals", "value" => "2016-05-12"],
                        ["type" => "filter", "category" => "demographics", "field" => "DoB", "operator" => "equals", "value" => "2016-04-12"],
                        ["type" => "filter", "category" => "demographics", "field" => "DoB", "operator" => "isNull", "value" => ""]
                    ]
                ]
            ]
        ];

        return new \LORIS\Http\Response\JSON\OK([
            'history' => [
                ['creationTimestamp' => 1603988337, 'query' => $query],
                ['creationTimestamp' => 1603988437, 'query' => $query],
                ['creationTimestamp' => 1603988537, 'query' => $query]
            ],
            'saved' => [
                ['id' => 1, 'name' => 'Query 1', 'shared' => False, 'creator' => 'admin', 'creationTimestamp' => 1603988337, 'query' => $query],
                ['id' => 2, 'name' => 'Query 2', 'shared' => False, 'creator' => 'admin', 'creationTimestamp' => 1603988437, 'query' => $query]
            ],
            'shared' => [
                ['id' => 3, 'name' => 'Query 3', 'shared' => True, 'creator' => 'admin', 'creationTimestamp' => 1603988537, 'query' => $query],
                ['id' => 4, 'name' => 'Query 4', 'shared' => True, 'creator' => 'admin', 'creationTimestamp' => 1603988637, 'query' => $query]
            ]
        ]);
    }
}
