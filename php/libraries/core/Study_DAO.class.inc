<?php
/**
 * This file contains an data access object representation of a Study in LORIS
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

use LORIS\Core\DAO;
/**
 * A class to link the database to the application.
 *
 * @category Core
 * @package  Loris
 * @author   xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Study_DAO extends DAO
{
    function createValueObject() {
          return new Study_OV();
    }
}
