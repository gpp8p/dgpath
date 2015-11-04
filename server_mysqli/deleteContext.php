<?php
/**
 * Created by PhpStorm.
 * User: georgepipkin
 * Date: 1/18/15
 * Time: 3:29 PM
 */

require_once '../server_mysqli/constants.php';
require_once '../server_mysqli/jsonED.php';
require_once '../server_mysqli/dbparams.php';
require_once '../server_mysqli/preparedQuery.php';
require_once '../server_mysqli/loadContent.php';
require_once '../server_mysqli/evtypes.php';
require_once '../server_mysqli/deleteQueries.php';

$componentQueryMin = "SELECT dgpath_component.id as id, dgpath_component.type as type,  dgpath_component.subcontext as subcontext, dgpath_component.title as title, dgpath_component.context as context from dgpath_component ";
$componentQueryMin = $componentQueryMin."where dgpath_component.context = ?";

$deleteContextQuery = "DELETE from dgpath_context where id = ?";

$findComponentQuery = "SELECT dgpath_component.id as id, dgpath_component.type as type,  dgpath_component.subcontext as subcontext, dgpath_component.title as title, dgpath_component.context as context from dgpath_component ";
$findComponentQuery = $findComponentQuery."where dgpath_component.id = ?";

$user_events_query = "select count(*) as count from dgpath_user_events where component_id = ?";

$user_events_delete = "DELETE from dgpath_user_events where component_id = ?";

$thisComponentId = $_POST['componentId'];
$fdVal = $_POST['forceDelete'];
$forceDelete;
if($fdVal==null){
    $forceDelete =FALSE;
}else{
    $forceDelete = TRUE;
}

$findComponentParams = array($thisComponentId);
$componentFound = FALSE;
$thisComponentType;
$thisComponentSubcontext;
$componentId;
$findComponentQueryResult = mysqli_prepared_query($link,$findComponentQuery,"s",$findComponentParams);
foreach($findComponentQueryResult as $thisFindComponentQueryResult){
    $componentFound = true;
    $thisComponentType = $thisFindComponentQueryResult['type'];
    $thisComponentSubcontext = $thisFindComponentQueryResult['subcontext'];
    $componentId = $thisFindComponentQueryResult['id'];
}

if(!$componentFound){
    header('HTTP/1.0 400 no component found with that id');
    exit;
}

if($componentFound && $thisComponentType=="subcontext"){
    $traversalResults = array();
    $globalResult = traverseContext($componentQueryMin, $link, $traversalResults, $thisComponentSubcontext, $forceDelete);
    if($forceDelete){
        deleteOneComponent($thisComponentId, $link, $forceDelete);
        echo("subContextDeleted");
        return;
    }
    $returnDataJson = json_encode($globalResult);
}else{
    deleteOneComponent($componentId, $link, $forceDelete);
}

if($forceDelete) {

    foreach ($traversalResults as $thisContext) {
        if ($stmt = mysqli_prepare($link, $deleteContextQuery)) {
            mysqli_stmt_bind_param($stmt, "s", $thisContext);
            $result = mysqli_stmt_execute($stmt);
            if (!$result) {
//                mysqli_rollback($link);
                header('HTTP/1.0 400 query failed - context delete');
                exit;
            }
        } else {
            header('HTTP/1.0 400 bad query - context delete');
            exit;
        }

        echo($thisContext . ",");
    }
}

echo($returnDataJson);

function traverseContext($componentQuery,  $link, &$results, $contextId, $doDelete){

    $componentParams = array($contextId);
    $thisContextComponents = array();
    $componentQueryResult = mysqli_prepared_query($link,$componentQuery,"s",$componentParams);
    foreach($componentQueryResult as $row){
        if($row['type']!='subcontext'){
            array_push($thisContextComponents, $row);
            if($doDelete) {
                deleteThisComponent($row['id'], $link);
            }
        }else{
            $thisResult = traverseContext($componentQuery,  $link, $results, $row['subcontext'], $doDelete);
            $row['subContextElements']= $thisResult;
            array_push($thisContextComponents, $row);
            array_push($results, $row['context']);
            if($doDelete) {
                deleteThisComponent($row['id'], $link);
            }
        }
    }
//    $contextResults = array($thisContextComponents);
//    array_push($results, $contextResults);
    return $thisContextComponents;
}

function deleteOneComponent($componentId, $link, $forceDelete){
    global $user_events_query, $user_events_delete;

    $params = array($componentId);
    $user_events_queryResult = mysqli_prepared_query($link,$user_events_query,"s",$params);

    if ($user_events_queryResult[0]=="error") {
        header('HTTP/1.0 400 error user events query');
        exit;
    }
    $dataFound = false;
    $userEventsCount = 0;
    foreach($user_events_queryResult as $row){
        $userEventsCount = $row['count'];
        $dataFound = true;
    }
    if($userEventsCount>0 && ! $forceDelete){
        echo("userEventsPresent");
        return;
    }

    if($forceDelete){
        $globalResult = deleteThisComponent($componentId, $link);
        if ($stmt = mysqli_prepare($link, $user_events_delete)) {
            mysqli_stmt_bind_param($stmt, "s", $componentId);
            $result = mysqli_stmt_execute($stmt);
            if (!$result) {
//                mysqli_rollback($link);
                header('HTTP/1.0 400 query failed - user events delete');
                exit;
            }
        } else {
            header('HTTP/1.0 400 bad query - context delete');
            exit;
        }
        $returnDataJson = json_encode($globalResult);
//        echo($returnDataJson);
        return;
    }else{
        echo "confirmDelete";
        return;
    }

}
