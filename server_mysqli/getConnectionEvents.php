<?php
/**
 * Created by PhpStorm.
 * User: georgepipkin
 * Date: 2/16/14
 * Time: 12:09 PM
 */


require_once '../server_mysqli/constants.php';
require_once '../server_mysqli/jsonED.php';
require_once '../server_mysqli/dbparams.php';
require_once '../server_mysqli/preparedQuery.php';

$thisConnectionId = $_POST['connectionId'];
$thisComponentId = $_POST["componentId"];

$query = "SELECT * from dgpath_connection where dgpath_connection.start_id = ?";
$connectionParams = array($thisComponentId);
$userQueryResult = mysqli_prepared_query($link,$query,"s",$connectionParams);

if ($connectionResult[0]=="error") {
    header('HTTP/1.0 400 connection error look up user on connection query');
    exit;
}
$count = sizeof($userQueryResult);


$query = "SELECT dgpath_component.id as componentId, dgpath_component.title, dgpath_connection.start_id, dgpath_connection.end_id, dgpath_connection.go_ahead ";
$query = $query."from dgpath_component, dgpath_connection ";
$query = $query."where (dgpath_component.id = dgpath_connection.start_id OR dgpath_component.id = dgpath_connection.end_id) ";
$query = $query."and dgpath_connection.id =?";

$connectionParams = array($thisConnectionId);
$queryResult = mysqli_prepared_query($link,$query,"s",$connectionParams);

if ($queryResult[0]=="error") {
    header('HTTP/1.0 400 connection error look up user on connection query');
    exit;
}
$startComponentTitle = null;
$endComponentTitle = null;
$goAhead = false;
foreach($queryResult as $row){
    if($row['componentId']==$row['start_id']){
        $startComponentTitle=$row['title'];
        if($row['go_ahead']!= null){
            if($row['go_ahead']==1){
                $goAhead=true;
            }
        }
    }
    if($row['componentId']==$row['end_id'])$endComponentTitle=$row['title'];
}

$startEndTitles = array('startTitle'=>$startComponentTitle, 'endTitle'=>$endComponentTitle, 'goAhead'=>$goAhead, 'existingConnections'=>$count);



$query = "select dgpath_events.label, dgpath_events.id, dgpath_rules.necessary, dgpath_rules.sufficient, dgpath_rules.necessary_ex, dgpath_rules.activate from dgpath_events, dgpath_rules ";
$query = $query."where dgpath_rules.event_id = dgpath_events.id ";
$query = $query."and dgpath_rules.connection_id = ? ";
$query = $query."and dgpath_events.component_id = ? ";

$connectionParams = array($thisConnectionId, $thisComponentId);
$queryResult = mysqli_prepared_query($link,$query,"ss",$connectionParams);

if ($queryResult[0]=="error") {
    header('HTTP/1.0 400 connection error look up user on connection query');
    exit;
}

$connectionEvents = array();
foreach($queryResult as $row){
    $thisEventId = $row['id'];
    $thisEvent = array('eventLabel'=>$row['label'], 'eventId'=>$row['id'], 'necessary'=>$row['necessary'], 'sufficient'=>$row['sufficient'], 'exclude'=>$row['necessary_ex'], 'activate'=>$row['activate']);
    $connectionEvents[$thisEventId]=$thisEvent;
}

$allComponentEvents = array();
$query = "select dgpath_events.label, dgpath_events.id from dgpath_events  where dgpath_events.component_id = '$thisComponentId'";
$connectionParams = array($thisComponentId);
$queryResult = mysqli_prepared_query($link,$query,"s",$connectionParams);

if ($queryResult[0]=="error") {
    header('HTTP/1.0 400 connection error look up user on component event query');
    exit;
}

foreach($queryResult as $row){
    $thisEventId = $row['id'];
    $thisEventLabel = $row['label'];
    if($connectionEvents[$thisEventId]!=null){
        array_push($allComponentEvents, $connectionEvents[$thisEventId]);
    }else{
        $noRuleComponentEvent = array('eventLabel'=>$row['label'], 'eventId'=>$row['id'], 'necessary'=>0, 'sufficient'=>0, 'exclude'=>0, 'activate'=>"");
        array_push($allComponentEvents, $noRuleComponentEvent);
    }

}


$connectionEventInfo = array();
array_push($connectionEventInfo, $startEndTitles );
array_push($connectionEventInfo, $allComponentEvents);

$jsonResults = json_encode($connectionEventInfo);
echo($jsonResults);



