-- PRE-REQS
ALTER TABLE users ADD COLUMN `Phone` varchar(15) default NULL;


-- Associates modules with the service available for each
DROP TABLE IF EXISTS `notification_modules`;
CREATE TABLE `notification_modules` (
      `id` int(10) unsigned auto_increment NOT NULL,
      `module_name` varchar(100) NOT NULL,
      `operation_type` varchar(100) NOT NULL,
      `description` varchar(255) DEFAULT NULL,
      PRIMARY KEY (`id`),
      KEY (`module_name`),
      UNIQUE(module_name,operation_type)
) ENGINE=InnoDB DEFAULT CHARSET='utf8';

-- Associates modules with the service available for each
DROP TABLE IF EXISTS `notification_services`;
CREATE TABLE `notification_services` (
      `id` int(10) unsigned auto_increment NOT NULL,
      `service` VARCHAR(50) NOT NULL,
      PRIMARY KEY (`id`),
      UNIQUE(service)
) ENGINE=InnoDB DEFAULT CHARSET='utf8';

-- saves users preferences for notification type
DROP TABLE IF EXISTS `notification_modules_services_rel`;
CREATE TABLE `notification_modules_services_rel` (
      `module_id` int(10) unsigned NOT NULL,
      `service_id` int(10) unsigned NOT NULL,
      PRIMARY KEY (`module_id`,`service_id`),
      CONSTRAINT `FK_notification_modules_services_rel_1` FOREIGN KEY (`module_id`) REFERENCES `notification_modules` (`id`),
      CONSTRAINT `FK_notification_modules_services_rel_2` FOREIGN KEY (`service_id`) REFERENCES `notification_services` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET='utf8';

-- saves users preferences for notification type
DROP TABLE IF EXISTS `users_notifications_rel`;
CREATE TABLE `users_notifications_rel` (
      `user_id` int(10) unsigned NOT NULL,
      `module_id` int(10) unsigned NOT NULL,
      `service_id` int(10) unsigned NOT NULL,
      PRIMARY KEY (`user_id`,`module_id`,`service_id`),
      CONSTRAINT `FK_notifications_users_rel_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`ID`),
      CONSTRAINT `FK_notifications_users_rel_2` FOREIGN KEY (`module_id`) REFERENCES `notification_modules` (`id`),
      CONSTRAINT `FK_notifications_users_rel_3` FOREIGN KEY (`service_id`) REFERENCES `notification_services` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET='utf8';

-- basic notification service
INSERT INTO notification_services (service) VALUES
('email_text');

-- Pre-implemented notifications
INSERT INTO notification_modules (module_name, operation_type, description) VALUES
('media', 'upload', 'Media: new file uploaded'),
('media', 'download', 'Media: file downloaded'),
('document_repository', 'new_category', 'Document Repository: new category'),
('document_repository', 'delete', 'Document Repository: document deleted'),
('document_repository', 'edit', 'Document Repository: document edited');

-- Transfer Document repository notifications to new system
INSERT INTO users_notifications_rel SELECT u.ID, nm.id, ns.id FROM users u JOIN notification_modules nm JOIN notification_services ns WHERE nm.module_name='document_repository' AND ns.service='email_text' AND u.Doc_Repo_Notifications='Y';


