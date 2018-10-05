<?php
/**
 * This endpoint return a list of userfiles from cbrain
 * It tries to connect using the configs credentials
 */
namespace LORIS\phantom_processing;

use \Psr\Http\Server\RequestHandlerInterface;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

class CBRAIN implements RequestHandlerInterface
{
    public function _hasAccess()
    {
        return (\User::singleton())->hasPermission('phantom_processing');
    }

    public function process(ServerRequestInterface $request,
        RequestHandlerInterface $handler
    ) : ResponseInterface {

        return $this->handle($request);
    }

    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $cbrainapi = \LORIS\CBRAIN_Hook::getInstance();

        $dataproviders = $cbrainapi->getInputDataProvider();
        $fileinfos = array_map(
            function ($dp) use ($cbrainapi) {
                $obj = array(
                    'dp'=>(string) $dp,
                    'files'=>array_map(
                        function ($f) {
                            return (string) $f;
                        },
                        $cbrainapi->getUserfilesFromDataProvider($dp->getId())
                    )
                );
                return $obj;
            },
            $dataproviders
        );

        return (new \Zend\Diactoros\Response())
            ->withBody(
                new \LORIS\Http\StringStream(json_encode($fileinfos, JSON_FORCE_OBJECT))
            );
    }

}
