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
        $prov = new CouchDBViewProvisioner(
            'DQG-2.0',
            'datadictionary',
            [
                "reduce" => "false",
                "include_docs" => "false"
            ]
        );
        $prov = $prov->withMapper(new CategoryMapper());

        $user = $request->getAttribute('user');

        return new \LORIS\Http\Response\JSON\OK(iterator_to_array($prov->execute($user)));

        return new \LORIS\Http\Response\JSON\OK([
            [
                'name'=>'bmi',
                'visits' => [],
                'fields'=> [
                    ['name'=>'Administration','Type'=>'enum(\'None\', \'Partial\', \'All\')','Description'=>'Administration for bmi']
                ]
            ]
        ]);
    }
}
