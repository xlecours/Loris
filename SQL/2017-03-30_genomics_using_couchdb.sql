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
