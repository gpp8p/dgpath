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
$projectId = $_POST['projectId'];

$userEidQuery = "SELECT id, user_eid, password, last_name, first_name, email from dgpath_user where user_eid = ?";

$userInsertQuery = "INSERT into dgpath_user (user_eid, password, last_name, first_name, email) values (?,?,?,?,?)";

$groupInsertForUserQuery = "INSERT into dgpath_group (label, grpoup_type) values (?,?)";
$homeGroupLabel = "homegroup";
$homeGroupQuery = "SELECT id from dgpath_group_type where label = ?";
$userHomeGroupQuery = "select dgpath_group.id,dgpath_group.label from dgpath_user_in_group, dgpath_group where dgpath_user_in_group.user_id = ? and dgpath_user_in_group.group_id = dgpath_group.id and dgpath_group.group_type=?";

$userInGroupQuery = "INSERT into dgpath_user_in_group (user_id, group_id) values (?,?)";

$isUserInCourseQuery = "select dgpath_group.id, dgpath_group.label from dgpath_user, dgpath_user_in_group, dgpath_group, dgpath_cando_project, dgpath_permission where ";
$isUserInCourseQuery = $isUserInCourseQuery."dgpath_group.id = dgpath_user_in_group.group_id ";
$isUserInCourseQuery = $isUserInCourseQuery."and dgpath_user_in_group.user_id = dgpath_user.id ";
$isUserInCourseQuery = $isUserInCourseQuery."and dgpath_user.user_eid = ? ";
$isUserInCourseQuery = $isUserInCourseQuery."and dgpath_cando_project.group_id = dgpath_group.id ";
$isUserInCourseQuery = $isUserInCourseQuery."and dgpath_cando_project.project_id = ? ";
$isUserInCourseQuery = $isUserInCourseQuery."and dgpath_cando_project.permission_id = dgpath_permission.id ";
$isUserInCourseQuery = $isUserInCourseQuery."and dgpath_permission.label = ?";

$userInGroupInsertQuery = "INSERT into dgpath_user_in_group (user_id, group_id) values (?,?)";

$lookupPermissionQuery = "SELECT id from dgpath_permission where label=?";
$candoProjectInsertQuery = "INSERT into dgpath_cando_project (project_id, group_id, permission_id) values (?,?,?)";



$existingEid = false;

switch($userType) {
    case "courseDesigner":
        $desiredPermission = array("Author Project","Library Permissions");
        break;
    case "instructor":
        $desiredPermission = array("Author Project", "Navigate Project","Library Permissions");
        break;
    case "secondaryInstructor":
        $desiredPermission = array("Author Project", "Navigate Project");
        break;
    case "student":
        $desiredPermission = array("Navigate Project");
        break;
    case "guest":
        $desiredPermission = array("Preview Project");
        break;
}
$queryParams = array($homeGroupLabel);
$queryResult = mysqli_prepared_query($link,$homeGroupQuery,"s",$queryParams);
$homeGroupFound = false;
foreach($queryResult as $thisQueryResult){
    $homeGroupFound = true;
    $homeGroupId = $thisQueryResult['id'];
}
if(!$homeGroupFound){
    header('HTTP/1.0 400 bad query - homegroup query failed');
    exit;
}
$addThesePermissions = array();

$queryParams = array($eid);
$queryResult = mysqli_prepared_query($link,$userEidQuery,"s",$queryParams);
$eidFound = false;
foreach($queryResult as $thisQueryResult){
    $eidFound=true;
    $thisEidId = $thisQueryResult['id'];
    $thisFirstName = $thisQueryResult['first_name'];
    $thisLastName = $thisQueryResult['last_name'];
    $thisEmail = $thisQueryResult['email'];
}

if($eidFound){
    $verifiedUser=false;
    if((strcasecmp($thisFirstName, $firstName)==0)&&(strcasecmp($thisLastName, $lastName)==0)){
        $verifiedUser=true;
    }
    if(!$verifiedUser){
        $returnValues = array("msg"=>"duplicateUserId", "firstName"=>$thisFirstName, "lastName"=>$thisLastName, "eid"=>$thisEid );
        $returnDataJson = json_encode($returnValues);
        echo($returnDataJson);
        exit;
    }else{
        $existingEid = true;
        $permissionRequired=false;
        foreach($desiredPermission as $thisDesiredPermission){
            $queryParams = array($eid, $projectId, $thisDesiredPermission);
            $queryResult = mysqli_prepared_query($link,$isUserInCourseQuery,"sss",$queryParams);
            $userInCourseFoundWithThisPermission = false;
            foreach($queryResult as $thisQueryResult){
                $userInCourseFoundWithThisPermission = true;
            }
            if(!$userInCourseFoundWithThisPermission){
                array_push($addThesePermissions, $thisDesiredPermission);
            }
        }

    }

}

if(!$existingEid){
    if ($stmt = mysqli_prepare($link, $userInsertQuery)) {
        mysqli_stmt_bind_param($stmt, "sssss", $eid, $password, $lastName, $firstName, $email);
        mysqli_stmt_execute($stmt);
        if(mysqli_stmt_affected_rows($stmt)<=0){
            header('HTTP/1.0 400 Nothing saved - user insert');
            exit;
        }else{
            $thisNewUserId = $stmt->insert_id;
        }
    }else{
        header('HTTP/1.0 400 bad query - collection insert');
        exit;
    }
    if ($stmt = mysqli_prepare($link, $groupInsertForUserQuery)) {
        $newUserGroupLabel = $eid." group";
        mysqli_stmt_bind_param($stmt, "si", $newUserGroupLabel, $homeGroupId);
        mysqli_stmt_execute($stmt);
        if(mysqli_stmt_affected_rows($stmt)<=0){
            header('HTTP/1.0 400 Nothing saved - group insert');
            exit;
        }else{
            $thisHomeGroupId = $stmt->insert_id;
        }
    }else{
        header('HTTP/1.0 400 bad query - collection insert');
        exit;
    }
    if ($stmt = mysqli_prepare($link, $userInGroupQuery)) {
        mysqli_stmt_bind_param($stmt, "ii", $thisNewUserId, $thisHomeGroupId);
        mysqli_stmt_execute($stmt);
        if(mysqli_stmt_affected_rows($stmt)<=0){
            header('HTTP/1.0 400 Nothing saved - user in group insert');
            exit;
        }else{
            $thisNewUserInGroupId = $stmt->insert_id;
        }
    }else{
        header('HTTP/1.0 400 bad query - collection insert');
        exit;
    }
    $addThesePermissions = array($desiredPermission);
}else{
    $queryParams = array($thisEidId,$homeGroupId);
    $queryResult = mysqli_prepared_query($link,$userHomeGroupQuery,"ii",$queryParams);
    $thisHomeGroupFound = false;
    foreach($queryResult as $thisQueryResult){
        $thisHomeGroupFound = true;
        $thisHomeGroupId = $thisQueryResult['id'];
    }
    if(!$homeGroupFound){
        header('HTTP/1.0 400 bad query - user homegroup query failed');
        exit;
    }
}
foreach($addThesePermissions as $addThisPermission){
    $queryParams = array($thisPermission);
    $queryResult = mysqli_prepared_query($link,$lookupPermissionQuery,"s",$queryParams);
    $thisPermissionFound = false;
    foreach($queryResult as $thisQueryResult){
        $thisPermissionFound = true;
        $thisPermissionId = $thisQueryResult['id'];
    }
    if(!$homeGroupFound){
        header('HTTP/1.0 400 bad query - permission query failed');
        exit;
    }
    if ($stmt = mysqli_prepare($link, $candoProjectInsertQuery)) {
        mysqli_stmt_bind_param($stmt, "iii", $projectId, $thisHomeGroupId,$thisPermissionId);
        mysqli_stmt_execute($stmt);
        if(mysqli_stmt_affected_rows($stmt)<=0){
            header('HTTP/1.0 400 Nothing saved - user in group insert');
            exit;
        }
    }else{
        header('HTTP/1.0 400 bad query - cando_project insert');
        exit;
    }
}






$returnValues = array("msg"=>"userCreated", "firstName"=>$firstName, "lastName"=>$lastName, "eid"=>$eid );
$returnDataJson = json_encode($returnValues);
echo($returnDataJson);
exit;