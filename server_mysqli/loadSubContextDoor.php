<?php
/**
 * Created by PhpStorm.
 * User: georgepipkin
 * Date: 4/17/14
 * Time: 12:00 PM
 */

require_once '../server_mysqli/jsonED.php';
require_once '../server_mysqli/constants.php';
require_once '../server_mysqli/loadComponents.php';
require_once '../server_mysqli/dbparams.php';
require_once '../server_mysqli/preparedQuery.php';



$contextId = $_POST['contextId'];

$query = "select dgpath_context.title as context_title, dgpath_component.title, dgpath_component.id, dgpath_component.type, dgpath_component.x, dgpath_component.y, dgpath_component.context, dgpath_component.content, dgpath_component.subcontext from dgpath_context, dgpath_component "
."where dgpath_component.context = dgpath_context.id "
."and dgpath_component.type='entry_door' "
."and dgpath_context.id = ?";

$connectionParams = array($contextId);
$queryResult = mysqli_prepared_query($link,$query,"s",$connectionParams);

if ($queryResult[0]=="error") {
    header('HTTP/1.0 400 connection error look up user on context query');
    exit;
}

$dataFound = false;

$allComponents = array();
$currentComponentEvents = array();
foreach($queryResult as $row){
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
    header('HTTP/1.0 400 no data found on context query');
    exit;
}






