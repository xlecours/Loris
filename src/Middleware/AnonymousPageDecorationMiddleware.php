<?php
namespace LORIS\Middleware;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \Psr\Http\Server\MiddlewareInterface;
use \Psr\Http\Server\RequestHandlerInterface;

class AnonymousPageDecorationMiddleware implements MiddlewareInterface, MiddlewareChainer
{
    use MiddlewareChainerMixin;

    protected $JSFiles;
    protected $CSSFiles;
    protected $Config;
    protected $BaseURL;

    public function __construct(string $baseurl, \NDB_Config $config, array $JS, array $CSS) {
        $this->Config = $config;
        $baseurl = $config->getSetting('www')['url'];
        $this->JSFiles = array(
                  $baseurl . '/js/jquery/jquery-1.11.0.min.js',
                  $baseurl . '/js/helpHandler.js',
                  $baseurl . '/js/modernizr/modernizr.min.js',
                  $baseurl . '/js/polyfills.js',
                  $baseurl . '/js/react/react-with-addons.min.js',
                  $baseurl . '/js/react/react-dom.min.js',
                  $baseurl . '/js/jquery/jquery-ui-1.10.4.custom.min.js',
                  $baseurl . '/js/jquery.dynamictable.js',
                  $baseurl . '/js/jquery.fileupload.js',
                  $baseurl . '/bootstrap/js/bootstrap.min.js',
                  $baseurl . '/js/components/Breadcrumbs.js',
                  $baseurl . '/vendor/sweetalert/sweetalert.min.js',
         $baseurl . "/js/util/queryString.js",
         $baseurl . '/js/components/Form.js',
         $baseurl . '/js/components/Markdown.js',
        );
        $this->CSSFiles = array(
                  $baseurl . "/bootstrap/css/bootstrap.min.css",
                  $baseurl . "/bootstrap/css/custom-css.css",
                  $baseurl . "/js/jquery/datepicker/datepicker.css",
                  $baseurl . '/vendor/sweetalert/sweetalert.css',
        );
        $this->BaseURL = $baseurl;
    }

    /**
     * Displays a page to an anonymous (not logged in) user.
     *
     * @param array $get  The GET parameters from the request.
     * @param array $post The POST parameters from the request.
     *
     * @return string the page content
     */
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler) : ResponseInterface {
        // Basic page outline variables
        $tpl_data = array(
            'study_title' => $this->Config->getSetting('title'),
            'baseurl'     => $this->BaseURL,
            'currentyear' => date('Y'),
            'sandbox'     => ($this->Config->getSetting("sandbox") === '1'),
        );

        // I don't think anyone uses this. It's not really supported
        $tpl_data['css'] = $this->Config->getSetting('css');

        //Display the footer links, as specified in the config file
        $links =$this->Config->getExternalLinks('FooterLink');

        $tpl_data['links'] = array();
        foreach ($links as $label => $url) {
            $WindowName = md5($url);

            $tpl_data['links'][] = array(
                'url'        => $url,
                'label'      => $label,
                'windowName' => $WindowName,
            );
        }

        $undecorated = $handler->handle($request);
        // Finally, the actual content and render it..
        $tpl_data += array(
            'jsfiles'   => $this->JSFiles,
            'cssfiles'  => $this->CSSFiles,
            'workspace' => $undecorated->getBody(),
        );

        $smarty = new \Smarty_neurodb;
        $smarty->assign($tpl_data);

        return $undecorated->withBody(new \LORIS\Http\StringStream($smarty->fetch("public_layout.tpl")));
    }
}
