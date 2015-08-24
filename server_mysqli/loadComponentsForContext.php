<?php
/**
 * Created by PhpStorm.
 * User: georgepipkin
 * Date: 12/21/14
 * Time: 9:06 AM
 */
require_once '../server_mysqli/jsonED.php';
require_once '../server_mysqli/constants.php';
require_once '../server_mysqli/dbparams.php';
require_once '../server_mysqli/preparedQuery.php';

$contextId = $_POST['context'];

$query=<<<EOQ
select dgpath_component.id, dgpath_component.title, dgpath_component.content, dgpath_component.type, dgpath_component.x, dgpath_component.y, dgpath_component.context, dgpath_events.component_id, dgpath_events.label, dgpath_events.event_type, dgpath_events.sub_param, dgpath_events.id as eid
from dgpath_component, dgpath_events
where dgpath_events.component_id = dgpath_component.id
and dgpath_component.context = ?
order by dgpath_component.id;
EOQ;

$params = array($contextId);
$componentQueryResult = mysqli_prepared_query($link,$query,"s",$params);


//    $componentQueryResult = mysql_query($query);
if (!$componentQueryResult) {
    die('Invalid query: ' . mysql_error());
}
$dataFound = false;

$allComponents = array();
$currentComponentEvents = array();
$firstRow=true;
//    while($row=mysql_fetch_array($componentQueryResult)){
foreach($componentQueryResult as $row){
    $component_id = $row['component_id'];
    if(!$dataFound){
        $component_title = $row['title'];
        $componentXpos = $row['x'];
        $componentYpos = $row['y'];
        $componentType = $row['type'];
        $currentComponentEvents = array();
        $currentComponentId = $component_id;
        $componentContent = $row['content'];
        $query2=<<<EOQ2
select dgpath_connection.start_id, dgpath_connection.end_id, dgpath_connection.id as connectionId
from dgpath_connection
where dgpath_connection.start_id=?;
EOQ2;

//            $connectionResult = mysql_query($query2);
        $connectionParams = array($currentComponentId);
        $connectionResult = mysqli_prepared_query($link,$query2,"s",$connectionParams);

        if ($connectionResult[0]=="error") {
            die('Invalid query: ' . mysql_error());
        }
        $dataFound2 = false;
        $componentConnections = array();
//            while($connectionsRow=mysql_fetch_array($connectionResult)){
        foreach($connectionResult as $connectionsRow){
            $thisConnectionId=$connectionsRow['connectionId'];
            $thisConnectionStartId = $connectionsRow['start_id'];
            $thisConnectionEndId = $connectionsRow['end_id'];
            $connection = array('id'=>$thisConnectionId, 'start_id'=>$thisConnectionStartId, 'end_id'=>$thisConnectionEndId);
            array_push($componentConnections,$connection);
        }
        $currentComponentId = $component_id;
        $dataFound = true;
    }
    if($currentComponentId!=$component_id){
        $currentComponent = array('title'=>$component_title, 'content'=>$componentContent, 'id'=>$saveId, 'x'=>$componentXpos, 'y'=>$componentYpos, 'type'=>$componentType, 'events'=>$currentComponentEvents, 'connections'=>$componentConnections);
        array_push($allComponents,$currentComponent);
        $component_title = $row['title'];
        $componentXpos = $row['x'];
        $componentYpos = $row['y'];
        $componentType = $row['type'];
        $componentContent = $row['content'];
        $id = $row['id'];
        $saveId = $id;
        $label = $row['label'];
        $event_type = $row['event_type'];
        $thisComponentEvent = array('event_id'=>$id, 'event_label'=>$label, 'type'=>$event_type);
        $currentComponentId = $component_id;

        $query2=<<<EOQ2
select dgpath_connection.start_id, dgpath_connection.end_id, dgpath_connection.id as connectionId, dgpath_connection.go_ahead as goAhead
from dgpath_connection
where dgpath_connection.start_id=?;
EOQ2;
//            $connectionResult = mysql_query($query2);
        $connectionParams = array($currentComponentId);
        $connectionResult = mysqli_prepared_query($link,$query2,"s",$connectionParams);

        if ($connectionResult[0]=="error") {
            die('Invalid query: ' . mysql_error());
        }
        $dataFound2 = false;
        $componentConnections = array();
//            while($connectionsRow=mysql_fetch_array($connectionResult)){
        foreach($connectionResult as $connectionsRow){
            $thisConnectionId=$connectionsRow['connectionId'];
            $thisConnectionStartId = $connectionsRow['start_id'];
            $thisConnectionEndId = $connectionsRow['end_id'];
            $thisConnectionGoAhead = $connectionsRow['goAhead'];
            $connection = array('id'=>$thisConnectionId, 'start_id'=>$thisConnectionStartId, 'end_id'=>$thisConnectionEndId, 'goAhead'=>$thisConnectionGoAhead);
            array_push($componentConnections,$connection);
        }
        $currentComponentEvents=array();
        array_push($currentComponentEvents, $thisComponentEvent);
    }else{
        $id = $row['id'];
        $label = $row['label'];
        $event_type = $row['event_type'];
        $thisComponentEvent = array('event_id'=>$id, 'event_label'=>$label, 'type'=>$event_type);
        array_push($currentComponentEvents, $thisComponentEvent);
        $saveId = $component_id;
    }

}
$currentComponent = array('title'=>$component_title, 'content'=>$componentContent, 'id'=>$saveId, 'x'=>$componentXpos, 'y'=>$componentYpos, 'type'=>$componentType, 'events'=>$currentComponentEvents, 'connections'=>$componentConnections);
array_push($allComponents,$currentComponent);
$parentContextExists = TRUE;
$contextInfo = array();
$query = "SELECT title, parent, topcontext, id  from dgpath_context where id = ?";
while($parentContextExists){
    $params = array($contextId);
    $contextQueryResult = mysqli_prepared_query($link,$query,"s",$params);
    $thisContextTopContext = 0;
    foreach($contextQueryResult as $row){
        $thisContextTitle = $row['title'];
        $thisContextParent = $row['parent'];
        $thisContextTopContext = $row['topcontext'];
        $thisContextId = $row['id'];
        $thisContextInfo = array('contextTitle'=>$thisContextTitle, 'contextParent'=>$thisContextParent, 'topContext'=>$thisContextTopContext, 'contextId'=>$thisContextId);
        array_push($contextInfo, $thisContextInfo);
    }
    if($thisContextTopContext==1){
        $parentContextExists = FALSE;
    }else{
        $parentComponentQuery = "SELECT context from dgpath_component where id = ?";
        $parentQueryParams = array($thisContextParent);
        $parentContextQueryResult = mysqli_prepared_query($link,$parentComponentQuery,"s",$parentQueryParams);
        $parentFound=FALSE;
        foreach($parentContextQueryResult as $parentRow){
            $contextId = $parentRow['context'];
            $parentFound=TRUE;
        }
        if(!$parentFound){
            die('parent not found in copntext search');
        }
    }
}
$results = array($allComponents, $contextInfo);
$jsonComponentsList = json_encode($results);
echo($jsonComponentsList);
