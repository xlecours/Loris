-- Add the after to make sure that the column order are the same
ALTER TABLE genomic_files ADD COLUMN `couchdb_doc_id` varchar(255) DEFAULT NULL;
CREATE TABLE fileset ( `fileset_id` INT UNSIGNED NOT NULL AUTO_INCREMENT, `origin` varchar(255), `timestamp_added` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (`fileset_id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8;
-- Add the after to make sure that the column order are the same
ALTER TABLE genomic_files ADD COLUMN `fileset_id` INT UNSIGNED DEFAULT NULL;
ALTER TABLE genomic_files ADD CONSTRAINT `genomic_files_ibfk_2` FOREIGN KEY (`fileset_id`) REFERENCES `fileset` (`fileset_id`);
-- Add the foreign key between genomic_files.format and genomic_file_format ('Sample Sheet' , 'Dataframe', 'Matrix', 'Variable Annotations')

-- Move the Genomics Browser into The main menu bar
UPDATE LorisMenu SET OrderNumber = OrderNumber + 1 WHERE OrderNumber > 3 AND Parent is null;
INSERT INTO LorisMenu (Label,OrderNumber) VALUE ('Genomics',4);
SET @Parent_ID = (select ID FROM LorisMenu where Parent IS NULL AND Label = 'Genomics');
INSERT INTO LorisMenu (Parent,Label,Link, OrderNumber) VALUE (@Parent_ID, 'Genomic Browser', 'genomic_browser/', 1), (@Parent_ID, 'Genomic Uploader', 'genomic_uploader/', 2), (@Parent_ID, 'Genomic Viewer', 'genomic_viewer/', 3);

CREATE TABLE `genomic_file_format` (genomic_file_format_id int(10) unsigned NOT NULL AUTO_INCREMENT, format varchar(255) NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `genomic_files` 
ADD COLUMN `genomic_file_format_id` INT UNSIGNED NULL DEFAULT NULL AFTER `fileset_id`,
ADD INDEX `fk_genomic_files_1_idx` (`genomic_file_format_id` ASC);

ALTER TABLE `genomic_files` 
ADD CONSTRAINT `fk_genomic_files_1`
  FOREIGN KEY (`genomic_file_format_id`)
  REFERENCES `genomic_file_format` (`genomic_file_format_id`)
  ON DELETE RESTRICT
  ON UPDATE CASCADE;

CREATE TABLE `fileset_role` (
  `fileset_role_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `description` TEXT NULL,
  PRIMARY KEY (`name`),
  INDEX `index2` (`fileset_role_id` ASC));

INSERT INTO `fileset_role` (`name`, `description`) VALUES ('data-value', 'This file contains the actual values of this dataset');
INSERT INTO `fileset_role` (`name`, `description`) VALUES ('variable-annotations', 'This file contain annotations for variables in the data-value file');
INSERT INTO `fileset_role` (`name`, `description`) VALUES ('sample-mapping', 'This file is the mapping between the sample labels in the data-values and the candidates in LORIS');
INSERT INTO `fileset_role` (`name`, `description`) VALUES ('provenance', 'This file contains informations about the provenance of the fileset');

ALTER TABLE `genomic_files` 
ADD COLUMN `fileset_role_id` INT(10) UNSIGNED NULL DEFAULT NULL AFTER `fileset_id`;

ALTER TABLE `genomic_files` 
ADD INDEX `fk_genomic_files_2_idx` (`fileset_role_id` ASC);
ALTER TABLE `genomic_files` 
ADD CONSTRAINT `fk_genomic_files_2`
  FOREIGN KEY (`fileset_role_id`)
  REFERENCES `fileset_role` (`fileset_role_id`)
  ON DELETE RESTRICT
  ON UPDATE CASCADE;
