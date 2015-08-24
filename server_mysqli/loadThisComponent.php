<?php
/**
 * Created by JetBrains PhpStorm.
 * User: georgepipkin
 * Date: 1/25/13
 * Time: 3:34 PM
 * To change this template use File | Settings | File Templates.
 */
require_once '../server_mysqli/jsonED.php';
require_once '../server_mysqli/constants.php';
require_once '../server_mysqli/loadComponents.php';
require_once '../server_mysqli/dbparams.php';
require_once '../server_mysqli/preparedQuery.php';


//$projectId = 2;

$componentId = $_POST['componentId'];


$query = "SELECT dgpath_component.title, dgpath_component.type, dgpath_component.x, dgpath_component.y, dgpath_component.context, dgpath_component.content, dgpath_component.subcontext, dgpath_component.elementId, dgpath_project.proj_name "
."from dgpath_component, dgpath_context, dgpath_project "
."where dgpath_context.id = dgpath_component.context "
."and dgpath_project.id = dgpath_context.project "
."and dgpath_component.id = ?";

//$query = "SELECT dgpath_component.title, dgpath_component.type, dgpath_component.x, dgpath_component.y, dgpath_component.context, dgpath_component.content from dgpath_component where id = '$componentId'";

$connectionParams = array($componentId);
$componentQueryResult = mysqli_prepared_query($link,$query,"s",$connectionParams);

if ($connectionResult[0]=="error") {
    header('HTTP/1.0 400 error load component');
    exit;
}
$dataFound = false;

$allComponents = array();
$currentComponentEvents = array();
foreach($componentQueryResult as $row){
    $component_title = $row['title'];
    $componentXpos = $row['x'];
    $componentYpos = $row['y'];
    $componentType = $row['type'];
    $componentContext = $row['context'];
    $componentContent = $row['content'];
    $componentProjectName = $row['proj_name'];
    $componentSubContext = $row['subcontext'];
    $componentElementId = $row['elementId'];
    if(is_null($componentSubContext)){
        $componentSubContext = "";
    }

    $dataFound=true;
    $connection_query = "Select end_id from dgpath_connection where start_id = ?";
    $connectionParams = array($componentId);
    $componentQueryResult = mysqli_prepared_query($link,$connection_query,"s",$connectionParams);

    $connectionQueryResult = mysql_query($connection_query);
    if ($connectionQueryResult[0]=="error") {
        header('HTTP/1.0 400 error load component');
        exit;
    }
    $connectionDataFound = false;
    $connectionEndPoints = array();
    foreach($connectionQueryResult as $connectionRow){
        array_push($connectionEndPoints, $connectionRow['end_id']);
    }
    $thisComponent = array('title'=>$component_title, 'id'=>$componentId, 'x'=>$componentXpos, 'y'=>$componentYpos, 'type'=>$componentType, 'context'=>$componentContext, 'subcontext'=>$componentSubContext,'content'=>$componentContent, 'elementId'=>$componentElementId, 'projectName'=>$componentProjectName, 'connections'=>$connectionEndPoints);

}
if($dataFound){
    header('Content-Type: application/json');
    $jsonComponent = json_encode($thisComponent);
    echo($jsonComponent);
}else{
    header('HTTP/1.0 400 error load component');
    exit;
}





