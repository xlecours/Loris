<?php
namespace LORIS\phantom_pipeline;

require_once __DIR__ . '/../../../vendor/autoload.php';

class Installer
{
    const RED = '01;31m';

    public function __construct(\Database $database)
    {
        $this->database = $database;
    }

    public function run(): void
    {
        $this->database->beginTransaction();
        try {
            // Add permission
            $stmt = $this->database->prepare(
                "
                 INSERT IGNORE INTO permissions (code, description, categoryID)
                   (SELECT 
                      'phantom_processing',
                      'Access phantom_processing module',
                      pc.ID
                    FROM
                      permissions_category pc 
                    WHERE
                      pc.Description = 'Permission'
                   )
                "
            );
            $this->database->execute($stmt, array(), array('nofetch' => true));
            // Add permisisons to superuser
            $stmt = $this->database->prepare(
                'INSERT IGNORE INTO user_perm_rel (userID, permID) 
                   SELECT 
                     superusers.userID,
                     p.permID 
                   FROM 
                     (SELECT userID 
                      FROM user_perm_rel 
                      WHERE permID = (
                        SELECT permID 
                        FROM permissions 
                        WHERE code = "superuser"
                      )
                     ) as superusers,
                     permissions p
                   WHERE
                     p.code = "phantom_processing"'
            );
            $this->database->execute($stmt, array(), array('nofetch' => true));
            // Add menu item
            $stmt = $this->database->prepare(
                'INSERT IGNORE INTO LorisMenu
                   (Parent, Label, Link, visible, OrderNumber)
                   SELECT 
                     Parent,
                     "Phantom Processing",
                     "/phantom_processing",
                     "true",
                     MAX(OrderNumber)+1
                   FROM
                     LorisMenu
                   WHERE
                     Parent = (
                       SELECT ID 
                       FROM LorisMenu
                       WHERE Label = "Imaging"
                     )
                   GROUP BY Parent
                '
            );
            $this->database->execute($stmt, array(), array('nofetch' => true));

            $this->database->commit();
        } catch (\DatabaseException $e) {
            $this->database->rollBack();
            echo 'Error: ' . $e->getMessage() . "\n";
            echo "Aborting...\n";
            exit(1);
        }

        $permID = $this->database->pselectOne(
            'SELECT
               permID
             FROM
               permissions
             WHERE
               code = "phantom_processing"',
            array()
        );
        echo "Permissions `phantom_processing` has " .
            "permID $permID \033[0;32m[OK]\033[0m\n";

        $usernames = $this->database->pselect(
            'SELECT
               u.UserID
             FROM user_perm_rel upr
             LEFT JOIN users u
               ON (upr.userID = u.ID)
             LEFT JOIN permissions p
               ON (upr.permID = p.permID)
             WHERE p.code = "phantom_processing"',
            array()
        );
        echo 'Permission added to ' . implode(
            ', ',
            array_map(
                function ($row) {
                    return $row['UserID'];
                },
                $usernames
            )
        ) . " \033[0;32m[OK]\033[0m\n";

        $LorisMenuID = $this->database->pselectOne(
            'SELECT 
               ID
             FROM LorisMenu
             WHERE
               Label = "Phantom Processing" AND
               Parent = (SELECT ID FROM LorisMenu WHERE Label = "Imaging")',
            array()
        );
        echo "LorisMenu `Phantom Processing` has ID $LorisMenuID. " . 
            "Shown under 'Imaging' \033[0;32m[OK]\033[0m\n";

        // Notify user that they need to fill cbrain credentials
    }
}

$client = new \NDB_Client();
$client->makeCommandLine();
$client->initialize(__DIR__ . '/../../../project/config.xml');

$database = \Database::singleton();

(new Installer($database))->run();

