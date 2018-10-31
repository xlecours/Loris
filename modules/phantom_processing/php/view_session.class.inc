<?php

/**
 * This class features the code for the menu portion
 * of the Loris phantom processing module
 *
 * PHP Version 7
 *
 * @category Processing
 * @package  imaging
 * @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
namespace LORIS\phantom_processing;

use \Psr\Http\Server\RequestHandlerInterface;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * Provides the PHP code for the menu filter of that module
 *
 * @category Processing
 * @package  imaging
 * @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
class View_Session extends \NDB_Page
{

    public $skipTemplate = true;

    /**
     * Overrides base getJSDependencies() to add support for dicom specific
     * React column formatters.
     *
     * @return array of extra JS files that this page depends on
     */
    public function getJSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            array(
             $baseURL . '/js/components/LaunchPhantomPipelineButton.js',
             $baseURL . '/imaging_browser/js/ImagePanel.js',
             $baseURL . '/phantom_processing/js/view_session.js',
            )
        );
    }

}
