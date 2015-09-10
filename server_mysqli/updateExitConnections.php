<?php
/**
 * Created by PhpStorm.
 * User: georgepipkin
 * Date: 9/9/15
 * Time: 10:12 AM
 */

require_once '../server_mysqli/jsonED.php';

require_once '../server_mysqli/constants.php';
require_once '../server_mysqli/insertDocument.php';
require_once '../server_mysqli/loadComponents.php';
require_once '../server_mysqli/dbparams.php';
require_once '../server_mysqli/preparedQuery.php';


$componentId = $_POST['componentId'];
$thisPassFailPoint = $_POST['passFailPoint'];
$passExit = $_POST['passExit'];
$failExit = $_POST['failExit'];


$connectionFound = false;
$query = "SELECT id from dgpath_connection where  start_id = ?";
$componentParams = array($componentId);
$queryResult = mysqli_prepared_query($link,$query,"s",$componentParams);
if ($queryResult[0]=="error") {
    header('HTTP/1.0 400 connection error in getEventsForSubContext');
    exit;
}
foreach($queryResult as $componentData){
    $connectionFound = true;
}
$passActivate;
$failActivate;

switch($thisPassFailPoint){
    case '10':
        $passActivate = $passIfScoreGt10;
        $failActivate = $passIfScoreLt10;
        break;
    case '20':
        $passActivate = $passIfScoreGt20;
        $failActivate = $passIfScoreLt20;
        break;
    case '30':
        $passActivate = $passIfScoreGt30;
        $failActivate = $passIfScoreLt30;
        break;
    case '40':
        $passActivate = $passIfScoreGt40;
        $failActivate = $passIfScoreLt40;
        break;
    case '50':
        $passActivate = $passIfScoreGt50;
        $failActivate = $passIfScoreLt50;
        break;
    case '60':
        $passActivate = $passIfScoreGt60;
        $failActivate = $passIfScoreLt60;
        break;
    case '65':
        $passActivate = $passIfScoreGt65;
        $failActivate = $passIfScoreLt65;
        break;
    case '70':
        $passActivate = $passIfScoreGt70;
        $failActivate = $passIfScoreLt70;
        break;
    case '75':
        $passActivate = $passIfScoreGt75;
        $failActivate = $passIfScoreLt75;
        break;
    case '80':
        $passActivate = $passIfScoreGt80;
        $failActivate = $passIfScoreLt80;
        break;
    case '85':
        $passActivate = $passIfScoreGt85;
        $failActivate = $passIfScoreLt85;
        break;
    case '90':
        $passActivate = $passIfScoreGt90;
        $failActivate = $passIfScoreLt90;
        break;
    case '95':
        $passActivate = $passIfScoreGt95;
        $failActivate = $passIfScoreLt95;
        break;
    default:
        break;
}
if($connectionFound){

    $query = "update dgpath_rules, dgpath_connection set dgpath_rules.activate = ? where ";
    $query = $query."dgpath_rules.connection_id = dgpath_connection.id ";
    $query = $query."and dgpath_connection.start_id = ? and dgpath_connection.end_id = ? ";
    $query = $query."and dgpath_activate >=".$passIfScoreGt10." and dgpath_activate<=".$passIfScoreLt100;
    if ($stmt = mysqli_prepare($link, $query)) {
        mysqli_stmt_bind_param($stmt, $passActivate, $componentId,  $passExit);
        mysqli_stmt_execute($stmt);
        if(strlen(mysqli_error($link))!=0){
            header('HTTP/1.0 400 Nothing saved - update connection');
            exit;
        }
    }else{
        header('HTTP/1.0 400 bad query - update connection');
        exit;
    }
    if ($stmt = mysqli_prepare($link, $query)) {
        mysqli_stmt_bind_param($stmt, $failActivate, $componentId,  $failExit);
        mysqli_stmt_execute($stmt);
        if(strlen(mysqli_error($link))!=0){
            header('HTTP/1.0 400 Nothing saved - update connection');
            exit;
        }
    }else{
        header('HTTP/1.0 400 bad query - update connection');
        exit;
    }
    echo "ok";
}else{
    $eventId;
    $eventsQuery = "SELECT id from dgpath_events where component_id = ? and event_type =  ?";
    $componentParams = array($componentId, $componentViewed);
    $queryResult = mysqli_prepared_query($link,$eventsQuery,"ss",$componentParams);
    if ($queryResult[0]=="error") {
        header('HTTP/1.0 400 connection error in getEventsForSubContext');
        exit;
    }
    $eventFound = false;
    foreach($queryResult as $eventData){
        $eventId = $eventData['id'];
        $eventFound=true;
    }
    if(!$eventFound){
        header('HTTP/1.0 400 event not found for branching component');
        exit;
    }



    $setGoAhead = 0;
    $query = "INSERT INTO dgpath_connection(start_id,end_id, go_ahead) values (?,?,?)";
    if ($stmt = mysqli_prepare($link, $query)) {
        mysqli_stmt_bind_param($stmt, "ssi", $componentId, $passExit, $setGoAhead);
        mysqli_stmt_execute($stmt);
        if(mysqli_stmt_affected_rows($stmt)==0){
            header('HTTP/1.0 400 Nothing saved - connection insert');
            exit;
        }
    }else{
        header('HTTP/1.0 400 bad query - connection insert');
        exit;
    }
    $connectionId = $stmt->insert_id;
    $query = "INSERT INTO dgpath_rules(event_id, connection_id, activate, detail_re) values (?,?,?,?)";
    if ($stmt = mysqli_prepare($link, $query)) {
        $whichDoor = "pass";
        mysqli_stmt_bind_param($stmt, "ssss", $eventId, $connectionId, $passActivate, $whichDoor);
        mysqli_stmt_execute($stmt);
        if(mysqli_stmt_affected_rows($stmt)==0){
            header('HTTP/1.0 400 Nothing saved - connection insert');
            exit;
        }
    }else{
        header('HTTP/1.0 400 bad query - rule insert');
        exit;
    }




    $query = "INSERT INTO dgpath_connection(start_id,end_id, go_ahead) values (?,?,?)";
    if ($stmt = mysqli_prepare($link, $query)) {
        mysqli_stmt_bind_param($stmt, "ssi", $componentId, $failExit, $setGoAhead);
        mysqli_stmt_execute($stmt);
        if(mysqli_stmt_affected_rows($stmt)==0){
            header('HTTP/1.0 400 Nothing saved - connection insert');
            exit;
        }
    }else{
        header('HTTP/1.0 400 bad query - connection insert');
        exit;
    }

    $connectionId = $stmt->insert_id;
    $query = "INSERT INTO dgpath_rules(event_id, connection_id, activate, detail_re) values (?,?,?,?)";
    if ($stmt = mysqli_prepare($link, $query)) {
        $whichDoor = "fail";
        mysqli_stmt_bind_param($stmt, "ssss", $eventId, $connectionId, $failActivate, $whichDoor);
        mysqli_stmt_execute($stmt);
        if(mysqli_stmt_affected_rows($stmt)==0){
            header('HTTP/1.0 400 Nothing saved - connection insert');
            exit;
        }
    }else{
        header('HTTP/1.0 400 bad query - rule insert');
        exit;
    }
    echo("ok");

}


