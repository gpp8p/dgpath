<?php
/**
 * Created by PhpStorm.
 * User: georgepipkin
 * Date: 12/9/15
 * Time: 6:17 PM
 */
require_once '../server_mysqli/jsonED.php';
require_once '../server_mysqli/constants.php';
require_once '../server_mysqli/loadComponents.php';
require_once '../server_mysqli/dbparams.php';
require_once '../server_mysqli/preparedQuery.php';





$contextId = $_POST['contextId'];
$userId = $_POST['userId'];

$userEventInfoQuery =<<<UEQ
SELECT detail, event_type, event_time from dgpath_user_events
where component_id = ? and user_id = ?
UEQ;


$componentLoadResult = loadComponentsArray($contextId, $link);
$componentArray = $componentLoadResult[0];
$combinedComponentArray = array();
foreach($componentArray as  $thisComponent){
    $thisComponentId = $thisComponent['id'];
    $userActivityQueryParams = array($thisComponentId, $userId);
    $queryResult = mysqli_prepared_query($link,$userEventInfoQuery,"ss",$userActivityQueryParams);
    $eventsForThisComponent = array();
    foreach($queryResult as $userEventFound){
        array_push($eventsForThisComponent, $userEventFound);
    }
    $thisComponent['user_activities']= $eventsForThisComponent;
    array_push($combinedComponentArray, $thisComponent);
}
$newCombinedComponentArray = array($combinedComponentArray,$componentLoadResult[1]);
$jsonComponentsList = json_encode($newCombinedComponentArray);
echo($jsonComponentsList);