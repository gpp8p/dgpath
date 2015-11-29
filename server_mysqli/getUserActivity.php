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

    $userActivityQuery = "select id, event_time, detail, event_type, user_id, context_id, traversal_id from dgpath_user_events where event_type in (".$userActivityTypes.") and event_time in (select max(event_time) from dgpath_user_events group by user_id)";
    $userActivityQueryParams = array();
    $userActivityList = array();
    $queryResult = mysqli_prepared_query($link,$userActivityQuery,"",$userActivityQueryParams);
    foreach($queryResult as $thisActivity){
        array_push($userActivityList, $thisActivity);
    }
    $jsonReturn = json_encode($userActivityList);
    echo($jsonReturn);

}