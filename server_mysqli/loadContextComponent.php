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

$contextId = $_POST['contextId'];


$query = "SELECT dgpath_component.title, dgpath_component.type, dgpath_component.x, dgpath_component.y, dgpath_component.context, dgpath_component.content, dgpath_component.subcontext, dgpath_component.elementId "
."from dgpath_component, dgpath_context "
."where dgpath_context.parent = dgpath_component.id "
."and dgpath_context.id = ?";

//$query = "SELECT dgpath_component.title, dgpath_component.type, dgpath_component.x, dgpath_component.y, dgpath_component.context, dgpath_component.content from dgpath_component where id = '$componentId'";

$connectionParams = array($contextId);
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
    $thisComponent = array('title'=>$component_title, 'id'=>$componentId, 'x'=>$componentXpos, 'y'=>$componentYpos, 'type'=>$componentType, 'context'=>$componentContext, 'subcontext'=>$componentSubContext,'content'=>$componentContent, 'elementId'=>$componentElementId);

}
if($dataFound){
    header('Content-Type: application/json');
    $jsonComponent = json_encode($thisComponent);
    echo($jsonComponent);
}else{
    header('HTTP/1.0 400 error load component');
    exit;
}





