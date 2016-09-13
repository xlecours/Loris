ALTER TABLE SNP 
ADD COLUMN `MinorAllele` enum('A','C','T','G') DEFAULT NULL AFTER `ReferenceBase`;

ALTER TABLE SNP_candidate_rel
CHANGE COLUMN `ObservedBase` `AlleleA` ENUM('A','C','T','G') NULL DEFAULT NULL ,
ADD COLUMN `RelationID` BIGINT NOT NULL AUTO_INCREMENT FIRST,
ADD COLUMN `AlleleB` ENUM('A','C','T','G') NULL DEFAULT NULL AFTER `AlleleA`,
DROP PRIMARY KEY,
ADD PRIMARY KEY (`RelationID`);

ALTER TABLE `epigenomics`.`SNP_candidate_rel` 
ADD CONSTRAINT `fk_SNP_candidate_rel_1`
  FOREIGN KEY (`SNPID`)
  REFERENCES `epigenomics`.`SNP` (`SNPID`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;
