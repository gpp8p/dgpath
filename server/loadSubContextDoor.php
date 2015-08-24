<?php
/**
 * Created by PhpStorm.
 * User: georgepipkin
 * Date: 4/17/14
 * Time: 12:00 PM
 */

require_once '../server/jsonED.php';
require_once '../server/constants.php';
require_once '../server/loadComponents.php';
require_once '../server/dbparams.php';



$contextId = $_POST['contextId'];

$query = "select dgpath_context.title as context_title, dgpath_component.title, dgpath_component.id, dgpath_component.type, dgpath_component.x, dgpath_component.y, dgpath_component.context, dgpath_component.content, dgpath_component.subcontext from dgpath_context, dgpath_component "
."where dgpath_component.context = dgpath_context.id "
."and dgpath_component.type='entry_door' "
."and dgpath_context.id = '$contextId'";

$componentQueryResult = mysql_query($query);
if (!$componentQueryResult) {
    die('Invalid query: ' . mysql_error());
}
$dataFound = false;

$allComponents = array();
$currentComponentEvents = array();
while($row=mysql_fetch_array($componentQueryResult)){

    $contextTitle = $row['context_title'];
    $componentId = $row['id'];
    $component_title = $row['title'];
    $componentXpos = $row['x'];
    $componentYpos = $row['y'];
    $componentContent = $row['content'];

    $dataFound=true;
}
$entryDoorComponent = array('title'=>$component_title, 'id'=>$componentId, 'x'=>$componentXpos, 'y'=>$componentYpos, 'type'=>'entry_door', 'context'=>$contextId, 'content'=>$componentContent);
$thisComponent = array('subContextTitle'=>$contextTitle, 'entryDoorConfiguration'=>$entryDoorComponent);
if($dataFound){
//    header('Content-Type: application/json');
    $jsonComponent = json_encode($thisComponent);
    echo($jsonComponent);
}else{
    die("error - no component with this id");
}






