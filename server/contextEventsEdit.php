<?php
/**
 * Created by JetBrains PhpStorm.
 * User: georgepipkin
 * Date: 3/3/13
 * Time: 12:26 PM
 * To change this template use File | Settings | File Templates.
 */


require_once '../server/constants.php';
require_once '../server/jsonED.php';
require_once '../server/dbparams.php';


$thisComponentId = $_POST["componentId"];
$thisContextId = $_POST['contextId'];
$thisConnectionId = $_POST['connectionId'];



$paths = array();

//$query = "SELECT dgpath_connection.id as connectionId, dgpath_connection.start_id as conn_start_id, dgpath_connection.end_id as conn_end_id from dgpath_connection, dgpath_component ";
//$query = $query."where dgpath_component.id = dgpath_connection.start_id ";
//$query = $query."and dgpath_component.context = '$thisContextId'";

$query = "SELECT dgpath_connection.id as connectionId, dgpath_connection.start_id as conn_start_id, dgpath_connection.end_id as conn_end_id, dgpath_component.title as componentTitle from dgpath_connection, dgpath_component where dgpath_component.id = dgpath_connection.end_id and dgpath_component.context = '$thisContextId'";

$result = mysql_query($query);
if (!$result) {
    die('Invalid query: ' . mysql_error());
}
$dataFound = false;
$componentConnections = array();
while($row=mysql_fetch_array($result)){
    $thisPath = array($row['conn_start_id'], $row['conn_end_id'],0);
    array_push($paths,$thisPath);
    $connectedComponentId = $row['conn_start_id'];
    $thisComponentConnection = array('componentConnectionId'=>$row['connectionId'], 'conn_start_id'=>$row['conn_start_id'], 'conn_end_id'=>$row['conn_end_id'], 'componenbtTitle'=>$row['componentTitle']);
    if($componentConnections[$connectedComponentId]==null){
        $componentConnections[$connectedComponentId] = array();
        array_push($componentConnections[$connectedComponentId] , $thisComponentConnection);
    }else{
        array_push($componentConnections[$connectedComponentId],$thisComponentConnection);
    }
    $dataFound=true;
}
if(!$dataFound){
    die("no paths found");
}

$foundPredecessors = array();
lookForPredecessor($paths, $foundPredecessors, intval($thisComponentId));
$predecessorNodes = weedDuplicates($foundPredecessors);

$preds = $thisComponentId;
for($p = 0;$p<count($predecessorNodes);$p++){
    $pn = $predecessorNodes[$p];
    $preds = $preds.",";
    $preds = $preds.strval($pn);
}

$query = "select dgpath_component.id as lpc_id, dgpath_component.title as lpc_title,  dgpath_events.label as lpe_label, dgpath_events.id as lpe_id, ";
$query = $query."dgpath_component.type as type, dgpath_component.context as context,  dgpath_component.subcontext as subcontext ";
$query = $query."from dgpath_component, dgpath_events where ";
$query = $query."dgpath_component.id = dgpath_events.component_id ";
$query = $query."and dgpath_component.id in (".$preds.") order by dgpath_component.id";

$result = mysql_query($query);
if (!$result) {
    die('Invalid query: ' . mysql_error());
}
$dataFound = false;
$projectEvents = array();
while($row=mysql_fetch_array($result)){

    if($row['subcontext']==null){
        $thisProjectEvent = array('componentId'=>$row['lpc_id'], 'componentTitle'=>$row['lpc_title'], 'eventLabel'=>$row['lpe_label'], 'eventId'=>$row['lpe_id'], 'componentType'=>$row['type'], 'componentContext'=>$row['context'], 'subcontext'=>'');
    }else{
        $thisProjectEvent = array('componentId'=>$row['lpc_id'], 'componentTitle'=>$row['lpc_title'], 'eventLabel'=>$row['lpe_label'], 'eventId'=>$row['lpe_id'], 'componentType'=>$row['type'], 'componentContext'=>$row['context'], 'subcontext'=>$row['subcontext']);
    }
    array_push( $projectEvents, $thisProjectEvent);

}
$query = "select id from dgpath_connection where (dgpath_connection.start_id in (".$preds.") and dgpath_connection.end_id in (".$preds.")) or dgpath_connection.start_id = '$thisComponentId'";
$result = mysql_query($query);
if (!$result) {
    die('Invalid query: ' . mysql_error());
}
$relevantConnections = array();
while($row=mysql_fetch_array($result)){
    array_push($relevantConnections, $row['id']);
}




$query = "select dgpath_rules.id as ruleId, dgpath_rules.connection_id as connectionId, dgpath_rules.event_id as eventId, dgpath_rules.necessary as necessary, dgpath_rules.necessary_ex as necessaryEx, dgpath_rules.sufficient as sufficient, dgpath_rules.sufficient_ex as sufficientEx ";
$query = $query."from dgpath_rules ";
$query = $query."where dgpath_rules.connection_id in ( ";
$query = $query."select dgpath_connection.id from dgpath_connection where ";
$query = $query."dgpath_connection.start_id in( ";
$query = $query."select dgpath_events.component_id from dgpath_rules, dgpath_events where ";
$query = $query."dgpath_rules.event_id = dgpath_events.id ";
$query = $query."and dgpath_events.id in ( ";
$query = $query."select dgpath_events.id ";
$query = $query."from dgpath_component, dgpath_events where ";
$query = $query."dgpath_component.id = dgpath_events.component_id ";
$query = $query."and dgpath_component.id in (".$preds.") ";
$query = $query.") ";
$query = $query.") ";
$query = $query.")";

$result = mysql_query($query);
if (!$result) {
    die('Invalid query: ' . mysql_error());
}
$activatedRules = array();
while($row=mysql_fetch_array($result)){
    if(in_array($row['connectionId'], $relevantConnections)){
        $thisEventId = $row['eventId'];
        $thisActivatedRule = array('ruleId'=>$row['ruleId'], 'connectionId'=>$row['connectionId'], 'eventId'=>$row['eventId'], 'necessary'=>$row['necessary'], 'necessaryEx'=>$row['necessaryEx'], 'sufficient'=>$row['sufficient'], 'sufficientEx'=>$row['sufficientEx']);
        $activatedRules[$thisEventId] = $thisActivatedRule;
    }
}
$results = array();
foreach($projectEvents as $thisEvent){
    $componentConnectionInfo = $componentConnections[$thisEvent['componentId']];
    foreach($componentConnectionInfo as $thisComponentConnectionInfo){
        $thisEventId = $thisEvent['eventId'];
        if($activatedRules[$thisEventId]!=null){
            $rulePresent = array('rulePresent'=>TRUE);
            $thisResult = array_merge($thisEvent, $activatedRules[$thisEventId],$thisComponentConnectionInfo, $rulePresent);
        }else{
            $rulePresent = array('rulePresent'=>FALSE);
            $thisResult = array_merge($thisEvent, $thisComponentConnectionInfo, $rulePresent);
        }
        array_push($results, $thisResult);
    }
}


$jsonProjectEvents = json_encode($results);
echo($jsonProjectEvents);










function frontierNodes($at, &$nodes){
    $thisFrontier = array();
    for($i=0;$i<count($nodes);$i++){
        $thisNode = $nodes[$i];
        if($thisNode[1]==$at && $thisNode[2]==0){
            $nodes[$i][2] = 1;
            $thisFrontier[]=$nodes[$i];
        }
    }
    return $thisFrontier;
}


function lookForPredecessor(&$nodes, &$predecessorNodes, $startAt){
    $thisFrontier = frontierNodes($startAt, $nodes);
    if(count($thisFrontier)==0){
        return;
    }else{
        foreach($thisFrontier as $f){
            $predecessorNodes[] = $f;
            lookForPredecessor($nodes, $predecessorNodes, $f[0]);
        }
    }
}

function weedDuplicates($foundPredecessors){
    $predecessorNodes = array();


    foreach($foundPredecessors as $t){
//        echo($t[0]."-".$t[1]."-".$t[2]."\n");
        if(! in_array($t[0], $predecessorNodes)){
            $predecessorNodes[]=$t[0];
        }
    }
    return $predecessorNodes;
}
