<?php
/**
 * This file contains a centralized way of accessing DAOs
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
/**
 * A class for accessing DAOs
 *
 * @category Core
 * @package  Loris
 * @author   xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class LORIS_DAO_Factory
{

    public function __construct()
    {
    }

    /**
     * Get a Study DAO
     * @return Study_DAO
     */
    public function getStudyDao()
    {
        return new Study_DAO();
    }
}
