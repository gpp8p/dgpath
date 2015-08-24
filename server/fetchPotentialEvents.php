<?php
/**
 * Created by JetBrains PhpStorm.
 * User: georgepipkin
 * Date: 1/13/13
 * Time: 1:34 PM
 * To change this template use File | Settings | File Templates.
 */



require_once '../server/jsonED.php';
require_once '../server/constants.php';
require_once '../server/dbparams.php';



$thisComponentId = $_GET["componentId"];


$query = "select dgpath_component.title, dgpath_events.id, dgpath_events.component_id, dgpath_events.label, dgpath_events.event_type from dgpath_component, dgpath_events where dgpath_events.component_id = dgpath_component.id and dgpath_component.id = '$thisComponentId' order by component_id";
$result = mysql_query($query);
if (!$result) {
    die('Invalid query: ' . mysql_error());
}
$dataFound = false;
$potentialEvents = array();
$currentComponent = array();
while($row=mysql_fetch_array($result)){
    $component_title = $row['title'];
    $id = $row['id'];
    $component_id = $row['component_id'];
    $label = $row['label'];
    $event_type = $row['event_type'];
    $thisComponentEvent = array('title'=>$component_title, 'event_id'=>$id, 'component_id'=>$component_id, 'event_label'=>$label, 'type'=>$event_type);
    array_push($currentComponent, $thisComponentEvent);
    $dataFound=true;
/*
    if(!$dataFound){
        $currentComponentId = $component_id;
        array_push($currentComponent, $thisComponentEvent);
        $dataFound = true;
    }else{
        if($currentComponentId!=$component_id){
            array_push($potentialEvents,$currentComponent);
            $currentComponentId = $component_id;
            $currentComponent=array();
            array_push($currentComponent, $thisComponentEvent);
        }else{
            array_push($currentComponent, $thisComponentEvent);
        }
    }
*/
}
if(!$dataFound){
    die("Something wrong - no components or events found");
}

$jsonEventsList = json_encode($currentComponent);
echo($jsonEventsList);

