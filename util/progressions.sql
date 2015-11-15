-- create database progressions

-- grant all on progressions.* to gpp8p@'localhost' identified by 'kal1ca7';
-- grant all on progressions.* to gpp8p@'127.0.0.1' identified by 'kal1ca7';

use progressions;



drop table if exists dgpath_user;
create table dgpath_user(
    id            MEDIUMINT NOT NULL AUTO_INCREMENT,
    user_eid      varchar(64) NOT NULL,
    password      varchar(128) NOT NULL,
    last_name     varchar(128),
    first_name    varchar(128),
    PRIMARY KEY (id)
);

-- represents a traversal of the graph by an agent
drop table if exists dgpath_agent_traversal;
create table dgpath_agent_traversal(
    id            MEDIUMINT NOT NULL AUTO_INCREMENT,
    session       varchar(128),
    user_id       MEDIUMINT NOT NULL,
    login_time    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    foreign key(user_id) references dgpath_user(id),
    primary KEY (id)
);
CREATE INDEX session_index ON dgpath_agent_traversal (session) USING BTREE;

-- represents a group
drop table if exists dgpath_group;
create table dgpath_group(
    id              MEDIUMINT NOT NULL AUTO_INCREMENT,
    label           VARCHAR(128),
    group_type      MEDIUMINT NOT NULL,
    PRIMARY KEY (id)
);

drop table if exists dgpath_group_type;
create table dgpath_group_type (
  id              MEDIUMINT NOT NULL AUTO_INCREMENT,
  label           VARCHAR(128),
  PRIMARY KEY (id)
);

insert into dgpath_group_type (label) values("homegroup");
insert into dgpath_group_type (label) values("navgroup");
insert into dgpath_group_type (label) values("permgroup");

-- represents membership of a user in a group
drop table if exists dgpath_user_in_group;
create table dgpath_user_in_group(
    id              MEDIUMINT NOT NULL AUTO_INCREMENT,
    user_id         MEDIUMINT NOT NULL,
    group_id        MEDIUMINT NOT NULL,
    FOREIGN KEY(user_id) references dgpath_user(id),
    FOREIGN KEY(group_id) references dgpath_group(id),
    primary key(id)
);

drop table if exists dgpath_permission;
create table dgpath_permission(
    id            MEDIUMINT NOT NULL AUTO_INCREMENT,
    label         VARCHAR(128),
    PRIMARY KEY (id)
);

-- an entry point for a whole graph context, which may contain 1-n subcontexts.
drop table if exists dgpath_project;
create table dgpath_project (
    id            MEDIUMINT NOT NULL AUTO_INCREMENT,
    proj_name     varchar(255),
    description   TEXT,
    PRIMARY KEY (id)
);

-- a canvas upon which components and links may be placed.  All contexts have one entry point, and 1-n exits
drop table if exists dgpath_context;
create table dgpath_context (
    id            MEDIUMINT NOT NULL AUTO_INCREMENT,
    title        varchar(40),
    project       MEDIUMINT NOT NULL,
    parent        MEDIUMINT NOT NULL,
    topcontext    BOOLEAN,
    FOREIGN KEY(project) references dgpath_project(id),
    PRIMARY KEY (id)
);

-- a component
drop table if exists dgpath_component;
create table dgpath_component (
    id           MEDIUMINT NOT NULL AUTO_INCREMENT,
    type         CHAR(255) NULL,
    x            INT,
    y            INT,
    content      TEXT,
    context      MEDIUMINT NOT NULL,
    subcontext   MEDIUMINT,
    title        varchar(40),
    elementId     varchar(40),
    FOREIGN KEY(context) references dgpath_context(id),
    PRIMARY KEY (id)
);

-- links one component to another offering a potential traversal path
drop table if exists dgpath_connection;
create table dgpath_connection (
     id           MEDIUMINT NOT NULL AUTO_INCREMENT,
     start_id     MEDIUMINT NOT NULL,
     end_id       MEDIUMINT NOT NULL,
     go_ahead     BIT,
     FOREIGN KEY(start_id) references dgpath_component(id),
     rule         text,
     PRIMARY KEY (id)
 );

-- represents the possible events a given component might generate during an agent traversal
drop table if exists dgpath_events;
create table dgpath_events (
    id            MEDIUMINT NOT NULL AUTO_INCREMENT,
    component_id  MEDIUMINT NOT NULL,
    label         VARCHAR(128),
    uevent_query  TEXT,
    navigation    BOOLEAN,
    event_type    INT,
    show_sub      BOOLEAN,
    sub_param     varchar(255),
    elementId     varchar(40),
    FOREIGN KEY(component_id) references dgpath_component(id),
    PRIMARY KEY (id)
);

-- dgpath_user_events records events an agent generates while traversing the graph
drop table if exists dgpath_user_events;
create table dgpath_user_events(
  id            MEDIUMINT NOT NULL AUTO_INCREMENT,
  component_id  MEDIUMINT NOT NULL,
  traversal_id  varchar(255) NOT NULL,
  event_type    MEDIUMINT NOT NULL,
  project_id    mediumint not null,
  event_time    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  user_id       MEDIUMINT NOT NULL,
  detail        TEXT,
  priority      MEDIUMINT,
  status        MEDIUMINT NOT NULL,
  submission_batch_id mediumint(9),
  FOREIGN KEY(component_id) references dgpath_component(id),
  FOREIGN KEY(traversal_id) references dgpath_agent_traversal(id),
  PRIMARY KEY (id)
);

-- links one component to another offering a potential traversal path
drop table if exists dgpath_connection;
create table dgpath_connection (
     id           MEDIUMINT NOT NULL AUTO_INCREMENT,
     start_id     MEDIUMINT NOT NULL,
     end_id       MEDIUMINT NOT NULL,
     go_ahead     BIT,
     FOREIGN KEY(start_id) references dgpath_component(id),
     rule         text,
     PRIMARY KEY (id)
 );

 -- links an event that should be matched in order for a connection to be traversed
drop table if exists dgpath_rules;
create table dgpath_rules (
    id            MEDIUMINT NOT NULL AUTO_INCREMENT,
    event_id      MEDIUMINT NOT NULL,
    connection_id MEDIUMINT NOT NULL,
    activate      MEDIUMINT NOT NULL,
    necessary     BOOLEAN,
    necessary_ex  BOOLEAN,
    sufficient    BOOLEAN,
    sufficient_ex BOOLEAN,
    detail_re     TEXT,
    FOREIGN KEY (event_id) references dgpath_events(id),
    PRIMARY KEY (id),
    FOREIGN KEY (connection_id) references dgpath_connection(id)
);

drop table if exists dgpath_cando_project;
create table dgpath_cando_project (
	id            MEDIUMINT NOT NULL AUTO_INCREMENT,
	project_id	  MEDIUMINT NOT NULL,
	group_id	  MEDIUMINT NOT NULL,
	permission_id MEDIUMINT NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (project_id) references dgpath_project(id),
	FOREIGN KEY (group_id) references dgpath_group(id),
	FOREIGN KEY (permission_id) references dgpath_permission(id)
);

drop table if exists dgpath_entity;
create table dgpath_entity (
	id            MEDIUMINT NOT NULL AUTO_INCREMENT,
	label         VARCHAR(128),
	component_id	  MEDIUMINT NOT NULL,
	FOREIGN KEY (component_id) references dgpath_component(id),
	PRIMARY KEY (id)
);

drop table if exists dgpath_usedby;

drop table if exists dgpath_entity_element;
create table dgpath_entity_element (
 	id            MEDIUMINT NOT NULL AUTO_INCREMENT,
 	entity_id	  MEDIUMINT NOT NULL,
 	type		  tinyint,
 	content		  TEXT,
 	FOREIGN KEY (entity_id) references dgpath_entity(id),
 	PRIMARY KEY (id)
 );

drop table if exists dgpath_partof;

drop table if exists dgpath_cando_entity;
create table dgpath_cando_entity (
	id            MEDIUMINT NOT NULL AUTO_INCREMENT,
	entity_id	  MEDIUMINT NOT NULL,
	group_id	  MEDIUMINT NOT NULL,
	permission_id MEDIUMINT NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (entity_id) references dgpath_entity(id),
	FOREIGN KEY (group_id) references dgpath_group(id),
	FOREIGN KEY (permission_id) references dgpath_permission(id)
);

 -- set up users gpp8p, user1, user2, user3, instructor2
insert into dgpath_user(user_eid, password, last_name, first_name) values ("gpp8p", "n1tad0g", "Pipkin", "George");
SET @gpp8p_id = LAST_INSERT_ID();
insert into dgpath_user(user_eid, password, last_name, first_name) values ("user1", "user1", "User", "One");
SET @user1_id = LAST_INSERT_ID();
insert into dgpath_user(user_eid, password, last_name, first_name) values ("user2", "user2", "User", "Two");
SET @user2_id = LAST_INSERT_ID();
insert into dgpath_user(user_eid, password, last_name, first_name) values ("instructor2", "instructor2", "Instructor", "Two");
SET @instructor2_id = LAST_INSERT_ID();
insert into dgpath_user(user_eid, password, last_name, first_name) values ("user3", "user3", "User", "Three");
SET @user3_id = LAST_INSERT_ID();

 -- establish personal groups for each of the above
insert into dgpath_group(label) values ("gpp8p");
set @gpp8p_group_id = LAST_INSERT_ID();
insert into dgpath_group(label) values ("user1");
set @user1_group_id = LAST_INSERT_ID();
insert into dgpath_group(label) values ("user2");
set @user2_group_id = LAST_INSERT_ID();
insert into dgpath_group(label) values ("instructor2");
set @instructor2_group_id = LAST_INSERT_ID();
insert into dgpath_group(label) values ("user3");
set @user3_group_id = LAST_INSERT_ID();

 -- put each individual id in their reepective personal group
insert into dgpath_user_in_group (user_id, group_id) values (@gpp8p_id, @gpp8p_group_id);
insert into dgpath_user_in_group (user_id, group_id) values (@user1_id, @user1_group_id);
insert into dgpath_user_in_group (user_id, group_id) values (@user2_id, @user2_group_id);
insert into dgpath_user_in_group (user_id, group_id) values (@instructor2_id, @instructor2_group_id);
insert into dgpath_user_in_group (user_id, group_id) values (@user3_id, @user3_group_id);

 -- set up author and navigate permissions
insert into dgpath_permission (label) values("Author Project");
set @author_project_permission = LAST_INSERT_ID();
insert into dgpath_permission (label) values("Navigate Project");
set @navigate_project_permission = LAST_INSERT_ID();

 -- set up gpp8p test project #1
insert into dgpath_project(proj_name) values('gpp8p test project #1');
SET @last_id_in_dgpath_project = LAST_INSERT_ID();

 -- set up an author group for gpp8p test project #1
insert into dgpath_group(label) values ("gpp8p test project #1 instructor group");
set @gpp8p_test_project1_instructor_group = LAST_INSERT_ID();

 -- set up a nav group for gpp8p test project #1
insert into dgpath_group(label) values ("gpp8p test project #1 student group");
set @gpp8p_test_project1_student_group = LAST_INSERT_ID();

 -- give the author group for gpp8p test project #1 authoring permissions
insert into dgpath_cando_project(project_id, group_id, permission_id) values (@last_id_in_dgpath_project, @gpp8p_test_project1_instructor_group, @author_project_permission );
 -- give the student group for gpp8p test project #1 nav permissions
insert into dgpath_cando_project(project_id, group_id, permission_id) values (@last_id_in_dgpath_project, @gpp8p_test_project1_student_group, @navigate_project_permission );

 -- put gpp8p in  author group for gpp8p test project #1
 insert into dgpath_user_in_group (user_id, group_id) values (@gpp8p_id, @gpp8p_test_project1_instructor_group);

 -- put user1, user2, and user3 in student group for gpp8p test project #1
insert into dgpath_user_in_group (user_id, group_id) values (@user1_id, @gpp8p_test_project1_student_group);
insert into dgpath_user_in_group (user_id, group_id) values (@user2_id, @gpp8p_test_project1_student_group);
insert into dgpath_user_in_group (user_id, group_id) values (@user3_id, @gpp8p_test_project1_student_group);

 -- set up top context for for gpp8p test project #1
insert into dgpath_context(title, project, parent, topcontext) values ("gpp8p test project #1 - entry", @last_id_in_dgpath_project,0,TRUE);
SET @last_id_in_dgpath_context = LAST_INSERT_ID();
INSERT INTO dgpath_component(type,x,y,context, title, content) values('entry_door', 50, 250, @last_id_in_dgpath_context,'Entrance', '');
SET @last_id_in_dgpath_component = LAST_INSERT_ID();
SET @thisDoorQuestion = "Context: gpp8p test project #1 entered by user";
SET @thisAnswerQuery = "SELECT dgpath_user_events.id from lpath_events, lpath_user_events where lpath_user_events.event_id=lpath_events.id and lpath_events.component_id=$componentLastItemID and lpath_events.event_type=$contextEntered";
SET @contextEntered = 10;
INSERT INTO dgpath_events(component_id, label, navigation, event_type, uevent_query) values (@last_id_in_dgpath_component,@thisDoorQuestion, TRUE, @contextEntered, @thisAnswerQuery);

insert into dgpath_project(proj_name) values('instructor2 test project #1');
SET @last_id_in_dgpath_project = LAST_INSERT_ID();

 -- set up an author group for instructor2 test project #1
insert into dgpath_group(label) values ("instructor2 test project #1 instructor group");
set @instructor2_test_project1_instructor_group = LAST_INSERT_ID();

 -- set up a nav group for instructor2 test project #1
insert into dgpath_group(label) values ("instructor2 test project #1 student group");
set @instructor2_test_project1_student_group = LAST_INSERT_ID();

 -- give the author group for instructor2 test project #1 authoring permissions
insert into dgpath_cando_project (project_id, group_id, permission_id) values (@last_id_in_dgpath_project, @instructor2_test_project1_instructor_group, @author_project_permission );
 -- give the student group for instructor2 test project #1 nav permissions
insert into dgpath_cando_project (project_id, group_id, permission_id) values (@last_id_in_dgpath_project, @instructor2_test_project1_student_group, @navigate_project_permission );

 -- put instructor2 in  author group for instructor2 test project #1
 insert into dgpath_user_in_group (user_id, group_id) values (@instructor2_id, @instructor2_test_project1_instructor_group);

 -- put user1, user2, and user3 in student group for instructor2 test project #1
insert into dgpath_user_in_group (user_id, group_id) values (@user1_id, @instructor2_test_project1_student_group);
insert into dgpath_user_in_group (user_id, group_id) values (@user2_id, @instructor2_test_project1_student_group);
insert into dgpath_user_in_group (user_id, group_id) values (@user3_id, @instructor2_test_project1_student_group);


 -- set up top context for for instructor2 test project #1
insert into dgpath_context(title, project, parent, topcontext) values ("instructor2 test project #1 - entry", @last_id_in_dgpath_project,0,TRUE);
SET @last_id_in_dgpath_context = LAST_INSERT_ID();
INSERT INTO dgpath_component(type,x,y,context, title, content) values('entry_door', 50, 250, @last_id_in_dgpath_context,'Entrance', '');
SET @last_id_in_dgpath_component = LAST_INSERT_ID();
SET @thisDoorQuestion = "Context: instructor2 test project #1 entered by user";
SET @thisAnswerQuery = "SELECT dgpath_user_events.id from lpath_events, lpath_user_events where lpath_user_events.event_id=lpath_events.id and lpath_events.component_id=$componentLastItemID and lpath_events.event_type=$contextEntered";
SET @contextEntered = 10;
INSERT INTO dgpath_events(component_id, label, navigation, event_type, uevent_query) values (@last_id_in_dgpath_component,@thisDoorQuestion, TRUE, @contextEntered, @thisAnswerQuery);




 -- verify author access to gpp8p test project #1 for gpp8p
select dgpath_project.proj_name, dgpath_project.id as proj_id, dgpath_context.id as context_id from dgpath_project, dgpath_group, dgpath_user_in_group, dgpath_user, dgpath_cando_project, dgpath_permission, dgpath_context
where dgpath_project.id = dgpath_cando_project.project_id
and dgpath_cando_project.group_id = dgpath_group.id
and dgpath_user_in_group.group_id = dgpath_group.id
and dgpath_user.id = dgpath_user_in_group.user_id
and dgpath_cando_project.permission_id = dgpath_permission.id
and dgpath_context.project = dgpath_project.id
and dgpath_context.topcontext=1
and dgpath_permission.label = "Author Project"
and dgpath_user.user_eid = "gpp8p";

 -- verify nav access to gpp8p test project #1 for user1
select dgpath_project.proj_name, dgpath_group.label from dgpath_project, dgpath_group, dgpath_user_in_group, dgpath_user, dgpath_cando_project, dgpath_permission
where dgpath_project.id = dgpath_cando_project.project_id
and dgpath_cando_project.group_id = dgpath_group.id
and dgpath_user_in_group.group_id = dgpath_group.id
and dgpath_user.id = dgpath_user_in_group.user_id
and dgpath_cando_project.permission_id = dgpath_permission.id
and dgpath_permission.label = "Navigate Project"
and dgpath_user.user_eid = "user1";




 -- verify author access to instructor2 test project #1
select dgpath_project.proj_name, dgpath_group.label from dgpath_project, dgpath_group, dgpath_user_in_group, dgpath_user, dgpath_cando_project, dgpath_permission
where dgpath_project.id = dgpath_cando_project.project_id
and dgpath_cando_project.group_id = dgpath_group.id
and dgpath_user_in_group.group_id = dgpath_group.id
and dgpath_user.id = dgpath_user_in_group.user_id
and dgpath_cando_project.permission_id = dgpath_permission.id
and dgpath_permission.label = "Author Project"
and dgpath_user.user_eid = "instructor2";







