<?php
/**
 * Created by PhpStorm.
 * User: georgepipkin
 * Date: 2/9/14
 * Time: 10:39 AM
 */

require_once '../server/constants.php';
require_once '../server/jsonED.php';
require_once '../server/dbparams.php';

$thisContextId = $_POST['contextId'];
$thisComponentId = $_POST["componentId"];

$query = "SELECT dgpath_connection.id as connectionId, dgpath_connection.start_id as conn_start_id, dgpath_connection.end_id as conn_end_id, dgpath_component.title as componentTitle from dgpath_connection, dgpath_component where dgpath_component.id = dgpath_connection.end_id and dgpath_component.context = '$thisContextId'";

$result = mysql_query($query);
if (!$result) {
    die('Invalid query: ' . mysql_error());
}
$dataFound = false;
$componentConnections = array();
$paths = array();
$componentConnectionIds = "";
while($row=mysql_fetch_array($result)){
    $thisPath = array($row['conn_start_id'], $row['conn_end_id'],0);
    $thisConnectionStart = $row['conn_start_id'];
    $componentConnectionIds = $componentConnectionIds.$row['connectionId'].",";
    $thisConnection = array('connectionId'=>$row['connectionId'], 'start'=>$row['conn_start_id'], 'end'=>$row['conn_end_id'], 'endComponentTitle'=>$row['componentTitle']);
    if($componentConnections[$thisConnectionStart]==null){
        $componentConnections[$thisConnectionStart] = array();
        array_push($componentConnections[$thisConnectionStart] , $thisConnection);
    }else{
        array_push($componentConnections[$thisConnectionStart],$thisConnection);
    }
    array_push($paths,$thisPath);
    $dataFound=true;
}
if(!$dataFound){
    die("no paths found");
}
$componentConnectionIds = substr($componentConnectionIds,0, -1);

$foundPredecessors = array();
lookForPredecessor($paths, $foundPredecessors, intval($thisComponentId));
$predecessorNodes = weedDuplicates($foundPredecessors);

$preds = $thisComponentId;
for($p = 0;$p<count($predecessorNodes);$p++){
    $pn = $predecessorNodes[$p];
    $preds = $preds.",";
    $preds = $preds.strval($pn);
}


$query = "select dgpath_rules.id as ruleId, dgpath_rules.connection_id as connectionId, dgpath_rules.event_id as eventId, dgpath_rules.necessary as necessary, dgpath_rules.necessary_ex as necessaryEx, dgpath_rules.sufficient as sufficient, dgpath_rules.sufficient_ex as sufficientEx ";
$query = $query."from dgpath_rules ";
$query = $query."where dgpath_rules.connection_id in ( ".$componentConnectionIds.") ";
$result = mysql_query($query);
if (!$result) {
    die('Invalid query: ' . mysql_error());
}
$contextRules = array();
while($row=mysql_fetch_array($result)){
    $thisRule = array('ruleId'=>$row['ruleId'], 'connectionId'=>$row['connectionId'], 'eventId'=>$row['eventId'], 'necessary'=>$row['necessary'], 'necessaryEx'=>$row['necessaryEx'], 'sufficient'=>$row['sufficient'], 'sufficientEx'=>$row['sufficientEx']);
    $ruleKey = $row['connectionId'].".".$row['eventId'];
    $contextRules[$ruleKey]= $thisRule;
}



$query = "select dgpath_component.id as lpc_id, dgpath_component.title as lpc_title,  dgpath_events.label as lpe_label, dgpath_events.id as lpe_id, dgpath_component.type as type, dgpath_component.context as context,  dgpath_component.subcontext as subcontext ";
$query = $query."from dgpath_component, dgpath_events ";
$query = $query."where dgpath_component.id = dgpath_events.component_id ";
$query = $query."and dgpath_component.id in (".$preds.") order by dgpath_component.id";

$result = mysql_query($query);
if (!$result) {
    die('Invalid query: ' . mysql_error());
}
$dataFound = false;
$contextEventEntries = array();
while($row=mysql_fetch_array($result)){
    $thisComponentId = $row['lpc_id'];
    if($componentConnections[$thisComponentId]!=null){
        $thisComponentConnections = $componentConnections[$thisComponentId];
        foreach($thisComponentConnections as $connection){
            $eventOptionRow = array('eventLabel'=>$row['lpe_label'],'componentTitle'=>$connection['endComponentTitle'], 'componentId'=>$row['lpc_id'], 'eventId'=>$row['lpe_id'], 'componentConnectionId'=> $connection['connectionId'] );
            array_push($contextEventEntries, $eventOptionRow);
        }
    }
}
$query = "select dgpath_component.id as lpc_id,dgpath_component.subcontext as subcontext ";
$query = $query."from dgpath_component ";
$query = $query."where dgpath_component.id in (".$preds.") ";
$query = $query."and dgpath_component.subcontext is not null ";
$result = mysql_query($query);
if (!$result) {
    die('Invalid query: ' . mysql_error());
}
while($row=mysql_fetch_array($result)){
    $thisComponentId = $row['lpc_id'];
    $subContextId = $row['subcontext'];
    $subcontextQuery = "select  dgpath_component.id as componentId, dgpath_events.label as eventLabel, dgpath_events.id as eventId from dgpath_component, dgpath_events where dgpath_events.component_id  = dgpath_component.id and dgpath_component.type = 'exit_door' and dgpath_component.context = '$subContextId'";
    $subContextResult = mysql_query($subcontextQuery);
    if($componentConnections[$thisComponentId]!=null){
        $thisComponentConnections = $componentConnections[$thisComponentId];
        foreach($thisComponentConnections as $connection){
            while($subContextRow=mysql_fetch_array($subContextResult)){
                $eventOptionRow = array('eventLabel'=>$row['lpe_label'],'componentTitle'=>$connection['endComponentTitle'], 'componentId'=>$row['lpc_id'], 'eventId'=>$row['lpe_id'], 'componentConnectionId'=> $connection['connectionId'] );
                array_push($contextEventEntries, $eventOptionRow);
            }
        }
    }
}

// bookmark - go through the components in $preds and get the one that are subcontexts.  Then get all the exit_doors from those, and the events associated with those exit doors.



//        $thisComponentEvent = array('componentId'=>$row['lpc_id'], 'componentTitle'=>$row['lpc_title'], 'eventLabel'=>$row['lpe_label'], 'eventId'=>$row['lpe_id'], 'componentType'=>$row['type'], 'componentContext'=>$row['context'], 'subcontext'=>$row['subcontext']);





echo("ok");


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
