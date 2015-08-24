<?php
/**
 * Created by PhpStorm.
 * User: georgepipkin
 * Date: 2/22/14
 * Time: 10:18 AM
 */

require_once '../server/constants.php';
require_once '../server/jsonED.php';
require_once '../server/dbparams.php';




$thisConnectionId = $_POST['connectionId'];
$thisContextId = null;
$thisComponentId = $_POST['componentId'];

$query = "SELECT dgpath_component.subcontext from dgpath_component where id = '$thisComponentId'";
$result = mysql_query($query);
if (!$result) {
    die('Invalid query: ' . mysql_error());
}
$subContextFound = false;
while($row=mysql_fetch_array($result)){
    $thisContextId = $row['subcontext'];
    $subcontextFound = true;
}
if(!$subcontextFound){
    return "error no subcontext found";
}

$query = "select dgpath_events.label, dgpath_events.id from dgpath_events, dgpath_component ";
$query = $query."where dgpath_events.component_id = dgpath_component.id ";
$query = $query."and dgpath_component.type='exit_door' ";
$query = $query."and dgpath_component.context = '$thisContextId'";

$result = mysql_query($query);
if (!$result) {
    die('Invalid query: ' . mysql_error());
}
$exitDoorEvents = array();
$exitDoorIds = "";
while($row=mysql_fetch_array($result)){
    $exitDoorIds = $exitDoorIds.$row['id'].",";
    $thisExitDoorEvent = array('eventLabel'=>$row['label'], 'eventId'=>$row['id']);
    array_push($exitDoorEvents, $thisExitDoorEvent);
}
$exitDoorIds = substr($exitDoorIds, 0, -1);


$query = "select dgpath_rules.event_id, dgpath_rules.necessary, dgpath_rules.necessary_ex, dgpath_rules.sufficient from dgpath_rules ";
$query=$query."where dgpath_rules.event_id in (".$exitDoorIds.") ";
$query=$query."and dgpath_rules.connection_id = '$thisConnectionId'";

$rule_result = mysql_query($query);
if (!$rule_result) {
    die('Invalid query: ' . mysql_error());
}
$thisEventRules = array();
while($rule_row=mysql_fetch_array($rule_result)){
    $ruleKey = $rule_row['event_id'];
    $thisEventRules[$ruleKey] = array('eventId'=>$rule_row['event_id'], 'necessary'=>$rule_row['necessary'], 'sufficient'=>$rule_row['sufficient'], 'exclude'=>$rule_row['necessary_ex']);
}
$returnData = array();
foreach($exitDoorEvents as $thisExitDoorEvent){
    $eventKey = $thisExitDoorEvent['eventId'];
    $thisRuleInfo = $thisEventRules[$eventKey];
    if($thisRuleInfo == null){
        $thisReturnData = array('eventLabel'=>$thisExitDoorEvent['eventLabel'], 'eventId'=>$thisExitDoorEvent['eventId'], 'necessary'=>0, 'sufficient'=>0, 'exclude'=>0);
        array_push($returnData, $thisReturnData);
    }else{
        $thisReturnData = array('eventLabel'=>$thisExitDoorEvent['eventLabel'], 'eventId'=>$thisExitDoorEvent['eventId'], 'necessary'=>$thisRuleInfo['necessary'], 'sufficient'=>$thisRuleInfo['sufficient'], 'exclude'=>$thisRuleInfo['exclude']);
        array_push($returnData, $thisReturnData);
    }
}
$jsonComponentsList = json_encode($returnData);
echo($jsonComponentsList);

