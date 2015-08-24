<?php
/**
 * Created by PhpStorm.
 * User: georgepipkin
 * Date: 3/9/14
 * Time: 10:43 AM
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
$events = $_POST['events'];
$showSub = $_POST['showSub'];


$query = "INSERT INTO dgpath_component(type,x,y,context, title, content) values('$type', '$xpos', '$ypos','$context','$title', '$content')";
$result = mysql_query($query);
if (!$result) {
    die('Invalid query: ' . mysql_error());
}
$componentLastItemID = mysql_insert_id();

$componentEvents = json_decode($events);

foreach($componentEvents as $thisComponentEvent){
    $query="";
    $componentEventAsArray=get_object_vars($thisComponentEvent);
    $thisLabel = $componentEventAsArray['label'];
    if($componentEventAsArray['label']){
        $thisNav = 'TRUE';
    }else{
        $thisNav = 'FALSE';
    }
    $thisType = $componentEventAsArray['type'];
    $thisSubParam = $componentEventAsArray['subParam'];
    if($thisSubParam=='' | $thisSubParam==null){
        $query = "INSERT INTO dgpath_events(component_id, label, navigation, event_type, show_sub) values ('$componentLastItemID', '$thisLabel', '$thisNav', '$thisType', FALSE)";
    }else{
        $newSub = str_replace("C?", "C".$componentLastItemID, $thisSubParam);
        if($showSub=='true'){
            $query = "INSERT INTO dgpath_events(component_id, label, navigation, event_type, show_sub, sub_param) values ('$componentLastItemID', '$thisLabel', '$thisNav', '$thisType', TRUE, '$newSub')";
        }else{
            $query = "INSERT INTO dgpath_events(component_id, label, navigation, event_type, show_sub, sub_param) values ('$componentLastItemID', '$thisLabel', '$thisNav', '$thisType', FALSE, '$newSub')";
        }
    }
    $result = mysql_query($query);
    if (!$result) {
        die('Invalid query: ' . mysql_error());
    }
}

$newComponentJson = loadComponents($context);
echo($newComponentJson);

