WARNINGS;
SET AUTOCOMMIT=0;
SET SQL_NOTES=0;
START TRANSACTION;

--
-- Table Definition
--
SELECT 'LorisMenuPermissions' as 'DROP table';
DROP TABLE IF EXISTS `LorisMenuPermissions`;

SELECT 'LorisMenu' as 'DROP table';
DROP TABLE IF EXISTS `LorisMenu`;

SELECT 'LorisMenu' as 'CREATE table';
CREATE TABLE `LorisMenu` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Parent` int(10) unsigned DEFAULT NULL,
  `Label` varchar(255) DEFAULT NULL,
  `Link` varchar(255) DEFAULT NULL,
  `Visible` enum('true','false') DEFAULT NULL,
  `OrderNumber` int(11) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `index3` (`Parent`,`Label`),
  KEY `fk_LorisMenu_1_idx` (`Parent`),
  CONSTRAINT `fk_LorisMenu_1` FOREIGN KEY (`Parent`) REFERENCES `LorisMenu` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

SELECT 'LorisMenuPermissions' as 'CREATE table';
CREATE TABLE `LorisMenuPermissions` (
  `MenuID` int(10) unsigned NOT NULL,
  `PermID` int(10) unsigned NOT NULL,
  PRIMARY KEY (`MenuID`,`PermID`),
  KEY `fk_LorisMenuPermissions_2` (`PermID`),
  CONSTRAINT `fk_LorisMenuPermissions_1` FOREIGN KEY (`MenuID`) REFERENCES `LorisMenu` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_LorisMenuPermissions_2` FOREIGN KEY (`PermID`) REFERENCES `permissions` (`permID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='If a user has ANY of the permissions for a module it will show up in their menu bar';

--
-- Data
--

SELECT 'Parent menu items' as 'Inserting data';
INSERT INTO LorisMenu (Label, OrderNumber) VALUES
     ('Candidate', 1),
     ('Clinical', 2),
     ('Imaging', 3),
     ('Reports', 4),
     ('Tools', 5),
     ('Admin', 6);

SELECT 'Candidate submenu items' as 'Inserting data';
INSERT INTO LorisMenu (Label, Link, Parent, OrderNumber) VALUES
    ('New Profile', 'new_profile/', (SELECT ID FROM LorisMenu as L WHERE Label='Candidate'), 1),
    ('Access Profile', 'candidate_list/', (SELECT ID FROM LorisMenu as L WHERE Label='Candidate'), 2);

SELECT 'Clinical submenu items' as 'Inserting data';
INSERT INTO LorisMenu (Label, Link, Parent, OrderNumber) VALUES
    ('Reliability', 'reliability/', (SELECT ID FROM LorisMenu as L WHERE Label='Clinical'), 1),
    ('Conflict Resolver', 'conflict_resolver/', (SELECT ID FROM LorisMenu as L WHERE Label='Clinical'), 2),
    ('Examiner', 'examiner/', (SELECT ID FROM LorisMenu as L WHERE Label='Clinical'), 3),
    ('Training', 'training/', (SELECT ID FROM LorisMenu as L WHERE Label='Clinical'), 4),
    ('Media', 'media/', (SELECT ID FROM LorisMenu as L WHERE Label='Clinical'), 5);

SELECT 'Imaging submenu items' as 'Inserting data';
INSERT INTO LorisMenu (Label, Link, Parent, OrderNumber) VALUES
    ('Radiological Reviews', 'final_radiological_review/', (SELECT ID FROM LorisMenu as L WHERE Label='Imaging'), 1),
    ('DICOM Archive', 'dicom_archive/', (SELECT ID FROM LorisMenu as L WHERE Label='Imaging'), 2),
    ('Imaging Browser', 'imaging_browser/', (SELECT ID FROM LorisMenu as L WHERE Label='Imaging'), 3),
    ('MRI Violated Scans', 'mri_violations/', (SELECT ID FROM LorisMenu as L WHERE Label='Imaging'), 4),
    ('Imaging Uploader', 'imaging_uploader/', (SELECT ID FROM LorisMenu as L WHERE Label='Imaging'), 5);

SELECT 'Reports submenu items' as 'Inserting data';
INSERT INTO LorisMenu (Label, Link, Parent, OrderNumber) VALUES
    ('Statistics', 'statistics/', (SELECT ID FROM LorisMenu as L WHERE Label='Reports'), 1),
    ('Data Query Tool', 'dataquery/', (SELECT ID FROM LorisMenu as L WHERE Label='Reports'), 2);

SELECT 'Tools submenu items' as 'Inserting data';
INSERT INTO LorisMenu (Label, Link, Parent, OrderNumber) VALUES
    ('Data Dictionary', 'datadict/', (SELECT ID FROM LorisMenu as L WHERE Label='Tools'), 1),
    ('Document Repository', 'document_repository/', (SELECT ID FROM LorisMenu as L WHERE Label='Tools'), 2),
    ('Data Integrity Flag', 'data_integrity_flag/', (SELECT ID FROM LorisMenu as L WHERE Label='Tools'), 3),
    ('Data Team Helper', 'data_team_helper/', (SELECT ID FROM LorisMenu as L WHERE Label='Tools'), 4),
    ('Instrument Builder', 'instrument_builder/', (SELECT ID FROM LorisMenu as L WHERE Label='Tools'), 5),
    ('Genomic Browser', 'genomic_browser/', (SELECT ID FROM LorisMenu as L WHERE Label='Tools'), 6),
    ('Data Release', 'data_release/', (SELECT ID FROM LorisMenu as L WHERE Label='Tools'), 7),
    ('Acknowledgements', 'acknowledgements/', (SELECT ID FROM LorisMenu as L WHERE Label='Tools'), 8),
    ('Issue Tracker', 'issue_tracker/', (SELECT ID FROM LorisMenu as L WHERE Label='Tools'), 9);

SELECT 'Admin submenu items' as 'Inserting data';
INSERT INTO LorisMenu (Label, Link, Parent, OrderNumber) VALUES
    ('User Accounts', 'user_accounts/', (SELECT ID FROM LorisMenu as L WHERE Label='Admin'), 1),
    ('Survey Module', 'survey_accounts/', (SELECT ID FROM LorisMenu as L WHERE Label='Admin'), 2),
    ('Help Editor', 'help_editor/', (SELECT ID FROM LorisMenu as L WHERE Label='Admin'), 3),
    ('Instrument Manager', 'instrument_manager/', (SELECT ID FROM LorisMenu as L WHERE Label='Admin'), 4),
    ('Configuration', 'configuration/', (SELECT ID FROM LorisMenu as L WHERE Label='Admin'), 5),
    ('Server Processes Manager', 'server_processes_manager/', (SELECT ID FROM LorisMenu as L WHERE Label='Admin'), 6);


SELECT 'New Profile' as 'Inserting LorisMenuPermissions';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='data_entry' AND m.Label='New Profile';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='access_all_profiles' AND m.Label='New Profile';

SELECT 'Access Profile' as 'Inserting LorisMenuPermissions';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='data_entry' AND m.Label='Access Profile';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='access_all_profiles' AND m.Label='Access Profile';

SELECT 'Reliability' as 'Inserting LorisMenuPermissions';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='user_accounts' AND m.Label='Reliability';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='reliability_edit_all' AND m.Label='Reliability';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='access_all_profiles' AND m.Label='Reliability';

SELECT 'Conflict Resolver' as 'Inserting LorisMenuPermissions';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='conflict_resolver' AND m.Label='Conflict Resolver';

SELECT 'Examiner' as 'Inserting LorisMenuPermissions';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='examiner_site' AND m.Label='Examiner';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='examiner_multisite' AND m.Label='Examiner';

SELECT 'Training' as 'Inserting LorisMenuPermissions';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='training' AND m.Label='Training';

SELECT 'Radiological Reviews' as 'Inserting LorisMenuPermissions';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='edit_final_radiological_review' AND m.Label='Radiological Reviews';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='view_final_radiological_review' AND m.Label='Radiological Reviews';

SELECT 'DICOM Archive' as 'Inserting LorisMenuPermissions';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='dicom_archive_view_allsites' AND m.Label='DICOM Archive';

SELECT 'Imaging Browser' as 'Inserting LorisMenuPermissions';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='imaging_browser_view_site' AND m.Label='Imaging Browser';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='imaging_browser_view_allsites' AND m.Label='Imaging Browser';

SELECT 'MRI Violated Scans' as 'Inserting LorisMenuPermissions';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='violated_scans_view_allsites' AND m.Label='MRI Violated Scans';

SELECT 'MRI Upload' as 'Inserting LorisMenuPermissions';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='imaging_uploader' AND m.Label='Imaging Uploader';

SELECT 'Statistics' as 'Inserting LorisMenuPermissions';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='data_entry' AND m.Label='Statistics';

SELECT 'Data Query Tool' as 'Inserting LorisMenuPermissions';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='data_dict_view' AND m.Label='Data Query Tool';

SELECT 'Data Dictionary' as 'Inserting LorisMenuPermissions';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='data_dict_view' AND m.Label='Data Dictionary';

SELECT 'Document Repository' as 'Inserting LorisMenuPermissions';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='document_repository_view' AND m.Label='Document Repository';

SELECT 'Data Integrity Flag' as 'Inserting LorisMenuPermissions';
INSERT INTO LorisMenuPermissions (MenuID, PermID) SELECT m.ID, p.PermID
    FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='data_integrity_flag' AND m.Label='Data Integrity Flag';

SELECT 'Data Team Helper' as 'Inserting LorisMenuPermissions';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='data_team_helper' AND m.Label='Data Team Helper';

SELECT 'Instrument Builder' as 'Inserting LorisMenuPermissions';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='instrument_builder' AND m.Label='Instrument Builder';

SELECT 'Genomic Browser' as 'Inserting LorisMenuPermissions';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='genomic_browser_view_site' AND m.Label='Genomic Browser';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='genomic_browser_view_allsites' AND m.Label='Genomic Browser';

SELECT 'User Accounts' as 'Inserting LorisMenuPermissions';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='user_accounts' AND m.Label='User Accounts';

SELECT 'Survey Module' as 'Inserting LorisMenuPermissions';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='user_accounts' AND m.Label='Survey Module';

SELECT 'Help Editor' as 'Inserting LorisMenuPermissions';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='context_help' AND m.Label='Help Editor';

SELECT 'Instrument Manager' as 'Inserting LorisMenuPermissions';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='superuser' AND m.Label='Instrument Manager';

SELECT 'Configuration' as 'Inserting LorisMenuPermissions';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='config' AND m.Label='Configuration';

SELECT 'Server Processes Manager' as 'Inserting LorisMenuPermissions';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='server_processes_manager' AND m.Label='Server Processes Manager';

SELECT 'Acknowledgement Generator' as 'Inserting LorisMenuPermissions';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='acknowledgements_view' AND m.Label='Acknowledgements';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='acknowledgements_edit' AND m.Label='Acknowledgements';

SELECT 'Data Query Tool' as 'Inserting LorisMenuPermissions';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='dataquery_view' AND m.Label='Data Query Tool';

SELECT 'Issue Tracker' as 'Inserting LorisMenuPermissions';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='issue_tracker_reporter' AND m.Label='Issue Tracker';

SELECT 'Media' as 'Inserting LorisMenuPermissions';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
   SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='media_read' AND m.Label='Media';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
   SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='media_write' AND m.Label='Media';

SELECT 'COMMIT' as 'Ending with';
COMMIT;
