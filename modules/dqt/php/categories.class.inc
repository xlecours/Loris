<?php declare(strict_types=1);

namespace LORIS\dqt;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Server\RequestHandlerInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\dqt\CouchDBViewProvisioner;

class Categories implements RequestHandlerInterface
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
        $user = $request->getAttribute('user');

        // List all category and associated visit_labels
        // TODO :: categories view now emit([doc.Meta.DocType, doc.Meta.identifier[1]], null);
        $prov = new CouchDBViewProvisioner(
            'DQG-2.0',
            'categories',
            [   
                "reduce" => "true",
                'group_level' => 2,
                "include_docs" => "false"
            ]
        );
        $prov = $prov->withMapper(new CategoryMapper());
        $categories = array_reduce(
            iterator_to_array($prov->execute($user)),
            function ($carry, $item) {
                if (!isset($carry[$item['name']])) {
                    $carry[$item['name']] = [
                        'name'   => $item['name'],
                        'visits' => []
                    ];
                }
                $carry[$item['name']]['visits'][] = $item['visit'];
                return $carry;
            },
            []
        );

        // TODO :: This is not optimal. Single request or different endpoint for fields?
        // Add fields to the categories
        $categories = array_map(
            function($category) use ($user) {
                $category_name = $category['name'];
                $prov = new CouchDBViewProvisioner(
                    'DQG-2.0',
                    'datadictionary',
                    [
                        "reduce" => "false",
                        "include_docs" => "false",
                        "start_key" => "[\"$category_name\"]",
                        "end_key" => "[\"$category_name\", {}]"
                    ]
                );
                $prov = $prov->withMapper(new CategoryFieldsMapper());
                $category['fields'] = iterator_to_array($prov->execute($user));
                return $category;
            },
            $categories
        );

        return new \LORIS\Http\Response\JSON\OK([
            'categories' => array_values($categories)
        ]);
    }
}
