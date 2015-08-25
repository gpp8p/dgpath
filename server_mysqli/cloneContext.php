<?php
/**
 * Created by PhpStorm.
 * User: georgepipkin
 * Date: 10/28/14
 * Time: 10:46 PM
 */

require_once '../server_mysqli/constants.php';
require_once '../server_mysqli/jsonED.php';
require_once '../server_mysqli/dbparams.php';
require_once '../server_mysqli/preparedQuery.php';
require_once '../server_mysqli/loadContent.php';
require_once '../server_mysqli/evtypes.php';





$componentQuery = "SELECT dgpath_component.id as id, dgpath_component.type as type, dgpath_component.x as x, dgpath_component.y as y, dgpath_component.content as content, dgpath_component.context as context,  dgpath_component.subcontext as subcontext, dgpath_component.title as title, dgpath_component.elementId as elementId from dgpath_component ";
$componentQuery = $componentQuery."where dgpath_component.context = ?";

$componentQueryMin = "SELECT dgpath_component.id as id, dgpath_component.type as type,  dgpath_component.subcontext as subcontext, dgpath_component.title as title, dgpath_component.context as context from dgpath_component ";
$componentQueryMin = $componentQueryMin."where dgpath_component.context = ?";


$connectionQuery = "SELECT dgpath_connection.id as connectionId, dgpath_connection.start_id as start_id, dgpath_connection.end_id as end_id, dgpath_connection.go_ahead as go_ahead from dgpath_connection, dgpath_component ";
$connectionQuery = $connectionQuery."where dgpath_connection.start_id = dgpath_component.id ";
$connectionQuery = $connectionQuery."and dgpath_component.context = ?";

$ruleQuery = "SELECT dgpath_rules.id as id, dgpath_rules.event_id as event_id, dgpath_rules.connection_id as connection_id, dgpath_rules.detail_re as detail_re, dgpath_rules.activate as activate from dgpath_rules where connection_id = ?";

$eventQuery = "SELECT dgpath_events.id as id, dgpath_events.component_id as component_id, dgpath_events.label as label, dgpath_events.navigation as navigation, dgpath_events.event_type as event_type, dgpath_events.show_sub as show_sub, dgpath_events.sub_param as sub_param, dgpath_events.elementId as elementId ";
$eventQuery = $eventQuery."from dgpath_events where component_id = ?";

$insertComponentQuery = "INSERT INTO dgpath_component(type,x,y,context, title, content, subcontext, elementId) values(?,?,?,?,?,?,?,?)";

$traversalResults = array();
$ctx = $_POST['subcontext'];
//$ctx = 141;
//$globalResult = traverseContextTitles($componentQueryMin, $link,48);


$componentCrossReference = array();
$mock_Id = 679;


$globalResult = traverseContext($componentQuery, $connectionQuery, $link, $traversalResults, $ctx);

$returnDataJson = json_encode($globalResult);
echo($returnDataJson);




function traverseContext($componentQuery, $connectionQuery, $link, &$results, $contextId){
    global $eventQuery;
    $connectionForComponentQuery = "SELECT dgpath_connection.id as connectionId, dgpath_connection.start_id as start_id, dgpath_connection.end_id as end_id, dgpath_connection.go_ahead as go_ahead from dgpath_connection ";
    $connectionForComponentQuery = $connectionForComponentQuery."where dgpath_connection.start_id = ?";

    $componentParams = array($contextId);
    $thisContextComponents = array();
    $componentQueryResult = mysqli_prepared_query($link,$componentQuery,"s",$componentParams);
    foreach($componentQueryResult as $row){
        if($row['type']!='subcontext'){
            insertComponent($row, $link);
            $row["connections"] = getComponentConnections($row[id], $connectionForComponentQuery, $link);
            $row['events'] = getComponentEvents($row[id], $eventQuery, $link);
            array_push($thisContextComponents, $row);
        }else{
            $thisResult = traverseContext($componentQuery, $connectionQuery, $link, $results, $row['subcontext']);
            $row['subContextElements']= $thisResult;
            array_push($thisContextComponents, $row);
        }
    }
//    $connectionQueryResult = mysqli_prepared_query($link,$connectionQuery,"s",$componentParams);
    $contextResults = array($thisContextComponents);
    array_push($results, $contextResults);
    return $thisContextComponents;
}

function insertComponent($existingComponent, $link){
    global $componentCrossReference, $mock_Id, $insertComponentQuery;

    $type = $existingComponent['type'];
    $xpos = $existingComponent['x'];
    $ypos = $existingComponent['y'];
    $context = $existingComponent['context'];
    $title = $existingComponent['title'];
    $content = $existingComponent['content'];
    $subcontext = $existingComponent['subcontext'];
    $elementId = $existingComponent['elementId'];
    $id = $existingComponent['id'];

    if ($stmt = mysqli_prepare($link, $insertComponentQuery)) {
        mysqli_stmt_bind_param($stmt, "ssssssss", $type, $xpos, $ypos, $context, $title, $content, $subcontext, $elementId);
        /*        mysqli_stmt_execute($stmt);
                if(mysqli_affected_rows($link)==0){
                    header('HTTP/1.0 400 Nothing saved - component insert');
                    exit;
                }else {
                    $componentLastItemID = $stmt->insert_id;
                }
        */
        $componentCrossReference[strval($id)] = $mock_Id;
        $mock_Id++;

    }
}



function traverseContextTitles($componentQuery,  $link, $contextId){

    $componentParams = array($contextId);
    $thisContextComponents = array();
    $componentQueryResult = mysqli_prepared_query($link,$componentQuery,"s",$componentParams);
    foreach($componentQueryResult as $row){
        if($row['type']!='subcontext'){
            array_push($thisContextComponents, $row);
        }else{
            $thisResult = traverseContextTitles($componentQuery,  $link,  $row['subcontext']);
            $row['subContextElements']= $thisResult;
            array_push($thisContextComponents, $row);
        }
    }
    return $thisContextComponents;
}

function getComponentConnections($componentId, $connectionQuery, $link){
    global $ruleQuery;

    $connectionResult = array();
    $connectionParams = array($componentId);
    $connectionQueryResult = mysqli_prepared_query($link,$connectionQuery,"s",$connectionParams);
    foreach($connectionQueryResult as $row){
        $row['connectionRules']=getConnectionRules($row['connectionId'], $ruleQuery, $link);
        array_push($connectionResult, $row);
    }
    return $connectionResult;
}

function getConnectionRules($connectionId, $ruleQuery, $link){
    $ruleParams = array($connectionId);
    return mysqli_prepared_query($link,$ruleQuery,"s",$ruleParams);
}

function getComponentEvents($componentId, $eventQuery, $link){
    $eventParams = array($componentId);
    return mysqli_prepared_query($link,$eventQuery,"s",$eventParams);
}
