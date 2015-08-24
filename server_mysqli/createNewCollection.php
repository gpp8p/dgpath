<?php
/**
 * Created by PhpStorm.
 * User: georgepipkin
 * Date: 12/4/14
 * Time: 7:53 AM
 */
session_start();
require_once '../server_mysqli/jsonED.php';
require_once '../server_mysqli/constants.php';
require_once '../server_mysqli/insertDocument.php';
require_once '../server_mysqli/loadComponents.php';
require_once '../server_mysqli/dbparams.php';
require_once '../server_mysqli/preparedQuery.php';


if(!isset($_SESSION['username'])){
    header('HTTP/1.0 400 No session - please log in');
    exit;
}else{
    $thisUser = $_SESSION['username'];
}

$query = "SELECT id from dgpath_user where user_eid = ?";
$connectionParams = array($thisUser);
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

$collectionTitle = $_POST['collectionTitle'];
$collectionDescription = $_POST['collectionDescription'];

if (mysqli_connect_errno()) {
    header('HTTP/1.0 400 Database Available');
    exit();
}
// insert project (i.e. collection)
$query = "INSERT INTO dgpath_project(proj_name, description) values(?,?)";
if ($stmt = mysqli_prepare($link, $query)) {
    mysqli_stmt_bind_param($stmt, "ss", $collectionTitle, $collectionDescription);
    mysqli_stmt_execute($stmt);
    if(mysqli_stmt_affected_rows($stmt)==0){
        header('HTTP/1.0 400 Nothing saved - collection insert');
        exit;
    }
}else{
    header('HTTP/1.0 400 bad query - collection insert');
    exit;
}
$thisProject = $stmt->insert_id;

$ownerGroupName = $projectTitle." -  owner group";
$query = "insert into dgpath_group(label) values (?)";
if ($stmt3 = mysqli_prepare($link, $query)) {
    mysqli_stmt_bind_param($stmt3, "s", $ownerGroupName);
    mysqli_stmt_execute($stmt3);
    if(mysqli_stmt_affected_rows($stmt3)==0){
        header('HTTP/1.0 400 Nothing saved - collection group insert');
        exit;
    }
}else{
    header('HTTP/1.0 400 bad query - nav group insert');
    exit;
}
$thisOwnerGroupId = $stmt3->insert_id;

$query = "insert into dgpath_user_in_group (user_id, group_id) values (?,?)";
if ($stmt5 = mysqli_prepare($link, $query)) {
    mysqli_stmt_bind_param($stmt5, "dd", $thisUserId,$thisOwnerGroupId);
    mysqli_stmt_execute($stmt5);
    if(mysqli_stmt_affected_rows($stmt5)==0){
        header('HTTP/1.0 400 Nothing saved - project author group member insert');
        exit;
    }
}else{
    header('HTTP/1.0 400 bad query - project author group member insert');
    exit;
}
//give the newly created author group library permissions
$query = "insert into dgpath_cando_project (project_id, group_id, permission_id) values (?,?,? )";
if ($stmt6 = mysqli_prepare($link, $query)) {
    mysqli_stmt_bind_param($stmt6, "ddd", $thisProject, $thisOwnerGroupId, $libraryPermissions);
    mysqli_stmt_execute($stmt6);
    if(mysqli_stmt_affected_rows($stmt6)==0){
        header('HTTP/1.0 400 Nothing saved - collection library group permission insert');
        exit;
    }
}else{
    header('HTTP/1.0 400 bad query - collection library group permission insert');
    exit;
}

$parent = 0;
$topcontext = 1;
$query = "insert into dgpath_context(title, project, parent, topcontext) values (?,?,?,?)";
if ($stmt2 = mysqli_prepare($link, $query)) {
    mysqli_stmt_bind_param($stmt2, "ssii", $collectionTitle, $thisProject, $parent, $topcontext);
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

return "ok";
