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

use LORIS\Core\Study_OV;

/**
 * A class to link the database to the application.
 *
 * @category Core
 * @package  Loris
 * @author   xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Study_DAO implements DAO
{

    private $_database;

    // contructor
    public function __construct()
    {
        $this->_database = \Database::singleton();
    }

    public function createValueObject(array $primary_key): OV
    {
          $study = new Study_OV();

          $values = $this->_database->pselectRow("
            SELECT 
              Value as title
            FROM
              Config c
            JOIN 
              ConfigSettings cs 
              ON (c.ConfigID = cs.ID)
            WHERE name = 'title'
          ",array());

          $study->setTitle($values['title']);

          return $study;
    }

    /**
     * Update the database with new values
     *
     * @param OV the modified object.
     *
     * @return void
     */
    public function updateValueObject(OV $modifiedObject)
    {
        $prep = $this->_database->prepare(
            "UPDATE 
               Config 
             JOIN
               ConfigSettings 
               ON (Config.ConfigID = ConfigSettings.ID)
             SET 
               Config.Value = :new_title
             WHERE
               ConfigSettings.Name = 'title'"
        );
        $this->_database->execute(
            $prep,
            array('new_title' => $modifiedObject->getTitle()),
            array('nofetch' => true)
        );
    }
}
