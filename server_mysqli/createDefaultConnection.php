<?php
/**
 * Created by PhpStorm.
 * User: georgepipkin
 * Date: 9/3/15
 * Time: 8:35 PM
 */


require_once '../server_mysqli/jsonED.php';

require_once '../server_mysqli/constants.php';
require_once '../server_mysqli/insertDocument.php';
require_once '../server_mysqli/loadComponents.php';
require_once '../server_mysqli/dbparams.php';
require_once '../server_mysqli/preparedQuery.php';


$startId = $_POST['startId'];
$endId = $_POST['endId'];

$setGoAhead =1;
$query = "INSERT INTO dgpath_connection(start_id,end_id, go_ahead) values (?,?,?)";
if ($stmt = mysqli_prepare($link, $query)) {
    mysqli_stmt_bind_param($stmt, "sss", $startId, $endId, $setGoAhead);
    mysqli_stmt_execute($stmt);
    if(mysqli_stmt_affected_rows($stmt)==0){
        header('HTTP/1.0 400 Nothing saved - connection insert');
        exit;
    }
}else{
    header('HTTP/1.0 400 bad query - connection insert');
    exit;
}
$componentId = $startId;
$connectionId = $stmt->insert_id;

$componentQuery = "SELECT type from dgpath_component where id = ?";
$componentParams = array($componentId);
$queryResult = mysqli_prepared_query($link,$componentQuery,"s",$componentParams);
if ($queryResult[0]=="error") {
    header('HTTP/1.0 400 connection error in getEventsForSubContext');
    exit;
}
if(count($queryResult)!=1){
    header('HTTP/1.0 400 connection error in createDefaultConnection - component lookup returned bad results');
    exit;
}
foreach($queryResult as $componentData){
    if($componentData['type']=='truefalse'){
        $correctAnswerEventType = $tfAnswer;
    }else if($componentData['type']=='multichoice'){
        $correctAnswerEventType = $mcCorrect;
    }else if($componentData['type']=='fib'){
        $correctAnswerEventType = $correctFibAnswer;
    }else{

    }
}
$eventsQuery = "SELECT id from dgpath_events where component_id = ? and event_type = ?";
$componentParams = array($componentId, $correctAnswerEventType);
$queryResult = mysqli_prepared_query($link,$eventsQuery,"ss",$componentParams);
if ($queryResult[0]=="error") {
    header('HTTP/1.0 400 connection error in getEventsForSubContext');
    exit;
}
foreach($queryResult as $eventData){
    $thisEventId = $eventData['id'];
    $thisActivateValue = 6;
    $ruleInsertQuery = "INSERT into dgpath_rules (event_id, connection_id, activate) values (?,?,?)";
    if ($stmt = mysqli_prepare($link, $ruleInsertQuery)) {
        mysqli_stmt_bind_param($stmt, "sss", $thisEventId, $connectionId, $thisActivateValue);
        mysqli_stmt_execute($stmt);
        if(mysqli_stmt_affected_rows($stmt)==0){
            header('HTTP/1.0 400 Nothing saved - connection insert');
            exit;
        }
    }else{
        header('HTTP/1.0 400 bad query - connection insert');
        exit;
    }
}

echo($connectionId);