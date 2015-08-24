
-- create database dgpath;
grant all on dgpath.* to gpp8p@'localhost' identified by 'kal1ca7';
grant all on dgpath.* to gpp8p@'127.0.0.1' identified by 'kal1ca7';

use dgpath;

-- Make the tables

-- dgpath_user_events records events an agent generates while traversing the graph
drop table if exists dgpath_user_events;
create table dgpath_user_events(
    id            MEDIUMINT NOT NULL AUTO_INCREMENT,
    user_id       MEDIUMINT NOT NULL,
    event_id      MEDIUMINT NOT NULL,
    traversal_id  MEDIUMINT NOT NULL,
    event_time    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    detail        TEXT,
    FOREIGN KEY(event_id) references dgpath_events(id),
    FOREIGN KEY(traversal_id) references dgpath_agent_traversal(id),
    FOREIGN KEY(user_id) references dgpath_user(id);
    PRIMARY KEY (id)
);

drop table if exists dgpath_user;
create table dgpath_user(
    id            MEDIUMINT NOT NULL AUTO_INCREMENT,
    user_eid      varchar(64) NOT NULL,
    password      varchar(128) NOT NULL,
    last_name     varchar(128),
    first_name    varchar(128),
    PRIMARY KEY (id)
);

drop table if exists dgpath_role;
create table dgpath_role(
     id           MEDIUMINT NOT NULL AUTO_INCREMENT,
     label        VARCHAR(128),
     PRIMARY KEY (id)
);


drop table if exists dgpath_project_has_role;
create table dgpath_in_role(
    id            MEDIUMINT NOT NULL AUTO_INCREMENT,
    project_id    MEDIUMINT NOT NULL,
    role_id       MEDIUMINT NOT NULL,
    FOREIGN KEY(project_id) references dgpath_project(id),
    FOREIGN KEY(role_id) references dgpath_role(id),
    PRIMARY KEY (id)
);

drop table if exists dgpath_user_in_project;
create table dgpath_user_in_project(
    id            MEDIUMINT NOT NULL AUTO_INCREMENT,
    user_id       MEDIUMINT NOT NULL,
    project_id    MEDIUMINT NOT NULL,
    FOREIGN KEY(user_id) references dgpath_user(id),
    FOREIGN KEY(project_id) references dgpath_project(id),
    PRIMARY KEY (id)
);

drop table if exists dgpath_user_in_project_has_role;
create table dgpath_user_in_project_has_role(
     id           MEDIUMINT NOT NULL AUTO_INCREMENT,
     uip_id       MEDIUMINT NOT NULL,
     role_id      MEDIUMINT NOT NULL,
     FOREIGN KEY(uip_id) references dgpath_user_in_project(id),
     FOREIGN KEY(role_id) references dgpath_role(id),
     PRIMARY KEY (id)
);

drop table if exists dgpath_permission;
create table dgpath_permission(
    id            MEDIUMINT NOT NULL AUTO_INCREMENT,
    label         VARCHAR(128),
    PRIMARY KEY (id)
);

insert into dgpath_permission (label) values ("Author Project");
insert into dgpath_permission (label) values ("Navigate Project");
insert into dgpath_permission (label) values ("Library Permissions");

drop table if exists dgpath_has_role_has_permission;
create table dgpath_has_role_has_permission(
    id            MEDIUMINT NOT NULL AUTO_INCREMENT,
    permission_id MEDIUMINT NOT NULL,
    proj_has_role_id    MEDIUMINT NOT NULL,
    FOREIGN KEY(permission_id) references dgpath_permission(id),
    FOREIGN KEY(proj_has_role_id) references dgpath_project_has_role(id),
    PRIMARY KEY (id)
);

drop table if exists dgpath_group;
create table dgpath_group(
    id              MEDIUMINT NOT NULL AUTO_INCREMENT,
    label           VARCHAR(128),
    PRIMARY KEY (id)
);

drop table if exists dgpath_group_in_project;
create table dgpath_group_in_project(
    id              MEDIUMINT NOT NULL AUTO_INCREMENT,
    group_id        MEDIUMINT NOT NULL,
    project_id      MEDIUMINT NOT NULL,
    FOREIGN KEY(group_id) references dgpath_group(id),
    FOREIGN KEY(project_id) references dgpath_project(id),
    PRIMARY KEY (id)
);

drop table if exists dgpath_user_in_group;
create table dgpath_user_in_group(
    id              MEDIUMINT NOT NULL AUTO_INCREMENT,
    user_id         MEDIUMINT NOT NULL,
    group_id        MEDIUMINT NOT NULL,
    FOREIGN KEY(user_id) references dgpath_user(id),
    FOREIGN KEY(group_id) references dgpath_group(id),
    primary key(id)
);

-- represents a traversal of the graph by an agent
drop table if exists dgpath_agent_traversal;
create table dgpath_agent_traversal(
    id            MEDIUMINT NOT NULL AUTO_INCREMENT,
    session       varchar(128),
    user_id       MEDIUMINT NOT NULL,
    foreign key(user_id) references dgpath_user(id),
    primary KEY (id)
);

-- represents the possible events a given component might generate during an agent traversal
drop table if exists dgpath_events;
create table dgpath_events (
    id            MEDIUMINT NOT NULL AUTO_INCREMENT,
    component_id  MEDIUMINT NOT NULL,
    label         TEXT,
    uevent_query  TEXT,
    navigation    BOOLEAN,
    event_type    INT,
    show_sub      BOOLEAN,
    sub_param     varchar(255),
    elementId     varchar(40),
    FOREIGN KEY(component_id) references dgpath_component(id),
    PRIMARY KEY (id)
);

-- links an event that should be matched in order for a connection to be traversed
drop table if exists dgpath_rules;
create table dgpath_rules (
    id            MEDIUMINT NOT NULL AUTO_INCREMENT,
    event_id      MEDIUMINT NOT NULL,
    connection_id MEDIUMINT NOT NULL,
    necessary     BOOLEAN,
    necessary_ex  BOOLEAN,
    sufficient    BOOLEAN,
    sufficient_ex BOOLEAN,
    detail_re     TEXT,
    FOREIGN KEY (event_id) references dgpath_events(id),
    PRIMARY KEY (id),
    FOREIGN KEY (connection_id) references dgpath_connection(id)
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

-- a component
drop table if exists dgpath_component;
create table dgpath_component (
    id           MEDIUMINT NOT NULL AUTO_INCREMENT,
    type         CHAR(255) NULL,
    x            INT,
    y            INT,
    content      TEXT,
    context      MEDIUMINT NOT NULL,
    elementId     varchar(40),
    subcontext   MEDIUMINT,
    title        varchar(40),
    FOREIGN KEY(context) references dgpath_context(id),
    PRIMARY KEY (id)
);
CREATE INDEX elementId_index ON dgpath_component (elementId) USING BTREE;

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

-- an entry point for a whole graph context, which may contain 1-n subcontexts.
drop table if exists dgpath_project;
create table dgpath_project (
    id            MEDIUMINT NOT NULL AUTO_INCREMENT,
    owner_context MEDIUMINT,
    proj_name     varchar(255),
    PRIMARY KEY (id)
);
insert into dgpath_project(owner_context, proj_name) values(2,'gpp8p test project #1');
SET @last_id_in_dgpath_project = LAST_INSERT_ID();
insert into dgpath_context(title, project, parent, topcontext) values ("gpp8p test project #1 - entry", @last_id_in_dgpath_project,0,TRUE);
SET @last_id_in_dgpath_context = LAST_INSERT_ID();
INSERT INTO dgpath_component(type,x,y,context, title, content) values('entry_door', 50, 250, @last_id_in_dgpath_context,'Entrance', '');
SET @last_id_in_dgpath_component = LAST_INSERT_ID();
SET @thisDoorQuestion = "Context: gpp8p test project #1 entered by user";
SET @thisAnswerQuery = "SELECT dgpath_user_events.id from lpath_events, lpath_user_events where lpath_user_events.event_id=lpath_events.id and lpath_events.component_id=$componentLastItemID and lpath_events.event_type=$contextEntered";
SET @contextEntered = 10;
INSERT INTO dgpath_events(component_id, label, navigation, event_type, uevent_query) values (@last_id_in_dgpath_component,@thisDoorQuestion, TRUE, @contextEntered, @thisAnswerQuery);






