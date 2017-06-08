<?php
/**
 * This file contains an object value representation of a Study in LORIS
 *
 * PHP Version 7
 *
 * @category Core
 * @package  Loris
 * @author   xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

namespace LORIS\Core;

use LORIS\Core\OV;

/**
 * A class for stydy instances.
 *
 * @category Core
 * @package  Loris
 * @author   xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Study_OV extends OV
{
    protected $title = '';

    public function getTitle()
    {
        return $this->title;
    }

    public function setTitle($title)
    {
        $this->title = $title;
    }
}
