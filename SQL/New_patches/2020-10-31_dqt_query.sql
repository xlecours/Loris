CREATE TABLE `dqt_query` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `hash` char(40) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `content` text NOT NULL,
  `creation_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `creator_userid` int(10) unsigned DEFAULT NULL,
  `shared` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`hash`),
  KEY `U_dqt_query_1` (`id`),
  KEY `FK_dqt_query_1` (`creator_userid`),
  CONSTRAINT `FK_dqt_query_1` FOREIGN KEY (`creator_userid`) REFERENCES `users` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8mb4;

