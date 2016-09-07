<?php
class NDB_Form_Game extends NDB_Form
{
    function game()
    {
        return true;
    }

    /**
     * Returns an ordered list of CSS dependencies that this page depends
     * on.  These will get loaded into the template in order, so that
     * interdependent files can be included in the correct order.
     *
     * @return array of strings with URLs to retrieve CSS resources
     */
    function getCSSDependencies()
    {
        $deps    = parent::getCSSDependencies();

        $factory = NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();

        return array_merge(
            $deps,
            array(
                $baseURL . "/game/css/game.css",
            )
        );
    }

    /**
     * Include the React Genomic Application and the columnFormaters
     * for DynamicDataTables
     *
     * @return array of javascript files to be inserted
     */
    function getJSDependencies()
    {
        $factory = NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            array(
                $baseURL . "/game/js/game.js",
            )
        );
    }
}
?>
