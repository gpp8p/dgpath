<?php
/**
 * Created by PhpStorm.
 * User: georgepipkin
 * Date: 12/27/13
 * Time: 9:24 PM
 */

require_once '../server_mysqli/jsonED.php';
require_once '../server_mysqli/constants.php';
require_once '../server_mysqli/insertDocument.php';
require_once '../server_mysqli/loadComponents.php';
require_once '../server_mysqli/dbparams.php';


$xpos = $_POST['xpos'];
$ypos = $_POST['ypos'];
$type = $_POST['type'];
$title = $_POST['title'];
$content = $_POST['content'];
$context = $_POST['context'];
$elementId = $_POST['elementId'];


$exitDoorXpos = $xpos;
$exitDoorYpos = $ypos;
$ed = "exit_door";
$empty = '';
$exitDoorElementId = uniqid();
$query = "INSERT INTO dgpath_component(type,x,y,context, title, content,elementId) values(?,?,?,?,?,?,?)";
if ($stmt = mysqli_prepare($link, $query)) {
    mysqli_stmt_bind_param($stmt, "sssssss", $ed, $exitDoorXpos, $exitDoorYpos,$context,$title, $empty, $exitDoorElementId );
    mysqli_stmt_execute($stmt);
    if(mysqli_stmt_affected_rows($stmt)==0){
        header('HTTP/1.0 400 Nothing saved - exit door component  insert');
        exit;
    }
}else{
    header('HTTP/1.0 400 bad query - exit door component  insert');
    exit;
}

$componentLastItemID = $stmt->insert_id;;
$thisDoorQuestion = "Context: ".$title." exited by user";
$thisAnswerQuery = "SELECT dgpath_user_events.id from dgpath_events, dgpath_user_events where dgpath_user_events.event_id=dgpath_events.id and dgpath_events.component_id=$componentLastItemID and dgpath_events.event_type=$contextExited";
$query = "INSERT INTO dgpath_events(component_id, label, navigation, event_type, uevent_query, elementId) values (?,?,?,?,?,?)";
if ($stmt = mysqli_prepare($link, $query)) {
    mysqli_stmt_bind_param($stmt, "ssssss", $componentLastItemID,$thisDoorQuestion, $TRUE, $contextExited, $thisAnswerQuery,$exitDoorElementId);
    mysqli_stmt_execute($stmt);
    if(mysqli_stmt_affected_rows($stmt)==0){
        header('HTTP/1.0 400 Nothing saved - exit door component event insert');
        exit;
    }
}else{
    header('HTTP/1.0 400 bad query - exit door component event insert');
    exit;
}

echo($componentLastItemID);
