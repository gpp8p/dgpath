<?php
/**
 * Created by PhpStorm.
 * User: georgepipkin
 * Date: 11/1/14
 * Time: 10:04 PM
 */

session_start();
require_once '../server/jsonED.php';
require_once '../server/dbparams_mysqli.php';
require_once '../server_mysqli/constants.php';
require_once '../server_mysqli/preparedQuery.php';

if (mysqli_connect_errno()) {
    header('HTTP/1.0 400 Database Available');
    exit();
}

if(!isset($_SESSION['username'])){
    header('HTTP/1.0 400 No session - please log in');
    exit;
}else{

    $userId = $_SESSION['username'];
    $thisQuery = "select dgpath_project.proj_name as projectName, dgpath_project.id as projectId, dgpath_project.description, dgpath_permission.id as permission from dgpath_project, dgpath_group, dgpath_user_in_group, dgpath_user, dgpath_cando_project, dgpath_permission "
        ."where dgpath_project.id = dgpath_cando_project.project_id "
        ."and dgpath_cando_project.group_id = dgpath_group.id "
        ."and dgpath_user_in_group.group_id = dgpath_group.id "
        ."and dgpath_user.id = dgpath_user_in_group.user_id "
        ."and dgpath_cando_project.permission_id = dgpath_permission.id "
        ."and dgpath_permission.id = ".strval($libraryPermissions)." OR dgpath_permission.id =".strval($libraryPermissionsRO)." "
        ."and dgpath_user.user_eid = ?";



    $connectionParams = array($userId);
    $queryResult = mysqli_prepared_query($link,$thisQuery,"s",$connectionParams);

    if ($queryResult[0]=="error") {
        header('HTTP/1.0 400 connection error look up user on connection query');
        exit;
    }
    $startComponentTitle = null;
    $endComponentTitle = null;
    $goAhead = false;
    $return = array();
    foreach($queryResult as $row){
        $thisEntry = array($row['projectName'], $row['projectId'], $row['description'], $row['permission']);
        array_push($return, $thisEntry);
    }
    $jsonReturn = json_encode($return);
    echo($jsonReturn);


}