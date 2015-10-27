CREATE TABLE `dgpath_agent_traversal` (
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `session` varchar(128) DEFAULT NULL,
  `user_id` mediumint(9) NOT NULL,
  `login_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `session_index` (`session`) USING BTREE
) ENGINE=MyISAM AUTO_INCREMENT=50 DEFAULT CHARSET=latin1;
CREATE TABLE `dgpath_cando_entity` (
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `entity_id` mediumint(9) NOT NULL,
  `group_id` mediumint(9) NOT NULL,
  `permission_id` mediumint(9) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `entity_id` (`entity_id`),
  KEY `group_id` (`group_id`),
  KEY `permission_id` (`permission_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
CREATE TABLE `dgpath_cando_project` (
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `project_id` mediumint(9) NOT NULL,
  `group_id` mediumint(9) NOT NULL,
  `permission_id` mediumint(9) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  KEY `group_id` (`group_id`),
  KEY `permission_id` (`permission_id`)
) ENGINE=MyISAM AUTO_INCREMENT=100 DEFAULT CHARSET=latin1;
CREATE TABLE `dgpath_component` (
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `type` char(255) DEFAULT NULL,
  `x` int(11) DEFAULT NULL,
  `y` int(11) DEFAULT NULL,
  `content` text,
  `context` mediumint(9) NOT NULL,
  `subcontext` mediumint(9) DEFAULT NULL,
  `title` varchar(40) DEFAULT NULL,
  `elementId` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `context` (`context`),
  KEY `elementId_index` (`elementId`) USING BTREE
) ENGINE=MyISAM AUTO_INCREMENT=1009 DEFAULT CHARSET=latin1;
CREATE TABLE `dgpath_connection` (
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `start_id` mediumint(9) NOT NULL,
  `end_id` mediumint(9) NOT NULL,
  `go_ahead` bit(1) DEFAULT NULL,
  `rule` text,
  PRIMARY KEY (`id`),
  KEY `start_id` (`start_id`)
) ENGINE=MyISAM AUTO_INCREMENT=641 DEFAULT CHARSET=latin1;
CREATE TABLE `dgpath_context` (
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `title` varchar(40) DEFAULT NULL,
  `project` mediumint(9) NOT NULL,
  `parent` mediumint(9) NOT NULL,
  `topcontext` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `project` (`project`)
) ENGINE=MyISAM AUTO_INCREMENT=191 DEFAULT CHARSET=latin1;
CREATE TABLE `dgpath_entity` (
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `label` varchar(128) DEFAULT NULL,
  `component_id` mediumint(9) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `component_id` (`component_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
CREATE TABLE `dgpath_entity_element` (
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `entity_id` mediumint(9) NOT NULL,
  `type` tinyint(4) DEFAULT NULL,
  `content` text,
  PRIMARY KEY (`id`),
  KEY `entity_id` (`entity_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
CREATE TABLE `dgpath_events` (
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `component_id` mediumint(9) NOT NULL,
  `label` varchar(128) DEFAULT NULL,
  `uevent_query` text,
  `navigation` tinyint(1) DEFAULT NULL,
  `event_type` int(11) DEFAULT NULL,
  `show_sub` tinyint(1) DEFAULT NULL,
  `sub_param` varchar(255) DEFAULT NULL,
  `elementId` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `component_id` (`component_id`)
) ENGINE=MyISAM AUTO_INCREMENT=2019 DEFAULT CHARSET=latin1;
CREATE TABLE `dgpath_group` (
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `label` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=197 DEFAULT CHARSET=latin1;
CREATE TABLE `dgpath_permission` (
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `label` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
CREATE TABLE `dgpath_project` (
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `proj_name` varchar(255) DEFAULT NULL,
  `description` text,
  `role_id` mediumint(9) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=121 DEFAULT CHARSET=latin1;
CREATE TABLE `dgpath_rules` (
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `event_id` mediumint(9) NOT NULL,
  `connection_id` mediumint(9) NOT NULL,
  `necessary` tinyint(1) DEFAULT NULL,
  `necessary_ex` tinyint(1) DEFAULT NULL,
  `sufficient` tinyint(1) DEFAULT NULL,
  `sufficient_ex` tinyint(1) DEFAULT NULL,
  `detail_re` text,
  `activate` mediumint(9) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `event_id` (`event_id`),
  KEY `connection_id` (`connection_id`)
) ENGINE=MyISAM AUTO_INCREMENT=451 DEFAULT CHARSET=latin1;
CREATE TABLE `dgpath_user` (
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `user_eid` varchar(64) NOT NULL,
  `password` varchar(128) NOT NULL,
  `last_name` varchar(128) DEFAULT NULL,
  `first_name` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
CREATE TABLE `dgpath_user_events` (
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `component_id` mediumint(9) NOT NULL,
  `event_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `user_id` mediumint(9) NOT NULL,
  `detail` text,
  `event_type` mediumint(9) NOT NULL,
  `project_id` mediumint(9) NOT NULL,
  `priority` mediumint(9) DEFAULT NULL,
  `status` mediumint(9) NOT NULL,
  `submission_batch_id` mediumint(9) DEFAULT NULL,
  `traversal_id` mediumint(9) NOT NULL,
  `atten_to` mediumint(9) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `component_id` (`component_id`)
) ENGINE=MyISAM AUTO_INCREMENT=23 DEFAULT CHARSET=latin1;
CREATE TABLE `dgpath_user_in_group` (
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `user_id` mediumint(9) NOT NULL,
  `group_id` mediumint(9) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `group_id` (`group_id`)
) ENGINE=MyISAM AUTO_INCREMENT=112 DEFAULT CHARSET=latin1;
