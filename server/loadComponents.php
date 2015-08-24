<?php
/**
 * Created by JetBrains PhpStorm.
 * User: georgepipkin
 * Date: 1/23/13
 * Time: 6:46 PM
 * To change this template use File | Settings | File Templates.
 */


function loadComponents($contextId){

$query=<<<EOQ
select dgpath_component.id, dgpath_component.title, dgpath_component.content, dgpath_component.type, dgpath_component.x, dgpath_component.y, dgpath_component.context, dgpath_events.component_id, dgpath_events.label, dgpath_events.event_type, dgpath_events.sub_param, dgpath_events.id as eid
from dgpath_component, dgpath_events
where dgpath_events.component_id = dgpath_component.id
and dgpath_component.context = '$contextId'
order by dgpath_component.id;
EOQ;


    $componentQueryResult = mysql_query($query);
    if (!$componentQueryResult) {
        die('Invalid query: ' . mysql_error());
    }
    $dataFound = false;

    $allComponents = array();
    $currentComponentEvents = array();
    $firstRow=true;
    while($row=mysql_fetch_array($componentQueryResult)){
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
where dgpath_connection.start_id='$currentComponentId';
EOQ2;

            $connectionResult = mysql_query($query2);
            if (!$connectionResult) {
                die('Invalid query: ' . mysql_error());
            }
            $dataFound2 = false;
            $componentConnections = array();
            while($connectionsRow=mysql_fetch_array($connectionResult)){
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
select dgpath_connection.start_id, dgpath_connection.end_id, dgpath_connection.id as connectionId
from dgpath_connection
where dgpath_connection.start_id='$currentComponentId';
EOQ2;
            $connectionResult = mysql_query($query2);
            if (!$connectionResult) {
                die('Invalid query: ' . mysql_error());
            }
            $dataFound2 = false;
            $componentConnections = array();
            while($connectionsRow=mysql_fetch_array($connectionResult)){
                $thisConnectionId=$connectionsRow['connectionId'];
                $thisConnectionStartId = $connectionsRow['start_id'];
                $thisConnectionEndId = $connectionsRow['end_id'];
                $connection = array('id'=>$thisConnectionId, 'start_id'=>$thisConnectionStartId, 'end_id'=>$thisConnectionEndId);
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
    $jsonComponentsList = json_encode($allComponents);
    return $jsonComponentsList;


}