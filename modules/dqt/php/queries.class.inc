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
/*      
        $query = [
            'fields'  => [
                ['category' => 'demographics', 'field' => 'DoB', 'visits' => []],
                ['category' => 'demographics', 'field' => 'Sex', 'visits' => []],
            ],
            'filters' => [
                "type" => "group","operator" => "AND","items" => [
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
            ]
        ];
*/
        $db = $request->getAttribute('loris')->getDatabaseConnection();
        $userid = $request->getattribute('user')->getId();
        $rows = $db->pselect(
            '
             SELECT *
             FROM dqt_query
             WHERE creator_userid = :v_userid OR shared IS TRUE
            ',
            ['v_userid' => $userid]
        );
        
        $queries = array_reduce(
            $rows,
            function ($carry, $item) {
                $query = [
                    'hash' => $item['hash'],
                    'creationTimestamp' => $item['creation_timestamp'],
                    'query' => json_decode($item['content'])
                ];
                if (empty($item['name'])) {
                    $carry['history'][] = $query;
                    return $carry;
                }

                $query['name'] = $item['name'];

                if ($item['shared']) {
                    $carry['shared'][] = $item;
                    return $carry;
                }
                
                $carry['saved'][] = $item;
                return $carry;
            },
            ['history' => [], 'saved' => [], 'shared' => []]
        );

        return new \LORIS\Http\Response\JSON\OK($queries);
    }
}
