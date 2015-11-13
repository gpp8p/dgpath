<?php
/**
 * Created by PhpStorm.
 * User: georgepipkin
 * Date: 11/12/15
 * Time: 8:56 PM
 */
session_start();
require_once '../server_mysqli/jsonED.php';
require_once '../server_mysqli/constants.php';
require_once '../server_mysqli/insertDocument.php';
require_once '../server_mysqli/loadComponents.php';
require_once '../server_mysqli/dbparams.php';
require_once '../server_mysqli/preparedQuery.php';

if (mysqli_connect_errno()) {
    header('HTTP/1.0 400 Database Available');
    exit();
}

$lastName = $_POST['lastname'];
$firstName = $_POST['firstname'];
$eid = $_POST['eid'];
$email = $_POST['email'];
$password = $_POST['password'];
$userType = $_POST['userType'];

$userEidQuery = "SELECT id, user_eid, password, last_name, first_name, email from dgpath_user where user_eid = ?";
$userInsertQuery = "INSERT into dgpath_user (user_eid, password, last_name, first_name, email) values (?,?,?,?,?)";
$groupInsertForUserQuery = "INSERT into dgpath_group (label) values (?)";
$isUserInCourseQuery = "select dgpath_group.id, dgpath_group.label from dgpath_user, dgpath_user_in_group, dgpath_group, dgpath_cando_project, dgpath_permission where ";
$isUserInCourseQuery = $isUserInCourseQuery."dgpath_group.id = dgpath_user_in_group.group_id ";
$isUserInCourseQuery = $isUserInCourseQuery."and dgpath_user_in_group.user_id = dgpath_user.id ";
$isUserInCourseQuery = $isUserInCourseQuery."and dgpath_user.user_eid = ? ";
$isUserInCourseQuery = $isUserInCourseQuery."and dgpath_cando_project.group_id = dgpath_group.id ";
$isUserInCourseQuery = $isUserInCourseQuery."and dgpath_cando_project.project_id = ? ";
$isUserInCourseQuery = $isUserInCourseQuery."and dgpath_cando_project.permission_id = dgpath_permission.id ";
$isUserInCourseQuery = $isUserInCourseQuery."and dgpath_permission.label = ?";






echo('ok');