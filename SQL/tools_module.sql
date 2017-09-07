CREATE TABLE `tool` (
  `tool_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `tool_name` varchar(255) NOT NULL,
  `descriptor_type` varchar(255) NOT NULL DEFAULT 'LorisForm',
  `descriptor` text NOT NULL, 
  PRIMARY KEY (`tool_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `staged_task` (
  `staged_task_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `tool_id` int(10) unsigned NOT NULL,
  `inputs` text,
  `creator_id` int(10) unsigned NOT NULL,
  `creation_date` timestamp,
  PRIMARY KEY (`staged_task_id`),
  KEY `FK_task_1` (`creator_id`),
  KEY `FK_task_2` (`tool_id`),
  CONSTRAINT `FK_creator` FOREIGN KEY (`creator_id`) REFERENCES `users` (`ID`),
  CONSTRAINT `FK_tool` FOREIGN KEY (`tool_id`) REFERENCES `tool` (`tool_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO tool (tool_name, descriptor) VALUE ('PCEV_Pipeline', '{}');

INSERT stage_task_dir into configs;

mkdir project/data/staged_tasks
sudo chown -R lorisadmin:www-data project/data/staged_tasks

