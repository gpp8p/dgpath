<?php
/**
 * Created by PhpStorm.
 * User: georgepipkin
 * Date: 11/29/15
 * Time: 10:50 AM
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
}else {
    $userId = $_SESSION['username'];
    $userActivityTypes = $_POST['activityTypes'];

//    $userActivityQuery = "select dgpath_user_events.id as id, dgpath_user_events.event_time as event_time, dgpath_user_events.detail as detail, dgpath_user_events.event_type as event_type, dgpath_user_events.user_id as user_id, dgpath_user_events.context_id as context_id, dgpath_user_events.traversal_id as traversal_id, dgpath_user.first_name as first_name, dgpath_user.last_name as last_name from dgpath_user_events, dgpath_user where event_type in (23,70,72) and event_time in (select max(event_time) from dgpath_user_events group by user_id) and dgpath_user.id = dgpath_user_events.user_id";
//    $userActivityQuery = "select dgpath_user_events.id as id, dgpath_user_events.component_id as component_id, dgpath_user_events.event_time as event_time, dgpath_user_events.detail as detail, dgpath_user_events.event_type as event_type, dgpath_user_events.user_id as user_id, dgpath_user_events.context_id as context_id, dgpath_user_events.traversal_id as traversal_id, dgpath_user.first_name as first_name, dgpath_user.last_name as last_name from dgpath_user_events, dgpath_user where event_type = 70  and dgpath_user.id = dgpath_user_events.user_id group by user_id order by event_time desc";
$userActivityQuery=<<<EOQ
 select * from (
 select dgpath_user_events.id as id, dgpath_user_events.component_id as component_id, dgpath_user_events.event_time as event_time, dgpath_user_events.detail as detail, dgpath_user_events.event_type as event_type, dgpath_user_events.user_id as user_id, dgpath_user_events.context_id as context_id, dgpath_user_events.traversal_id as traversal_id, dgpath_user.first_name as first_name, dgpath_user.last_name as last_name from dgpath_user_events, dgpath_user
 where dgpath_user.id = dgpath_user_events.user_id order by event_time desc)
 as t1 group by user_id;
EOQ;




    $userActivityQueryParams = array();
    $userActivityList = array();
    $queryResult = mysqli_prepared_query($link,$userActivityQuery,"",$userActivityQueryParams);
    foreach($queryResult as $thisActivity){
        array_push($userActivityList, $thisActivity);
    }
    $jsonReturn = json_encode($userActivityList);
    echo($jsonReturn);

}