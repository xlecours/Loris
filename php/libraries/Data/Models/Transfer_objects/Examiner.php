<?php 
/**
 * LORIS DTO template
 *
 * Data Transfer Object (DTO).
 * It should be use to encapsulate all site related data and should
 * be used to transfer data between the application layer and the persistance
 * with minimal knowledge of what Examiner does.
 */
namespace LORIS\Data\Models\TransferObjects;

class Examiner extends \LORIS\Data\Models\TransferObject
{
    /**
     * This data is directly mapped to the columns of database table.
     */
    private $_examinerID;
    private $_full_name;
    private $_radiologist;
    private $_userID;

    // Getters and Setters
    public function getexaminerID() {return $this->_examinerID;}
    public function setexaminerID($examinerID) {$this->_examinerID = $examinerID;}
    public function getfull_name() {return $this->_full_name;}
    public function setfull_name($full_name) {$this->_full_name = $full_name;}
    public function getradiologist() {return $this->_radiologist;}
    public function setradiologist($radiologist) {$this->_radiologist = $radiologist;}
    public function getuserID() {return $this->_userID;}
    public function setuserID($userID) {$this->_userID = $userID;}

    // Shortcut to avoid the use of setters during instanciation.
    private function _setAll(array &$allVals) {
        $this->_examinerID = $allVals['examinerID'];
        $this->_full_name = $allVals['full_name'];
        $this->_radiologist = $allVals['radiologist'];
        $this->_userID = $allVals['userID'];
    }

    /**
     *
     */
    public function getPrimaryKey()
    {
        $keys = array(
            'examinerID' => $this->_examinerID,
        );
    }

    /**
     * Constructor
     */
    public function __construct(array &$allVals)
    {
        $this->_setAll($allVals);
    }

    /**
     * The __toString() method allows a class to decide how it will react when it
     * is treated like a string. For example, what echo $obj; will print. This
     * method must return a string, as otherwise a fatal E_RECOVERABLE_ERROR level
     * error is emitted. 
     *
     * @note You cannot throw an exception from within a __toString() method. Doing
     *       so will result in a fatal error. 
     *
     * @return string A string representation of the object.
     */
    public function __toString()
    {
        try {
            return json_encode($this->asArray());
        } catch (Exception $e) {
            trigger_error($e->getMessage(), E_RECOVERABLE_ERROR);
        }
    }

    /**
     * This methods return an array representation of the object. This object
     * properties can be white listed using the model_variables properties.
     *
     * @return array An array representation of the object
     */
    public function asArray()
    {
        // get all object vars
        $vars = $this->model_variables ?? get_object_vars($this);

        // Remove the '_' prefix from the keys
        $new_keys = array_map(function($key) {return ltrim($key, '_'); }, array_keys($vars));

        return array_combine($new_keys, array_values($vars));
    }
}
