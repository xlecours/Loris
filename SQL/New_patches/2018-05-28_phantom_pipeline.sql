CREATE TABLE `server_process_type` (
  `ProcessTypeID` integer unsigned NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) NOT NULL,
  PRIMARY KEY (ProcessTypeID),
  UNIQUE (Name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8; 

INSERT INTO `server_process_type` (Name) VALUES 
  ('mri_upload'),
  ('lego_phantom_pipeline')
;

ALTER TABLE `server_processes` ADD COLUMN
  `ProcessTypeID` integer unsigned NOT NULL AFTER `id`;

UPDATE `server_processes` SET `ProcessTypeID` = (
  SELECT ProcessTypeID FROM `server_process_type` WHERE Name = 'mri_upload'
);

ALTER TABLE server_processes ADD CONSTRAINT
  FK_server_process_type_ProcessTypeID
  FOREIGN KEY (`ProcessTypeID`)
  REFERENCES `server_process_type` (`ProcessTypeID`);

ALTER TABLE `server_processes` DROP COLUMN `type`;

CREATE TABLE `session_server_processes_rel` (
  `sessionID` int(10) unsigned NOT NULL,
  `processID` int(11) unsigned NOT NULL,
  PRIMARY KEY (`sessionID`,`processID`),
  KEY `FK_server_process_ID` (`processID`),
  CONSTRAINT `FK_server_process_ID` FOREIGN KEY (`processID`) REFERENCES `server_processes` (`id`),
  CONSTRAINT `FK_session_ID` FOREIGN KEY (`sessionID`) REFERENCES `session` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

