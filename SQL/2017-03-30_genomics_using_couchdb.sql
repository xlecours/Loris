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

CREATE TABLE `chromosome` (
  `ChromosomeID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) NOT NULL,
  `Code` varchar(100) NOT NULL,
  `ShortCode` varchar(50) DEFAULT NULL,
  `PLINKNumeric` tinyint(3) unsigned DEFAULT NULL,
  PRIMARY KEY (`Code`),
  KEY `IDX_chromosome_ChromosomeID` (`ChromosomeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO chromosome (Name, Code, ShortCode, PLINKNumeric) VALUES 
('Unknown', 'U', 'Unk', 0),
('Autosome 1', 'chr1', '1', 1),
('Autosome 2', 'chr2', '2', 2),
('Autosome 3', 'chr3', '3', 3),
('Autosome 4', 'chr4', '4', 4),
('Autosome 5', 'chr5', '5', 5),
('Autosome 6', 'chr6', '6', 6),
('Autosome 7', 'chr7', '7', 7),
('Autosome 8', 'chr8', '8', 8),
('Autosome 9', 'chr9', '9', 9),
('Autosome 10', 'chr10', '10', 10),
('Autosome 11', 'chr11', '11', 11),
('Autosome 12', 'chr12', '12', 12),
('Autosome 13', 'chr13', '13', 13),
('Autosome 14', 'chr14', '14', 14),
('Autosome 15', 'chr15', '15', 15),
('Autosome 16', 'chr16', '16', 16),
('Autosome 17', 'chr17', '17', 17),
('Autosome 18', 'chr18', '18', 18),
('Autosome 19', 'chr19', '19', 19),
('Autosome 20', 'chr20', '20', 20),
('Autosome 21', 'chr21', '21', 21),
('Autosome 22', 'chr22', '22', 22),
('Allosome X', 'chrX', 'X', 23),
('Allosome Y', 'chrY', 'Y', 24),
('Pseudo-autosomal region of X', 'chrXY', 'XY', 25),
('Mitochondrial', 'MT-dna', 'MT', 26);
