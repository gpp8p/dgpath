<?php
/**
 * Created by PhpStorm.
 * User: georgepipkin
 * Date: 12/29/13
 * Time: 11:58 AM
 */

require_once '../server/jsonED.php';
require_once '../server/constants.php';
require_once '../server/dbparams.php';

$contextId = $_POST['context'];
$parentId = $_POST['parentId'];

$parentConnections = array();
$query = "SELECT id, end_id from dgpath_connection where start_id = '$parentId'";
$parentConnectionResult = mysql_query($query);
if (!$parentConnectionResult) {
    die('Invalid query: ' . mysql_error());
}
$currentEvents = array();
$eventIds = array();
$query = "select dgpath_component.title as componentTitle, dgpath_component.id as componentId, dgpath_events.label as eventLabel, dgpath_events.id as eventId, dgpath_component.type as componentType, dgpath_component.context as componentContext, dgpath_component.subcontext as subcontext from dgpath_component, dgpath_events where dgpath_events.component_id  = dgpath_component.id and dgpath_component.type = 'exit_door' and dgpath_component.context = '$contextId'";
$exitQueryResult = mysql_query($query);
if (!$exitQueryResult) {
    die('Invalid query: ' . mysql_error());
}
while($row=mysql_fetch_array($exitQueryResult)){
    while($parentConnectionRow=mysql_fetch_array($parentConnectionResult)){
        $thisConnectionId = $parentConnectionRow['id'];
        $thisEventId = $row['eventId'];
        $thisComponentId = $row['componentId'];
        $thisComponentTitle = $row['componentTitle'];
        $thisEventLabel = $row['eventLabel'];
        $thisComponentType = $row['componentType'];
        $thisComponentContext = $row['componentContext'];
        $thisSubcontext = $row['subcontext'];
        array_push($currentEvents, array('eventId'=>$thisEventId, 'parentConnectionId'=>$thisConnectionId, 'componentId'=>$thisComponentId, 'conn_start_id'=>$thisComponentId, 'componentTitle'=>$thisComponentTitle, 'eventLabel'=>$thisEventLabel, 'componentType'=>$thisComponentType, 'componentContext'=>$thisComponentContext, 'subcontext'=>$thisSubcontext));
    }
    array_push($eventIds, $thisEventId);
}
$evts = "";
if(count($eventIds)>0){
    $evts = $eventIds[0];
    for($e=1;$e<count($eventIds);$e++){
        $evts = $evts.",";
        $evts = $evts.$eventIds[$e];
    }
}

$query = "select dgpath_rules.id as ruleId, dgpath_rules.connection_id as connectionId, dgpath_rules.event_id as eventId, dgpath_rules.necessary as necessary, dgpath_rules.necessary_ex as necessaryEx, dgpath_rules.sufficient as sufficient, dgpath_rules.sufficient_ex as sufficientEx from dgpath_rules where dgpath_rules.event_id in ('$evts')";
$ruleQueryResult = mysql_query($query);
if (!$ruleQueryResult) {
    die('Invalid query: ' . mysql_error());
}
$activatedRules = array();
while($row=mysql_fetch_array($ruleQueryResult)){
    $thisEventId = $row['eventId'];
    $thisActivatedRule = array('ruleId'=>$row['ruleId'], 'connectionId'=>$row['connectionId'], 'eventId'=>$row['eventId'], 'necessary'=>$row['necessary'], 'necessaryEx'=>$row['necessaryEx'], 'sufficient'=>$row['sufficient'], 'sufficientEx'=>$row['sufficientEx']);
    $activatedRules[$thisEventId] = $thisActivatedRule;
}

$results = array();
foreach($currentEvents as $thisEvent){
    $thisEventId = $thisEvent['eventId'];
    if($activatedRules[$thisEventId]!=null){
        $rulePresent = array('rulePresent'=>TRUE);
        $thisResult = array_merge($thisEvent, $activatedRules[$thisEventId],$rulePresent);
    }else{
        $rulePresent = array('rulePresent'=>FALSE);
        $thisEventConnection = array('connectionId'=>$thisEvent['connectionId']);
        $thisResult = array_merge($thisEvent, $thisEventConnection, $rulePresent);
    }
    array_push($results, $thisResult);
}
$jsonComponentsList = json_encode($results);
echo($jsonComponentsList);




