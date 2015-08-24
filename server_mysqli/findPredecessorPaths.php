<?php
/**
 * Created by PhpStorm.
 * User: georgepipkin
 * Date: 8/23/14
 * Time: 3:21 PM
 */

require_once '../server_mysqli/jsonED.php';
require_once '../server_mysqli/constants.php';
require_once '../server_mysqli/loadComponents.php';
require_once '../server_mysqli/dbparams.php';
require_once '../server_mysqli/preparedQuery.php';


//$projectId = 2;

$componentId = $_POST['componentId'];
$thisConnectionId = $_POST['connectionId'];


//$componentId = 615;
//$thisConnectionId = 304;



// this query determines the starting and ending place for what the user sees
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

$startEndTitles = array('startTitle'=>$startComponentTitle, 'endTitle'=>$endComponentTitle, 'goAhead'=>$goAhead);


// this query gets the info on the first component in the chain
$results = array();
$query = "select dgpath_component.id as componentId, dgpath_component.type as componentType, dgpath_component.subcontext as subContextId,";
$query = $query."dgpath_component.title as componentTitle, dgpath_events.id as eventId, ";
$query = $query."dgpath_events.label as eventLabel, dgpath_events.event_type as eventType, dgpath_events.sub_param as sub_param ";
$query = $query."from dgpath_component, dgpath_events ";
$query = $query."where dgpath_events.component_id = dgpath_component.id ";
$query = $query."and dgpath_component.id = ?";

$connectionParams = array($componentId);
$queryResult = mysqli_prepared_query($link,$query,"s",$connectionParams);

$nodesToVisit = array();
$visitedNodes = array();

if ($queryResult[0]=="error") {
    header('HTTP/1.0 400 connection error look up user on connection query');
    exit;
}
foreach($queryResult as $row){
    array_push($results, array($row['eventId'],$row['componentId'],$row['componentType'],$row['componentTitle'], $row['eventLabel'],$row['eventType'], $thisConnectionId, $row['sub_param']));
    array_push($visitedNodes, $row['eventId']);



    if($row['componentType']=='subcontext'){
        $scExits = getExitsFromSubContext($row['subContextId'], $link);
        $exitCount = 0;
        foreach($scExits as $thisExit){
            $exitCount++;
        }
        if($exitCount==1) {
            foreach ($scExits as $thisExit) {
                array_push($nodesToVisit, $thisExit);
            }
        }else{
            foreach ($scExits as $thisExit) {
                $exitQueryResult = getComponentData($thisExit, $link);
                foreach($exitQueryResult as $exitRow){
// possible problem here with connectionId
                    array_push($results, array($exitRow['eventId'],$exitRow['componentId'],$exitRow['componentType'],$exitRow['componentTitle'], $exitRow['eventLabel'],$exitRow['eventType'], $thisConnectionId, $exitRow['sub_param']));
                }

            }
        }
        // if its an entry door, push the contextid onto the stack
    }

}

// the way this works is a component id is pushed on the 'nodes to visit' stack, and it continues to search untill this stack is empty
// this is a straight-out 'frontioer-node' search algorithm

array_push($nodesToVisit, $componentId);

// the results of this query are redundant insofar as the component data is concerned.  What changes is the event data,
// and then the component data for each component

// warning - check code for circular (ie repeat visits) after subcontext emergence!

while(count($nodesToVisit)>0){
    $nodeToVisitId = array_shift($nodesToVisit);
    $thisResult = getPathsFromComponent($nodeToVisitId, $link);
    if(count($thisResult>0)){
        foreach($thisResult as $thisNode){
            if($thisNode['thisGoAhead']>0 && !in_array($thisNode['thisComponentId'], $visitedNodes)){
                // if its a subcontext, push the entry and exits onto the nodes to visit stack
                if($thisNode['thisComponentType']=='subcontext'){
                    $scExits = getExitsFromSubContext($thisNode['thisSubContextId'], $link);
                    foreach($scExits as $thisExit){
                        array_push($nodesToVisit,$thisExit);
                    }
                // if its an entry door, push the contextid onto the stack
                }else if($thisNode['thisComponentType']=='entry_door'){
                    $scComponent=getSubContextComponentId($thisNode['thisContextId'], $link);
                    foreach($scComponent as $thisScComponent){
                        array_push($nodesToVisit, $thisScComponent);
                    }
                }else{
                    // otherwise, go through each node, pushing the data onto results
                    array_push($nodesToVisit,$thisNode['thisComponentId']);
                    // we're looping througfhg the changing event data here
                    foreach($thisNode['eventsFound'] as $thisFoundEvent){
                        $eventIndex = $thisFoundEvent[2]."-".$thisNode['thisConnectionId'];
//                        array_push($results, array($thisFoundEvent[2],$thisNode['thisComponentId'],$thisNode['thisComponentType'],$thisNode['thisComponentTitle'],$thisFoundEvent[0],$thisFoundEvent[1]));
                        array_push($results, array($thisFoundEvent[2],$thisNode['thisComponentId'],$thisNode['thisComponentType'],$thisNode['thisComponentTitle'],$thisFoundEvent[0],$thisFoundEvent[1],$thisNode['thisConnectionId'], $thisFoundEvent[3]));
                        array_push($visitedNodes, $thisFoundEvent[2]);
                    }
                }
            }
        }
    }
}
$vNodes = "";
$nodeCount = count($visitedNodes);
$v=1;
foreach($visitedNodes as $thisVisitedNodeId){
    if($v<$nodeCount){
        $vNodes = $vNodes.$thisVisitedNodeId.",";
    }else{
        $vNodes = $vNodes.$thisVisitedNodeId;
    }
    $v++;
}
$activatedRules = getPathRules($vNodes, $link);
$activatedRuleHash=array();
foreach($activatedRules as $thisActivatedRule){
    $activatedRuleKey = $thisActivatedRule[2]."-".$thisActivatedRule[0];
    $activatedRuleHash[$activatedRuleKey]= $thisActivatedRule[1];
}
$pathsFound = array();
// get the activate value and add that to result for each node.  Build the proper key
foreach($results as $thisResult){
    $ruleKey = $thisResult[0]."-".$thisResult[6];
    $activatedValue = $activatedRuleHash[$ruleKey];
    if($activatedValue==null){
        array_push($thisResult,0);
    }else{
        array_push($thisResult,$activatedValue);
    }
    array_push($pathsFound, $thisResult);
}
$outputResults = array();
array_push($outputResults, $startEndTitles);
array_push($outputResults, $pathsFound);
$jsonComponent = json_encode($outputResults);
echo($jsonComponent);




function getPathsFromComponent($componentId, $link){

    $eventsFound = array();


$query = "select dgpath_events.label as eventLabel, dgpath_events.id as eventId, dgpath_events.event_type as eventType, dgpath_events.sub_param as sub_param, dgpath_component.id as componentId, cast(dgpath_connection.go_ahead as unsigned)  as goAhead, dgpath_component.type as componentType, dgpath_component.subcontext as subContextId, dgpath_component.context as contextId, dgpath_component.title as componentTitle, dgpath_connection.id as connectionId from dgpath_component, dgpath_events, dgpath_connection ";
$query = $query."where dgpath_events.component_id = dgpath_component.id ";
$query = $query."and dgpath_connection.start_id = dgpath_component.id ";
$query = $query."and dgpath_connection.end_id=? ";
$query = $query."order by dgpath_component.id";


//    $query=$query."and dgpath_connection.go_ahead = 1";

    $connectionParams = array($componentId);
    $predecessorQueryResult = mysqli_prepared_query($link,$query,"s",$connectionParams);
    if ($predecessorQueryResult[0]=="error") {
        header('HTTP/1.0 400 connection error look up user on paths query');
        exit;
    }
    $pathsFound = array();
    $thisComponentId  = null;
    $thisComponentId  = null;
    $thisSubContextId = null;
    $thisGoAhead = null;
    $thisComponentType = null;
    $thisContextId = null;
    $thisComponentTitle = null;
    $thisEventResult = array();

// to fix - find out what's going on with $thisConnectionId

    foreach($predecessorQueryResult as $data){
        if($data['componentId']!=$thisComponentId && $thisComponentId!=null){
            $thisPath = array('thisComponentId'=>$thisComponentId, 'thisConnectionId' =>$thisConnectionId, 'thisSubContextId'=>$thisSubContextId, 'thisGoAhead'=>$thisGoAhead,'thisComponentType'=>$thisComponentType,'thisContextId'=>$thisContextId,'thisComponentTitle'=>$thisComponentTitle,'eventsFound'=>$eventsFound);
            array_push($pathsFound, $thisPath);
            $eventsFound = array();
        }
        $thisComponentId  = $data['componentId'];
        $thisSubContextId = 0;
        if($data['componentType']=='subcontext'){
            $thisSubContextId = $data['subContextId'];
        }
        $thisGoAhead = $data['goAhead'];
        $thisComponentType = $data['componentType'];
        $thisContextId = $data['contextId'];
        $thisConnectionId = $data['connectionId'];
        $thisComponentTitle = $data['componentTitle'];
        $thisEventResult = array( $data['eventLabel'], $data['eventType'], $data['eventId'], $data['sub_param']);
        array_push($eventsFound, $thisEventResult);
    }
    $thisPath = array('thisComponentId'=>$thisComponentId, 'thisConnectionId' =>$thisConnectionId, 'thisSubContextId'=>$thisSubContextId, 'thisGoAhead'=>$thisGoAhead,'thisComponentType'=>$thisComponentType,'thisContextId'=>$thisContextId, 'thisComponentTitle'=>$thisComponentTitle, 'eventsFound'=>$eventsFound);
    array_push($pathsFound, $thisPath);
    return $pathsFound;
}

function getExitsFromSubContext($contextId, $link){

    $query = "select dgpath_component.id from dgpath_component where dgpath_component.type = 'exit_door' and dgpath_component.context = ?";
    $connectionParams = array($contextId);
    $exitQueryResult = mysqli_prepared_query($link,$query,"s",$connectionParams);
    if ($exitQueryResult[0]=="error") {
        header('HTTP/1.0 400 connection error look up user on exit query');
        exit;
    }
    $exitIds = array();
    foreach($exitQueryResult as $exit){
        array_push($exitIds, $exit['id']);
    }
    return $exitIds;
}

function getSubContextComponentId($contextId, $link){

    $query = "select dgpath_component.id from dgpath_component where dgpath_component.type = 'subcontext' and dgpath_component.subcontext = ?";
    $connectionParams = array($contextId);
    $subcontextQueryResult = mysqli_prepared_query($link,$query,"s",$connectionParams);
    if ($subcontextQueryResult[0]=="error") {
        header('HTTP/1.0 400 connection error look up user on entrance query');
        exit;
    }
    $subcontextId = array();
    foreach($subcontextQueryResult as $subcontext){
        array_push($subcontextId, $subcontext['id']);
    }
    return $subcontextId;

}

function getPathRules($eventsToCheck, $link){



        $result = array();
        if(strlen($eventsToCheck)==0) return $result;
        $query = "select dgpath_rules.connection_id as connectionId, dgpath_rules.activate as activate, dgpath_rules.event_id as eventId from dgpath_rules where dgpath_rules.event_id in (";
        $query = $query.$eventsToCheck.")";
        if($stmt = mysqli_prepare($link, $query)){
            mysqli_stmt_execute($stmt);
            mysqli_stmt_bind_result($stmt, $thisConnectionId, $thisConnectionActivate, $thisConnectionEventId);
            while (mysqli_stmt_fetch($stmt)) {
                $thisEntry = array($thisConnectionId, $thisConnectionActivate, $thisConnectionEventId);
                array_push($result, $thisEntry);
            }
        }else{
            header('HTTP/1.0 400 Bad connection query');
            exit;
        }
        return $result;
}

function getComponentData($componentId, $link){

    $query = "select dgpath_component.id as componentId, dgpath_component.type as componentType, dgpath_component.subcontext as subContextId,";
    $query = $query."dgpath_component.title as componentTitle, dgpath_events.id as eventId, ";
    $query = $query."dgpath_events.label as eventLabel, dgpath_events.event_type as eventType, dgpath_events.sub_param as sub_param ";
    $query = $query."from dgpath_component, dgpath_events ";
    $query = $query."where dgpath_events.component_id = dgpath_component.id ";
    $query = $query."and dgpath_component.id = ?";

    $connectionParams = array($componentId);
    $queryResult = mysqli_prepared_query($link,$query,"s",$connectionParams);

    return $queryResult;



}