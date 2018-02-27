CREATE TABLE `process_label` (
  `Label` varchar(100) NOT NULL,
  `ProcessLabelID` int(10) unsigned NOT NULL auto_increment,
  PRIMARY KEY (`Label`), 
  KEY `idx_auto_increment` (`ProcessLabelID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO process_label (`Label`) SELECT DISTINCT `type` FROM server_processes;
INSERT INTO process_label (`Label`) VALUES ('internal tool');

ALTER TABLE server_processes 
  ADD COLUMN `ProcessLabelID` int(10) unsigned NOT NULL AFTER `id`; 

UPDATE server_processes spi
  SET sp.ProcessLabelID = (SELECT pl.ProcessLabelID FROM process_label pl WHERE pl.Label = sp.type);

ALTER TABLE server_processes
  ADD FOREIGN KEY `FK_ProcessLabelID` (`ProcessLabelID`) 
  REFERENCES `process_label` (`ProcessLabelID`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE;
