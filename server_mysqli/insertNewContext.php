<?php
/**
 * Created by PhpStorm.
 * User: georgepipkin
 * Date: 12/23/13
 * Time: 8:49 AM
 */

require_once '../server_mysqli/jsonED.php';
require_once '../server_mysqli/constants.php';
require_once '../server_mysqli/insertDocument.php';
require_once '../server_mysqli/loadComponents.php';
require_once '../server_mysqli/dbparams.php';

$xpos = $_POST['xpos'];
$ypos = $_POST['ypos'];
$title = $_POST['title'];
$content = $_POST['content'];
$context = $_POST['context'];
$project = $_POST['project'];
$entryDoorContent = $_POST['entryDoorContent'];

if($project==0| $project == null){
    header('HTTP/1.0 400 project is zero on context insert');
    exit;
}


$contextComponentTitle = $title." sub-context";
$SUBCONTEXT = "subcontext";
$query = "INSERT INTO dgpath_component(type,x,y,context, title, content) values(?,?,?,?,?,?)";
if ($stmt = mysqli_prepare($link, $query)) {
    mysqli_stmt_bind_param($stmt, "ssssss", $SUBCONTEXT, $xpos, $ypos, $context, $contextComponentTitle, $content);
    mysqli_stmt_execute($stmt);
    if(mysqli_stmt_affected_rows($stmt)==0){
        header('HTTP/1.0 400 Nothing saved - subcontext component insert');
        exit;
    }
}else{
    header('HTTP/1.0 400 bad query - subcontext component insert');
    exit;
}

$componentLastItemID = $stmt->insert_id;

$thisDoorQuestion = "Context:".$title." entered by user";
$thisAnswerQuery = "SELECT dgpath_user_events.id from dgpath_events, dgpath_user_events where dgpath_user_events.event_id=dgpath_events.id and dgpath_events.component_id=$componentLastItemID and dgpath_events.event_type=$contextEntered";
$query="INSERT INTO dgpath_events(component_id, label, navigation, event_type, uevent_query) values (?,?,?,?,?)";
if ($stmt = mysqli_prepare($link, $query)) {
    mysqli_stmt_bind_param($stmt, "sssss", $componentLastItemID,$thisDoorQuestion, $TRUE, $contextEntered, $thisAnswerQuery);
    mysqli_stmt_execute($stmt);
    if(mysqli_stmt_affected_rows($stmt)==0){
        header('HTTP/1.0 400 Nothing saved - event insert');
        exit;
    }
}else{
    header('HTTP/1.0 400 bad query - event insert');
    exit;
}


$query = "insert into dgpath_context(title, project, parent, topcontext) values (?,?,?,?)";
if ($stmt = mysqli_prepare($link, $query)) {
    mysqli_stmt_bind_param($stmt, "ssss", $title,$project ,$componentLastItemID,$FALSE);
    mysqli_stmt_execute($stmt);
    if(mysqli_stmt_affected_rows($stmt)==0){
        header('HTTP/1.0 400 Nothing saved - context insert');
        exit;
    }
}else{
    header('HTTP/1.0 400 bad query - context insert');
    exit;
}

$contextLastItemID = $stmt->insert_id;


//$newContextComponentContent = "{context:".$contextLastItemID."}";
//$query = "UPDATE dgpath_component set content='$newContextComponentContent' where id = '$componentLastItemID'";
$query = "UPDATE dgpath_component set subcontext= ? where id = ?";
if ($stmt = mysqli_prepare($link, $query)) {
    mysqli_stmt_bind_param($stmt, "ss",$contextLastItemID,$componentLastItemID);
    mysqli_stmt_execute($stmt);
    if(mysqli_stmt_affected_rows($stmt)==0){
        header('HTTP/1.0 400 Nothing saved - component context update');
        exit;
    }
}else{
    header('HTTP/1.0 400 bad query - component context update');
    exit;
}
$ed = "entry_door";
$edlabel = "Entrance";
$edxpos = 50;
$edypos = 250;
$query = "INSERT INTO dgpath_component(type,x,y,context, title, content) values(?,?,?,?,?,?)";
if ($stmt = mysqli_prepare($link, $query)) {
    mysqli_stmt_bind_param($stmt, "ssssss", $ed, $edxpos, $edypos, $contextLastItemID,$edlabel, $entryDoorContent);
    mysqli_stmt_execute($stmt);
    if(mysqli_stmt_affected_rows($stmt)==0){
        header('HTTP/1.0 400 Nothing saved - subcontext entry door insert');
        exit;
    }
}else{
    header('HTTP/1.0 400 bad query - subcontext entry door insert');
    exit;
}
$entryDoorComponentId = $stmt->insert_id;


$thisDoorQuestion = $title." entry-door entered by user";
$thisAnswerQuery = "SELECT dgpath_user_events.id from dgpath_events, dgpath_user_events where dgpath_user_events.event_id=dgpath_events.id and dgpath_events.component_id=$componentLastItemID and dgpath_events.event_type=$contextEntered";
$query="INSERT INTO dgpath_events(component_id, label, navigation, event_type, uevent_query) values (?,?,?,?,?)";
if ($stmt = mysqli_prepare($link, $query)) {
    mysqli_stmt_bind_param($stmt, "sssss", $entryDoorComponentId,$thisDoorQuestion, $TRUE, $entryDoorEntered, $thisAnswerQuery);
    mysqli_stmt_execute($stmt);
    if(mysqli_stmt_affected_rows($stmt)==0){
        header('HTTP/1.0 400 Nothing saved - subcontext entry door event insert');
        exit;
    }
}else{
    header('HTTP/1.0 400 bad query - subcontext entry door event insert');
    exit;
}

echo($contextLastItemID);