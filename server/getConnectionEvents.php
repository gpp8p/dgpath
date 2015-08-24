<?php
/**
 * Created by PhpStorm.
 * User: georgepipkin
 * Date: 2/16/14
 * Time: 12:09 PM
 */


require_once '../server/constants.php';
require_once '../server/jsonED.php';
require_once '../server/dbparams.php';

$thisConnectionId = $_POST['connectionId'];
$thisComponentId = $_POST["componentId"];

$query = "SELECT * from dgpath_connection where dgpath_connection.start_id = '$thisComponentId'";
$result = mysql_query($query);
$count = mysql_num_rows($result);


$query = "SELECT dgpath_component.id as componentId, dgpath_component.title, dgpath_connection.start_id, dgpath_connection.end_id, dgpath_connection.go_ahead ";
$query = $query."from dgpath_component, dgpath_connection ";
$query = $query."where (dgpath_component.id = dgpath_connection.start_id OR dgpath_component.id = dgpath_connection.end_id) ";
$query = $query."and dgpath_connection.id ='$thisConnectionId'";

$result = mysql_query($query);
if (!$result) {
    die('Invalid query: ' . mysql_error());
}
$startComponentTitle = null;
$endComponentTitle = null;
$goAhead = false;
while($row=mysql_fetch_array($result)){
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



$query = "select dgpath_events.label, dgpath_events.id, dgpath_rules.necessary, dgpath_rules.sufficient, dgpath_rules.necessary_ex from dgpath_events, dgpath_rules ";
$query = $query."where dgpath_rules.event_id = dgpath_events.id ";
$query = $query."and dgpath_rules.connection_id = '$thisConnectionId' ";
$query = $query."and dgpath_events.component_id = '$thisComponentId' ";

$result = mysql_query($query);
if (!$result) {
    die('Invalid query: ' . mysql_error());
}
$connectionEvents = array();
while($row=mysql_fetch_array($result)){
    $thisEventId = $row['id'];
    $thisEvent = array('eventLabel'=>$row['label'], 'eventId'=>$row['id'], 'necessary'=>$row['necessary'], 'sufficient'=>$row['sufficient'], 'exclude'=>$row['necessary_ex']);
    $connectionEvents[$thisEventId]=$thisEvent;
}

$allComponentEvents = array();
$query = "select dgpath_events.label, dgpath_events.id from dgpath_events  where dgpath_events.component_id = '$thisComponentId'";
$result = mysql_query($query);
if (!$result) {
    die('Invalid query: ' . mysql_error());
}
while($row=mysql_fetch_array($result)){
    $thisEventId = $row['id'];
    $thisEventLabel = $row['label'];
    if($connectionEvents[$thisEventId]!=null){
        array_push($allComponentEvents, $connectionEvents[$thisEventId]);
    }else{
        $noRuleComponentEvent = array('eventLabel'=>$row['label'], 'eventId'=>$row['id'], 'necessary'=>0, 'sufficient'=>0, 'exclude'=>0);
        array_push($allComponentEvents, $noRuleComponentEvent);
    }

}


$connectionEventInfo = array();
array_push($connectionEventInfo, $startEndTitles );
array_push($connectionEventInfo, $allComponentEvents);

$jsonResults = json_encode($connectionEventInfo);
echo($jsonResults);



