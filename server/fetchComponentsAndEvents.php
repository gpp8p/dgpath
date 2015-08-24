<?php
/**
 * Created by JetBrains PhpStorm.
 * User: georgepipkin
 * Date: 1/17/13
 * Time: 10:19 PM
 * To change this template use File | Settings | File Templates.
 */

require_once '../server/jsonED.php';
require_once '../server/constants.php';
require_once '../server/loadComponents.php';
require_once '../server/dbparams.php';



//$projectId = 2;

$contextId = $_POST['contextId'];
$jsonComponentsList = loadComponents($contextId);

/*
$query=<<<EOQ
select lpath_component.id, lpath_component.title, lpath_component.type, lpath_component.x, lpath_component.y, lpath_component.project, lpath_events.component_id, lpath_events.label, lpath_events.event_type, lpath_events.sub_param, lpath_events.id as eid
from lpath_component, lpath_events
where lpath_events.component_id = lpath_component.id
and lpath_component.project = '$projectId'
order by lpath_component.id;
EOQ;


$result = mysql_query($query);
if (!$result) {
    die('Invalid query: ' . mysql_error());
}
$dataFound = false;

$allComponents = array();
$currentComponentEvents = array();
while($row=mysql_fetch_array($result)){
    $component_id = $row['component_id'];
    if(!$dataFound){
        $component_title = $row['title'];
        $componentXpos = $row['x'];
        $componentYpos = $row['y'];
        $componentType = $row['type'];
        $currentComponentEvents = array();
        $currentComponentId = $component_id;
        $query2=<<<EOQ2
select lpath_connection.start_id, lpath_connection.end_id, lpath_connection.id as connectionId
from lpath_connection
where lpath_connection.start_id='$currentComponentId';
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
        $currentComponent = array('title'=>$component_title, 'id'=>$saveId, 'x'=>$componentXpos, 'y'=>$componentYpos, 'type'=>$componentType, 'events'=>$currentComponentEvents, 'connections'=>$componentConnections);
        array_push($allComponents,$currentComponent);
        $component_title = $row['title'];
        $componentXpos = $row['x'];
        $componentYpos = $row['y'];
        $componentType = $row['type'];

        $id = $row['id'];
        $label = $row['label'];
        $event_type = $row['event_type'];
        $thisComponentEvent = array('event_id'=>$id, 'event_label'=>$label, 'type'=>$event_type);
        $currentComponentId = $component_id;

        $query2=<<<EOQ2
select lpath_connection.start_id, lpath_connection.end_id, lpath_connection.id as connectionId
from lpath_connection
where lpath_connection.start_id='$currentComponentId';
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

$jsonComponentsList = json_encode($allComponents);
*/

echo($jsonComponentsList);
