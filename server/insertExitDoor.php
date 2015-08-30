<?php
/**
 * Created by PhpStorm.
 * User: georgepipkin
 * Date: 12/27/13
 * Time: 9:24 PM
 */

require_once '../server/jsonED.php';
require_once '../server/constants.php';
require_once '../server/insertDocument.php';
require_once '../server/loadComponents.php';
require_once '../server/dbparams.php';


$xpos = $_POST['xpos'];
$ypos = $_POST['ypos'];
$type = $_POST['type'];
$title = $_POST['title'];
$content = $_POST['content'];
$context = $_POST['context'];


$exitDoorXpos = $xpos;
$exitDoorYpos = $ypos;
$exitDoorElementId = uniqid();
$query = "INSERT INTO dgpath_component(type,x,y,context, title, content, elementId) values('exit_door', '$exitDoorXpos', '$exitDoorYpos','$context','$title', '', $exitDoorElementId)";
$result = mysql_query($query);
if (!$result) {
    die('Invalid query: ' . mysql_error());
}
$componentLastItemID = mysql_insert_id();
$thisDoorQuestion = "Context: ".$title." exited by user";
$thisAnswerQuery = "SELECT dgpath_user_events.id from dgpath_events, dgpath_user_events where dgpath_user_events.event_id=dgpath_events.id and dgpath_events.component_id=$componentLastItemID and dgpath_events.event_type=$contextExited";
$query = "INSERT INTO dgpath_events(component_id, label, navigation, event_type, uevent_query, elementId) values ('$componentLastItemID','$thisDoorQuestion', TRUE, $contextExited, '$thisAnswerQuery', $exitDoorElementId)";
$result = mysql_query($query);
if (!$result) {
    die('Invalid query: ' . mysql_error());
}
return $entryDoorJson;
