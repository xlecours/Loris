<?php
namespace LORIS\phantom_pipeline;

require_once( __DIR__ . '/../../../vendor/autoload.php');

class Installer
{
    public function __construct(\Database $database)
    {
        $this->database = $database;
    }

    public function run(): void
    {
        // Add permission
        $stmt = $this->database->prepare(
            "
             INSERT IGNORE INTO permissions (code, description, categoryID)
               (SELECT 
                  'phantom_processing',
                  'Accessphantom_pipeline module',
                  pc.ID
                FROM
                  permissions_category pc 
                WHERE
                  pc.Description = 'Permission'
               )
            "
        );
        $this->database->execute($stmt, array(), array('nofetch' => true));
        $this->database->getLastInsertId();
        // Add configs_settings for cbrain_credential
        // CBRAIN_config
        $stmt = $this->database->prepare(
            "
             INSERT IGNORE INTO ConfigSettings (Name, Description, Visible, Label, OrderNumber)
               (SELECT 
                  'CBRAIN_configs',
                  'CBRAIN plateform connection requirements',
                  1,
                 'CBRAIN',
                  MAX(OrderNumber)+1
                FROM
                  ConfigSettings
                WHERE
                  Parent IS NULL
               )
            "
        );
        $this->database->execute($stmt, array(), array('nofetch' => true));
        
        // Add menu item
        // Notify user that they need to fill cbrain credentials
    }
}

$client = new \NDB_Client();
$client->makeCommandLine();
$client->initialize(__DIR__ . '/../../../project/config.xml');

$database = \Database::singleton();

(new Installer($database))->run();

