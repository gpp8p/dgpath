<?php
/**
 * Created by PhpStorm.
 * User: georgepipkin
 * Date: 12/23/13
 * Time: 8:49 AM
 */

require_once '../server/jsonED.php';
require_once '../server/constants.php';
require_once '../server/insertDocument.php';
require_once '../server/loadComponents.php';
require_once '../server/dbparams.php';

$xpos = $_POST['xpos'];
$ypos = $_POST['ypos'];
$title = $_POST['title'];
$content = $_POST['content'];
$context = $_POST['context'];
$project = $_POST['project'];
$entryDoorContent = $_POST['entryDoorContent'];


$contextComponentTitle = $title." sub-context";
$query = "INSERT INTO dgpath_component(type,x,y,context, title, content) values('subcontext', '$xpos', '$ypos','$context','$contextComponentTitle', '$content')";
$result = mysql_query($query);
if (!$result) {
    die('Invalid query: ' . mysql_error());
}
$componentLastItemID = mysql_insert_id();

$thisDoorQuestion = "Context:".$title." entered by user";
$thisAnswerQuery = "SELECT dgpath_user_events.id from dgpath_events, dgpath_user_events where dgpath_user_events.event_id=dgpath_events.id and dgpath_events.component_id=$componentLastItemID and dgpath_events.event_type=$contextEntered";
$query="INSERT INTO dgpath_events(component_id, label, navigation, event_type, uevent_query) values ('$componentLastItemID','$thisDoorQuestion', TRUE, '$contextEntered', '$thisAnswerQuery')";
$result = mysql_query($query);
if (!$result) {
    die('Invalid query: ' . mysql_error());
}

$query = "insert into dgpath_context(title, project, parent, topcontext) values ('$title','$project' ,'$componentLastItemID',FALSE)";
$result = mysql_query($query);
if (!$result) {
    die('Invalid query: ' . mysql_error());
}
$contextLastItemID = mysql_insert_id();
//$newContextComponentContent = "{context:".$contextLastItemID."}";
//$query = "UPDATE dgpath_component set content='$newContextComponentContent' where id = '$componentLastItemID'";
$query = "UPDATE dgpath_component set subcontext='$contextLastItemID' where id = '$componentLastItemID'";
$result = mysql_query($query);
if (!$result) {
    die('Invalid query: ' . mysql_error());
}
$query = "INSERT INTO dgpath_component(type,x,y,context, title, content) values('entry_door', 50, 250, '$contextLastItemID','Entrance', '$entryDoorContent')";
$result = mysql_query($query);
if (!$result) {
    die('Invalid query: ' . mysql_error());
}
$entryDoorComponentId = mysql_insert_id();
$thisDoorQuestion = $title." entry-door entered by user";
$thisAnswerQuery = "SELECT dgpath_user_events.id from dgpath_events, dgpath_user_events where dgpath_user_events.event_id=dgpath_events.id and dgpath_events.component_id=$componentLastItemID and dgpath_events.event_type=$contextEntered";
$query="INSERT INTO dgpath_events(component_id, label, navigation, event_type, uevent_query) values ('$entryDoorComponentId','$thisDoorQuestion', TRUE, '$entryDoorEntered', '$thisAnswerQuery')";
$result = mysql_query($query);
if (!$result) {
    die('Invalid query: ' . mysql_error());
}
echo($contextLastItemID);