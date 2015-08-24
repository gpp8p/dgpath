<?php
/**
 * Created by PhpStorm.
 * User: georgepipkin
 * Date: 1/14/15
 * Time: 10:27 PM
 */

require_once '../server_mysqli/jsonED.php';
require_once '../server_mysqli/constants.php';
require_once '../server_mysqli/dbparams.php';
require_once '../server_mysqli/preparedQuery.php';


//$componentId = $_POST['componentId'];
$componentId = 494;
//$fd = $_POST['force'];
$fd = "force";
if(!is_null($fd)){
    $forceDelete = TRUE;
}else{
    $forceDelete = FALSE;
}

$user_events_query = "select count(*) as count from dgpath_user_events where component_id = ?";
$delete_rules_query = "delete from dgpath_rules where connection_id in (select id from dgpath_connection where start_id = ? or end_id = ?)";
$delete_connections_query = "delete from dgpath_connection where start_id = ? or end_id = ?";
$delete_events_query = "delete from dgpath_events where component_id = ?";
$delete_user_events_query = "delete from dgpath_user_events where component_id = ?";
$delete_entity_cando_query = "delete from dgpath_cando_entity where entity_id in (select id from dgpath_entity where component_id = ?)";
$delete_entity_element_query = "delete from dgpath_entity_element where entity_id in (select id from dgpath_entity where component_id = ?)";
$delete_entity_query = "delete from dgpath_entity where component_id = ?";
$delete_component_query = "delete from dgpath_component where id = ?";

// do the user_events query
$params = array($componentId);
$user_events_queryResult = mysqli_prepared_query($link,$user_events_query,"s",$params);

if ($user_events_queryResult[0]=="error") {
    header('HTTP/1.0 400 error user events query');
    exit;
}
$dataFound = false;
$userEventsCount;
foreach($user_events_queryResult as $row){
    $userEventsCount = $row['count'];
    $dataFound = true;
}
if(!$dataFound){
    header('HTTP/1.0 400 error user events query yielded no results');
    exit;
}
if($userEventsCount>0 && ! $forceDelete){
    echo("userEventsPresent");
    return;
}

mysqli_autocommit($link, FALSE);
// delete rules
$resultLog = array();
if ($stmt = mysqli_prepare($link, $delete_rules_query)) {
    mysqli_stmt_bind_param($stmt, "ss", $componentId, $componentId);
    $result = mysqli_stmt_execute($stmt);
    if(!$result){
        mysqli_rollback($link);
        header('HTTP/1.0 400 query failed - rules delete');
        exit;
    }
    if(mysqli_stmt_affected_rows($stmt)>0) {
        $logEntry = mysqli_stmt_affected_rows($stmt)." were removed from rules";
        array_push($resultLog, $logEntry);
    }else{
        array_push($resultLog,"No rules were deleted");
    }
}else{
    header('HTTP/1.0 400 bad query - rules delete');
    exit;
}

// delete entity cando's
if ($stmt = mysqli_prepare($link, $delete_entity_cando_query)) {
    mysqli_stmt_bind_param($stmt, "s", $componentId);
    $result=mysqli_stmt_execute($stmt);
    if(!$result){
        mysqli_rollback($link);
        header('HTTP/1.0 400 query failed - entity cando delete');
        exit;
    }

    if(mysqli_stmt_affected_rows($stmt)>0) {
        $logEntry = mysqli_stmt_affected_rows($stmt)." were removed from entity permissions";
        array_push($resultLog, $logEntry);
    }else{
        array_push($resultLog,"No entity permissions were deleted");
    }
}else{
    header('HTTP/1.0 400 bad query - entity can do delete');
    exit;
}

// delete dgpath_entity_element
if ($stmt = mysqli_prepare($link, $delete_entity_element_query)) {
    mysqli_stmt_bind_param($stmt, "s", $componentId);
    $result = mysqli_stmt_execute($stmt);
    if(!$result){
        mysqli_rollback($link);
        header('HTTP/1.0 400 query failed - entity element delete');
        exit;
    }
    if(mysqli_stmt_affected_rows($stmt)>0) {
        $logEntry = mysqli_stmt_affected_rows($stmt)." were removed from entity elements";
        array_push($resultLog, $logEntry);
    }else{
        array_push($resultLog,"No entity elements were deleted");
    }
}else{
    header('HTTP/1.0 400 bad query - entity element delete');
    exit;
}

//delete entities
if ($stmt = mysqli_prepare($link, $delete_entity_query)) {
    mysqli_stmt_bind_param($stmt, "s", $componentId);
    $result = mysqli_stmt_execute($stmt);
    if(!$result){
        mysqli_rollback($link);
        header('HTTP/1.0 400 query failed - entity delete');
        exit;
    }
    if(mysqli_stmt_affected_rows($stmt)>0) {
        $logEntry = mysqli_stmt_affected_rows($stmt)." were removed from entities";
        array_push($resultLog, $logEntry);
    }else{
        array_push($resultLog,"No entities were deleted");
    }
}else{
    header('HTTP/1.0 400 bad query - entitydelete');
    exit;
}

//delete events
if ($stmt = mysqli_prepare($link, $delete_events_query)) {
    mysqli_stmt_bind_param($stmt, "s", $componentId);
    $result = mysqli_stmt_execute($stmt);
    if(!$result){
        mysqli_rollback($link);
        header('HTTP/1.0 400 query failed - events delete');
        exit;
    }
    if(mysqli_stmt_affected_rows($stmt)>0) {
        $logEntry = mysqli_stmt_affected_rows($stmt)." were removed from events";
        array_push($resultLog, $logEntry);
    }else{
        array_push($resultLog,"No events were deleted");
    }
}else{
    header('HTTP/1.0 400 bad query - events delete');
    exit;
}

// delete user events
if ($stmt = mysqli_prepare($link, $delete_user_events_query)) {
    mysqli_stmt_bind_param($stmt, "s", $componentId);
    $result = mysqli_stmt_execute($stmt);
    if(!$result){
        mysqli_rollback($link);
        header('HTTP/1.0 400 query failed - user events delete');
        exit;
    }
    if(mysqli_stmt_affected_rows($stmt)>0) {
        $logEntry = mysqli_stmt_affected_rows($stmt)." were removed from user events";
        array_push($resultLog, $logEntry);
    }else{
        array_push($resultLog,"No user events were deleted");
    }
}else{
    header('HTTP/1.0 400 bad query - user events delete');
    exit;
}

// delete connections
if ($stmt = mysqli_prepare($link, $delete_connections_query)) {
    mysqli_stmt_bind_param($stmt, "ss", $componentId, $componentId);
    $result = mysqli_stmt_execute($stmt);
    if(!$result){
        mysqli_rollback($link);
        header('HTTP/1.0 400 query failed - connections delete');
        exit;
    }
    if(mysqli_stmt_affected_rows($stmt)>0) {
        $logEntry = mysqli_stmt_affected_rows($stmt)." were removed from connections";
        array_push($resultLog, $logEntry);
    }else{
        array_push($resultLog,"No connections were deleted");
    }
}else{
    header('HTTP/1.0 400 bad query - connections delete');
    exit;
}

// delete components
if ($stmt = mysqli_prepare($link, $delete_component_query)) {
    mysqli_stmt_bind_param($stmt, "s", $componentId);
    $result = mysqli_stmt_execute($stmt);
    if(!$result){
        mysqli_rollback($link);
        header('HTTP/1.0 400 query failed - component delete');
        exit;
    }
    if(mysqli_stmt_affected_rows($stmt)>0) {
        $logEntry = mysqli_stmt_affected_rows($stmt)." were removed from components";
        array_push($resultLog, $logEntry);
    }else{
        array_push($resultLog,"No components were deleted");
    }
}else{
    header('HTTP/1.0 400 bad query - components delete');
    exit;
}

mysqli_commit($link);

$jsonResultLog = json_encode($resultLog);
echo $jsonResultLog;





