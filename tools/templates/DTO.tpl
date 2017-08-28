<?php echo '<?php';?> 
/**
 * LORIS DTO template
 *
 * Data Transfer Object (DTO).
 * It should be use to encapsulate all site related data and should
 * be used to transfer data between the application layer and the persistance
 * with minimal knowledge of what <?php echo $this->class_name; ?> does.
 */
<?php echo "namespace LORIS\Data\Models\TransferObjects;\n"; ?>

<?php echo "class $this->class_name extends \LORIS\Data\Models\TransferObject\n"; ?>
{
    /**
     * This data is directly mapped to the columns of database table.
     */
<?php
    array_walk($this->columns, function ($c) {
        echo "    private \$_$c;\n";
    });
?>

    // Getters and Setters
<?php
    array_walk($this->columns, function ($c) {
        echo "    public function get$c() {return \$this->_$c;}\n";
        echo "    public function set$c(\$$c) {\$this->_$c = \$$c;}\n";
    });
?>

    // Shortcut to avoid the use of setters during instanciation.
    private function _setAll(array &$allVals) {
<?php
    array_walk($this->columns, function ($c) {
        echo "        \$this->_$c = \$allVals['$c'];\n";
    });
?>
    }

    /**
     * Constructor
     */
    public function __construct(array &$allVals)
    {
        $this->_setAll($allVals);
    }

    public function __toString()
    {
        return json_encode($this->asArray());
    }

    public function asArray()
    {
        // get all object vars
        $vars = $this->model_variables ?? get_object_vars($this);

        // Remove the '_' prefix from the keys
        $new_keys = array_map(function($key) {return ltrim($key, '_'); }, array_keys($vars));

        return array_combine($new_keys, array_values($vars));
    }
}
