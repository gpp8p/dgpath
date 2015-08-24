<?php
/**
 * Created by JetBrains PhpStorm.
 * User: georgepipkin
 * Date: 3/12/13
 * Time: 9:53 PM
 * To change this template use File | Settings | File Templates.
 */




require_once '../server_mysqli/jsonED.php';
require_once '../server_mysqli/constants.php';
require_once '../server_mysqli/insertDocument.php';
require_once '../server_mysqli/loadComponents.php';
require_once '../server_mysqli/dbparams.php';
require_once '../server_mysqli/preparedQuery.php';


$projectTitle = $_POST['ptitle'];
$thisUserEid = $_POST['thisUserEid'];
$canvasWidth = $_POST['width'];
$canvasHeight= $_POST['height'];

if (mysqli_connect_errno()) {
    header('HTTP/1.0 400 Database Available');
    exit();
}
// insert project
$query = "INSERT INTO dgpath_project(proj_name) values(?)";
if ($stmt = mysqli_prepare($link, $query)) {
    mysqli_stmt_bind_param($stmt, "s", $projectTitle);
    mysqli_stmt_execute($stmt);
    if(mysqli_stmt_affected_rows($stmt)==0){
        header('HTTP/1.0 400 Nothing saved - project insert');
        exit;
    }
}else{
        header('HTTP/1.0 400 bad query - project insert');
        exit;
}
// insert context
$thisProject = $stmt->insert_id;
$parent = 0;
$topcontext = 1;
$thisContextTitle = $projectTitle." - entry";
$query = "insert into dgpath_context(title, project, parent, topcontext) values (?,?,?,?)";
if ($stmt2 = mysqli_prepare($link, $query)) {
    mysqli_stmt_bind_param($stmt2, "ssii", $thisContextTitle, $thisProject,$parent,$topcontext);
    mysqli_stmt_execute($stmt2);
    if(mysqli_stmt_affected_rows($stmt2)==0){
        header('HTTP/1.0 400 Nothing saved - context insert');
        exit;
    }
    $contextId = $stmt2->insert_id;
}else{
    header('HTTP/1.0 400 Nothing saved - context insert');
    exit;
}
// find out user id
$query = "SELECT id from dgpath_user where user_eid = ?";
$connectionParams = array($thisUserEid);
$userQueryResult = mysqli_prepared_query($link,$query,"s",$connectionParams);

if ($connectionResult[0]=="error") {
    header('HTTP/1.0 400 connection error look up user on project create');
    exit;
}
$dataFound = false;
foreach($userQueryResult as $row){
    $dataFound = true;
    $thisUserId = $row['id'];
}
if(!$dataFound){
    header('HTTP/1.0 400 user not found look up user on project create');
    exit;
}
// insert author group
$authorGroupName = $projectTitle." - author group";
$query = "insert into dgpath_group(label) values (?)";
if ($stmt3 = mysqli_prepare($link, $query)) {
    mysqli_stmt_bind_param($stmt3, "s", $authorGroupName);
    mysqli_stmt_execute($stmt3);
    if(mysqli_stmt_affected_rows($stmt3)==0){
        header('HTTP/1.0 400 Nothing saved - project author group insert');
        exit;
    }
}else{
    header('HTTP/1.0 400 bad query - nav group insert');
    exit;
}
$thisAuthorGroupId = $stmt3->insert_id;
$navGroupName = $projectTitle." - nav group";
$query = "insert into dgpath_group(label) values (?)";
if ($stmt4 = mysqli_prepare($link, $query)) {
    mysqli_stmt_bind_param($stmt4, "s", $navGroupName);
    mysqli_stmt_execute($stmt4);
    if(mysqli_stmt_affected_rows($stmt4)==0){
        header('HTTP/1.0 400 Nothing saved - project nav group insert');
        exit;
    }
}else{
    header('HTTP/1.0 400 bad query - nav group insert');
    exit;
}
$thisNavGroupId = $stmt4->insert_id;

// put creating user in author group
$query = "insert into dgpath_user_in_group (user_id, group_id) values (?,?)";
if ($stmt5 = mysqli_prepare($link, $query)) {
    mysqli_stmt_bind_param($stmt5, "dd", $thisUserId,$thisAuthorGroupId);
    mysqli_stmt_execute($stmt5);
    if(mysqli_stmt_affected_rows($stmt5)==0){
        header('HTTP/1.0 400 Nothing saved - project author group member insert');
        exit;
    }
}else{
    header('HTTP/1.0 400 bad query - project author group member insert');
    exit;
}
//give the newly created author group authoring permissions
$query = "insert into dgpath_cando_project (project_id, group_id, permission_id) values (?,?,? )";
if ($stmt6 = mysqli_prepare($link, $query)) {
    mysqli_stmt_bind_param($stmt6, "ddd", $thisProject, $thisAuthorGroupId, $authoringPermissions);
    mysqli_stmt_execute($stmt6);
    if(mysqli_stmt_affected_rows($stmt6)==0){
        header('HTTP/1.0 400 Nothing saved - project author group permission insert');
        exit;
    }
}else{
    header('HTTP/1.0 400 bad query - project author group permission insert');
    exit;
}
//give the newly created nav group nav permissions
if ($stmt7 = mysqli_prepare($link, $query)) {
    mysqli_stmt_bind_param($stmt7, "ddd", $thisProject, $thisNavGroupId, $navPermission);
    mysqli_stmt_execute($stmt7);
    if(mysqli_stmt_affected_rows($stmt7)==0){
        header('HTTP/1.0 400 Nothing saved - project nav group permission insert');
        exit;
    }
}else{
    header('HTTP/1.0 400 bad query - project nav group member insert');
    exit;
}



$entryDoor = insertDoors($contextId, $canvasWidth, $canvasHeight, $projectTitle, $link);



echo($entryDoor);

