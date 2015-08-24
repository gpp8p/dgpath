<?php
/**
 * Created by JetBrains PhpStorm.
 * User: georgepipkin
 * Date: 1/25/13
 * Time: 3:34 PM
 * To change this template use File | Settings | File Templates.
 */
require_once '../server/jsonED.php';
require_once '../server/constants.php';
require_once '../server/loadComponents.php';
require_once '../server/dbparams.php';


//$projectId = 2;

$componentId = $_POST['componentId'];


$query = "SELECT dgpath_component.title, dgpath_component.type, dgpath_component.x, dgpath_component.y, dgpath_component.context, dgpath_component.content, dgpath_component.subcontext, dgpath_project.proj_name "
."from dgpath_component, dgpath_context, dgpath_project "
."where dgpath_context.id = dgpath_component.context "
."and dgpath_project.id = dgpath_context.project "
."and dgpath_component.id = '$componentId'";

//$query = "SELECT dgpath_component.title, dgpath_component.type, dgpath_component.x, dgpath_component.y, dgpath_component.context, dgpath_component.content from dgpath_component where id = '$componentId'";
$componentQueryResult = mysql_query($query);
if (!$componentQueryResult) {
    die('Invalid query: ' . mysql_error());
}
$dataFound = false;

$allComponents = array();
$currentComponentEvents = array();
while($row=mysql_fetch_array($componentQueryResult)){
    $component_title = $row['title'];
    $componentXpos = $row['x'];
    $componentYpos = $row['y'];
    $componentType = $row['type'];
    $componentContext = $row['context'];
    $componentContent = $row['content'];
    $componentProjectName = $row['proj_name'];
    $componentSubContext = $row['subcontext'];
    if(is_null($componentSubContext)){
        $componentSubContext = "";
    }

    $dataFound=true;
    $connection_query = "Select end_id from dgpath_connection where start_id = '$componentId'";
    $connectionQueryResult = mysql_query($connection_query);
    if (!$connectionQueryResult) {
        die('Invalid query: ' . mysql_error());
    }
    $connectionDataFound = false;
    $connectionEndPoints = array();
    while($connectionRow=mysql_fetch_array($connectionQueryResult)){
        array_push($connectionEndPoints, $connectionRow['end_id']);
    }
    $thisComponent = array('title'=>$component_title, 'id'=>$componentId, 'x'=>$componentXpos, 'y'=>$componentYpos, 'type'=>$componentType, 'context'=>$componentContext, 'subcontext'=>$componentSubContext,'content'=>$componentContent, 'projectName'=>$componentProjectName, 'connections'=>$connectionEndPoints);

}
if($dataFound){
    header('Content-Type: application/json');
    $jsonComponent = json_encode($thisComponent);
    echo($jsonComponent);
}else{
    die("error - no component with this id");
}





