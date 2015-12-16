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

$eventId = $_POST['eventId'];

if (mysqli_connect_errno()) {
    header('HTTP/1.0 400 Database Available');
    exit();
}

if(!isset($_SESSION['username'])){
    header('HTTP/1.0 400 No session - please log in');
    exit;
}else {


    $userActivityQuery = "select dgpath_user_events.id as id, dgpath_user_events.event_time as event_time, dgpath_user_events.detail as detail, dgpath_user_events.event_type as event_type, dgpath_user_events.user_id as user_id, dgpath_user_events.context_id as context_id, dgpath_user_events.traversal_id as traversal_id, dgpath_user.first_name as first_name, dgpath_user.last_name as last_name from dgpath_user_events, dgpath_user where dgpath_user_events.id = ? and dgpath_user.id = dgpath_user_events.user_id";

    $userActivityQueryParams = array($eventId);
    $queryResult = mysqli_prepared_query($link,$userActivityQuery,"s",$userActivityQueryParams);
    $eventFound = false;
    foreach($queryResult as $thisActivity){
        $eventFound = true;
        $thisContext = $thisActivity['context_id'];
        $thisLastName = $thisActivity['last_name'];
        $thisFirstName = $thisActivity['first_name'];
        $thisUserId = $thisActivity['user_id'];
        $thisActivityContext = array("context"=>$thisContext, "firstName"=>$thisFirstName, "lastName"=>$thisLastName, "userId"=>$thisUserId);
    }
    if(!$eventFound){
        header('HTTP/1.0 400 user event not found');
        exit();
    }
    $jsonReturn = json_encode($thisActivityContext);
    echo($jsonReturn);

}