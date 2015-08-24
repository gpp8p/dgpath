<?php
/**
 * Created by PhpStorm.
 * User: georgepipkin
 * Date: 1/18/15
 * Time: 10:26 AM
 */
require_once '../server_mysqli/jsonED.php';
require_once '../server_mysqli/constants.php';
require_once '../server_mysqli/dbparams.php';
require_once '../server_mysqli/preparedQuery.php';

//$componentId = $_POST['componentId'];
$componentId = 492;
//$fd = $_POST['force'];
$fd = "force";
if(!is_null($fd)){
    $forceDelete = TRUE;
}else{
    $forceDelete = FALSE;
}

$user_events_query = "select count(*) as count from dgpath_user_events where component_id = ?";
$delete_rules_query = "delete from dgpath_rules where connection_id in (select id from dgpath_connection where start_id = ? or end_id = ?)";
$delete_connections_query = "delete from dgpath_connection where (start_id = ? or end_id = ?)";
$delete_events_query = "delete from dgpath_events where component_id = ?";
$delete_user_events_query = "delete from dgpath_user_events where component_id = ?";
$delete_entity_cando_query = "delete from dgpath_cando_entity where entity_id in (select id from dgpath_entity where component_id = ?)";
$delete_entity_element_query = "delete from dgpath_entity_element where entity_id in (select id from dgpath_entity where component_id = ?)";
$delete_entity_query = "delete from dgpath_entity where component_id = ?";
$delete_component_query = "delete from dgpath_component where id = ?";

// do the user_events query


// delete connections

if ($stmt = mysqli_prepare($link, $delete_connections_query)) {
    mysqli_stmt_bind_param($stmt, "ss", $componentId, $componentId);
    mysqli_stmt_execute($stmt);
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

