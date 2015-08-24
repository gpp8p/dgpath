<?php
/**
 * Created by PhpStorm.
 * User: georgepipkin
 * Date: 4/29/14
 * Time: 6:42 AM
 */
session_start();
require_once '../server/jsonED.php';
require_once '../server/dbparams_mysqli.php';
require_once '../server_mysqli/constants.php';

if (mysqli_connect_errno()) {
    header('HTTP/1.0 400 Database Available');
    exit();
}

if(!isset($_SESSION['username'])){
    header('HTTP/1.0 400 No session - please log in');
    exit;
}else{
/*
    $userId =  $_POST["ownerContext"];
    $thisQuery = "select dgpath_project.proj_name, dgpath_project.id as proj_id, dgpath_context.id as context_id from dgpath_project, dgpath_user_in_project, dgpath_user, dgpath_context "
    ."where dgpath_project.id = dgpath_user_in_project.project_id "
    ."and dgpath_user_in_project.user_id = dgpath_user.id "
    ."and dgpath_context.project = dgpath_project.id "
    ."and dgpath_context.topcontext=1 "
    ."and dgpath_user.user_eid = ?";
*/
    $userId = $_SESSION['username'];
    $thisQuery = "select dgpath_project.proj_name, dgpath_project.id as proj_id, dgpath_context.id as context_id from dgpath_project, dgpath_group, dgpath_user_in_group, dgpath_user, dgpath_cando_project, dgpath_permission, dgpath_context "
    ."where dgpath_project.id = dgpath_cando_project.project_id "
    ."and dgpath_cando_project.group_id = dgpath_group.id "
    ."and dgpath_user_in_group.group_id = dgpath_group.id "
    ."and dgpath_user.id = dgpath_user_in_group.user_id "
    ."and dgpath_cando_project.permission_id = dgpath_permission.id "
    ."and dgpath_context.project = dgpath_project.id "
    ."and dgpath_context.topcontext=1 "
    ."and dgpath_permission.id = ".strval($authoringPermissions)." "
    ."and dgpath_user.user_eid = ?";



    if ($stmt = mysqli_prepare($link, $thisQuery)) {
        mysqli_stmt_bind_param($stmt, "s", $userId);
        mysqli_stmt_execute($stmt);
        mysqli_stmt_bind_result($stmt, $projectName, $projectId, $contextId );
        $return = array();
        while (mysqli_stmt_fetch($stmt)) {
            $thisEntry = array($projectName, $projectId, $contextId);
            array_push($return, $thisEntry);
        }
        $jsonReturn = json_encode($return);
        echo($jsonReturn);

    }else{
        header('HTTP/1.0 400 Bad query');
        exit;
    }
}