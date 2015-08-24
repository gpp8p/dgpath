<?php
/**
 * Created by PhpStorm.
 * User: georgepipkin
 * Date: 8/9/14
 * Time: 4:48 PM
 */

require_once '../server_mysqli/jsonED.php';
require_once '../server_mysqli/constants.php';
require_once '../server_mysqli/loadComponents.php';
require_once '../server_mysqli/dbparams.php';
require_once '../server_mysqli/constants.php';
require_once '../server_mysqli/preparedQuery.php';


//$projectId = 2;

$componentId = $_POST['componentId'];

$query = "select dgpath_component.content as content, dgpath_component.title as title, dgpath_events.elementId as elementId, dgpath_events.sub_param as sub_param from dgpath_component, dgpath_events ";
$query = $query."where dgpath_events.component_id = dgpath_component.id ";
$query = $query."and dgpath_events.event_type =".$correctFibAnswer." ";
$query = $query."and dgpath_component.id = ?";

$connectionParams = array($componentId);
$eventQueryResult = mysqli_prepared_query($link,$query,"s",$connectionParams);

if ($connectionResult[0]=="error") {
    header('HTTP/1.0 400 error load component');
    exit;
}
$dataFound = false;
$fibComponentContent = "";
$fibComponentTitle = "";
$fibElements = array();

foreach($eventQueryResult as $row){
    $fibComponentContent = $row['content'];
    $fibComponentTitle = $row['title'];
    $fibElementsId = $row['elementId'];
    $thisFibAnswer = $row['sub_param'];
    $fibElements[$fibElementsId] = $thisFibAnswer;
}

$thisFibReturn = array('content'=>$fibComponentContent, 'title'=>$fibComponentTitle, 'fibElements'=>$fibElements);


$thisFibReturnJson = json_encode($thisFibReturn);
echo($thisFibReturnJson);
