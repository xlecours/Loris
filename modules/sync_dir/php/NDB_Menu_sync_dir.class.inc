<?php
/**
* The sync dir page
*
* PHP Version 5
*
* @category Main
* @package  sync_dir
* @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
* @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
* @link     https://www.github.com/aces/Loris/
*/

/**
 * Implements the candidate_list menu
 *
* @category Main
* @package  sync_dir
* @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
* @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
* @link     https://www.github.com/aces/Loris/
 */
class NDB_Menu_Sync_Dir extends NDB_Menu
{

    var $AjaxModule = true;

    /**
     * Overloading this method filter out users without permissions
     *
     * @note   overloaded function
     * @return bool
     */
    function _hasAccess()
    {
        // create user object
        $user = User::singleton();
        return $user->hasPermission('data_provider_manager');
    }

    /**
     * Create the html of the control panel
     *
     * @return HTML
     */
    function getControlPanel() {
//        var_dump("getControlPanel()");
/*
        $controlPanel = new Instrument_List_ControlPanel($_REQUEST['sessionID']);
        // save possible changes from the control panel...
        $success = $controlPanel->save();

        // display the control panel
        $html = $controlPanel->display();
        // I don't know why this is here, but it
        // was in main.php, so moved it to be safe.
        $timePoint =& TimePoint::singleton($_REQUEST['sessionID']);
        $timePoint->select($_REQUEST['sessionID']);
        return $html;
*/
        return "";
    }

    function getDirectorySignature($path)
    {
        $signature = null;
        if (is_dir($path)) {
             $content = array_filter( scandir($path), function ($item_name) {
                 // Skip hidden files
                 return ('.' !== substr($item_name, 0, 1));
             });
             
             // recursive call
             foreach($content as $item_name) {
                 $this->getDirectorySignature( "$path/$item_name" );
             }

             $command = "find -H $path -name \".*\" -prune -o -type f -exec md5sum {} \; | sort -k 2 | sed 's\\$path/\\\\;s\\  \\ \\' | md5sum";
             print_r($command);
             $result = array();
             exec($command, $result);
             $directory = array(
                 'md5_name' => hash('md5', $path),
                 'absolute_path' => $path,
                 'signature' => $result[0]
             );

             $DB     =& Database::singleton();
             $DB->insert('data_provider', $directory);
             $bob = $DB->pselect("SELECT * FROM data_provider where md5_name = :v_md5", array('v_md5' => hash('md5', $path)));
             var_dump($bob);

             print_r($directory);
             $signature = $directory['md5_name'];

        }
        return $signature;
    }

    /**
     * Calls other member functions to do all the work necessary to create the menu
     *
     * @note   overloaded function
     * @return void
     * @access public
     */
    function setup()
    {
        $dir = '/var/www/loris/project/data/data-provider';
        print_r($this->getDirectorySignature($dir));
/*
        $command = "find -H $dir -name \".*\" -prune -o -type f -exec md5sum {} \; | sort -k 2 | sed 's\\$dir/\\\\;s\\  \\ \\' | md5sum";
        $result = array();
        exec($command, $result);
        print_r($result);

        $start_memory = memory_get_usage();
        print_r("Start memory = " . $start_memory . "\n");
        
        $json  = join($result, ',');
        print_r("JSON content memory usage = " . (memory_get_usage() - $start_memory) . "\n");

        $DB     =& Database::singleton();
        $DB->insert('BOB', array('content' => $json));
        $bob = $DB->pselect("SELECT content FROM BOB", array());
        var_dump($bob);
*/
        return true;
    }

}
