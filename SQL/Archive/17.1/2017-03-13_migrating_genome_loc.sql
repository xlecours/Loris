-- CNV
-- Add fields from genome_loc table
ALTER TABLE `CNV`
  ADD COLUMN `Chromosome` varchar(255) DEFAULT NULL,
  ADD COLUMN `Strand` varchar(255) DEFAULT NULL,
  ADD COLUMN `EndLoc` int(11) DEFAULT NULL,
  ADD COLUMN `Size` int(11) DEFAULT NULL,
  ADD COLUMN `StartLoc` int(11) DEFAULT NULL;

-- Fill thos fields
UPDATE CNV t JOIN genome_loc gl USING (GenomeLocID) set t.Chromosome = gl.Chromosome, t.Strand = gl.Strand, t.EndLoc = gl.EndLoc, t.Size = gl.Size, t.StartLoc = gl.StartLoc;

-- Remove the FOREIGN KEY using constraint name from infomration_schema.
SET @constraint_name = (SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS WHERE table_name = 'CNV' AND CONSTRAINT_SCHEMA = DATABASE() AND REFERENCED_TABLE_NAME = 'genome_loc');
SET @s = (SELECT IF(@constraint_name IS NULL,"SELECT 'There is not foreign key between CNV and genome_loc table' as Message",CONCAT("ALTER TABLE CNV DROP FOREIGN KEY ", @constraint_name)));
PREPARE stmt FROM @s;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Drop the reference column
ALTER TABLE CNV 
  DROP COLUMN GenomeLocID;


-- SNP
-- Add fields from genome_loc table
ALTER TABLE `SNP`
  ADD COLUMN `Chromosome` varchar(255) DEFAULT NULL,
  ADD COLUMN `Strand` varchar(255) DEFAULT NULL,
  ADD COLUMN `EndLoc` int(11) DEFAULT NULL,
  ADD COLUMN `Size` int(11) DEFAULT NULL,
  ADD COLUMN `StartLoc` int(11) DEFAULT NULL;

-- Fill thos fields
UPDATE SNP t JOIN genome_loc gl USING (GenomeLocID) set t.Chromosome = gl.Chromosome, t.Strand = gl.Strand, t.EndLoc = gl.EndLoc, t.Size = gl.Size, t.StartLoc = gl.StartLoc;

-- Remove the FOREIGN KEY using constraint name from infomration_schema.
SET @constraint_name = (SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS WHERE table_name = 'SNP' AND CONSTRAINT_SCHEMA = DATABASE() AND REFERENCED_TABLE_NAME = 'genome_loc');
SET @s = (SELECT IF(@constraint_name IS NULL,"SELECT 'There is not foreign key between SNP and genome_loc table' as Message",CONCAT("ALTER TABLE SNP DROP FOREIGN KEY ", @constraint_name)));
PREPARE stmt FROM @s;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Drop the reference column
ALTER TABLE SNP 
  DROP COLUMN GenomeLocID;

-- genomic_cpg_annotation
-- Add fields from genome_loc table
ALTER TABLE `genomic_cpg_annotation`
  ADD COLUMN `Chromosome` varchar(255) DEFAULT NULL,
  ADD COLUMN `Strand` varchar(255) DEFAULT NULL,
  ADD COLUMN `EndLoc` int(11) DEFAULT NULL,
  ADD COLUMN `Size` int(11) DEFAULT NULL,
  ADD COLUMN `StartLoc` int(11) DEFAULT NULL;

-- Fill thos fields
UPDATE genomic_cpg_annotation t JOIN genome_loc gl ON (location_id = GenomeLocID) set t.Chromosome = gl.Chromosome, t.Strand = gl.Strand, t.EndLoc = gl.EndLoc, t.Size = gl.Size, t.StartLoc = gl.StartLoc;

-- Remove the FOREIGN KEY using constraint name from infomration_schema.
SET @constraint_name = (SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS WHERE table_name = 'genomic_cpg_annotation' AND CONSTRAINT_SCHEMA = DATABASE() AND REFERENCED_TABLE_NAME = 'genome_loc');
SET @s = (SELECT IF(@constraint_name IS NULL,"SELECT 'There is not foreign key between genomic_cpg_annotation and genome_loc table' as Message",CONCAT("ALTER TABLE genomic_cpg_annotation DROP FOREIGN KEY ", @constraint_name)));
PREPARE stmt FROM @s;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Drop the reference column
ALTER TABLE genomic_cpg_annotation
  DROP COLUMN location_id;

