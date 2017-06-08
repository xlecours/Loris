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

namespace LORIS\Core
/**
 * A class for stydy instances.
 *
 * @category Core
 * @package  Loris
 * @author   xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Study_OV extends \OV
{
    protected $name = '';

    public function getName()
    {
        return $this->name;
    }

    public function setName($name)
    {
        $this->name = $name
    }
}
