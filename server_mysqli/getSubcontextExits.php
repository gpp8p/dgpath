<?php
/**
 * Created by PhpStorm.
 * User: georgepipkin
 * Date: 2/22/14
 * Time: 10:18 AM
 */

require_once '../server_mysqli/constants.php';
require_once '../server_mysqli/jsonED.php';
require_once '../server_mysqli/dbparams.php';
require_once '../server_mysqli/preparedQuery.php';




$thisConnectionId = $_POST['connectionId'];
$thisContextId = null;
$thisComponentId = $_POST['componentId'];

$query = "SELECT dgpath_component.subcontext from dgpath_component where id = ?";
$connectionParams = array($thisComponentId);
$userQueryResult = mysqli_prepared_query($link,$query,"s",$connectionParams);
if ($connectionResult[0]=="error") {
    header('HTTP/1.0 400 connection error look up user subcontext query');
    exit;
}




$subContextFound = false;
foreach($userQueryResult as $row){
    $thisContextId = $row['subcontext'];
    $subcontextFound = true;
}
if(!$subcontextFound){
    header('HTTP/1.0 400 connection error n subcontext found');
    exit;
}

$query = "select dgpath_events.label, dgpath_events.id from dgpath_events, dgpath_component ";
$query = $query."where dgpath_events.component_id = dgpath_component.id ";
$query = $query."and dgpath_component.type='exit_door' ";
$query = $query."and dgpath_component.context = ?";

$connectionParams = array($thisContextId);
$userQueryResult = mysqli_prepared_query($link,$query,"s",$connectionParams);
if ($connectionResult[0]=="error") {
    header('HTTP/1.0 400 connection error look up user subcontext component query');
    exit;
}

$exitDoorEvents = array();
$exitDoorIds = "";
foreach($userQueryResult as $row){
    $exitDoorIds = $exitDoorIds.$row['id'].",";
    $thisExitDoorEvent = array('eventLabel'=>$row['label'], 'eventId'=>$row['id']);
    array_push($exitDoorEvents, $thisExitDoorEvent);
}
$exitDoorIds = substr($exitDoorIds, 0, -1);


$query = "select dgpath_rules.event_id, dgpath_rules.necessary, dgpath_rules.necessary_ex, dgpath_rules.sufficient from dgpath_rules ";
$query=$query."where dgpath_rules.event_id in (?) ";
$query=$query."and dgpath_rules.connection_id = ?";

$connectionParams = array($exitDoorIds,$thisConnectionId);
$userQueryResult = mysqli_prepared_query($link,$query,"ss",$connectionParams);

if ($connectionResult[0]=="error") {
    header('HTTP/1.0 400 connection error look up user rule query');
    exit;
}

$thisEventRules = array();
foreach($userQueryResult as $rule_row){
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

