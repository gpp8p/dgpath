<?php
/**
 * Created by PhpStorm.
 * User: georgepipkin
 * Date: 8/14/14
 * Time: 9:50 AM
 */

require_once '../server_mysqli/jsonED.php';
require_once '../server_mysqli/constants.php';
require_once '../server_mysqli/loadComponents.php';
require_once '../server_mysqli/dbparams.php';
require_once '../server_mysqli/constants.php';
require_once '../server_mysqli/preparedQuery.php';


//$projectId = 2;
$xpos = $_POST['xpos'];
$ypos = $_POST['ypos'];
$type = $_POST['componentType'];
$title = $_POST['title'];
$content = $_POST['content'];
$context = $_POST['context'];
$componentId = $_POST['componentId'];
$events = $_POST['events'];



$query = "delete from dgpath_rules, dgpath_events where dgpath_rules.event_id = dgpath_events.id and dgpath_events.component_id = ?";
$connectionParams = array($componentId);

$componentQueryResult = mysqli_prepared_query($link,$query,"s",$connectionParams);

if ($connectionResult[0]=="error") {
    header('HTTP/1.0 400 error delete rules');
    exit;
}
$query = "delete from dgpath_events where dgpath_events.component_id = ?";
$componentQueryResult = mysqli_prepared_query($link,$query,"s",$connectionParams);
if ($connectionResult[0]=="error") {
    header('HTTP/1.0 400 error delete events');
    exit;
}
$query = "UPDATE dgpath_component set type = ?, x = ?, y = ?, title = ?, content = ?, context = ? where id = ?";
if ($stmt = mysqli_prepare($link, $query)) {
    mysqli_stmt_bind_param($stmt, "sssssss", $type, $xpos, $ypos, $title, $content, $context, $componentId);
    mysqli_stmt_execute($stmt);
    if(mysqli_stmt_affected_rows($stmt)==0 && mysqli_stmt_errno($stmt) != 0){
        header('HTTP/1.0 400 Nothing saved - component update error');
        exit;
    }
}else{
    header('HTTP/1.0 400 Problem with query - component update');
    exit;
}



foreach($events as $thisComponentEvent){
    $query="";
    $thisLabel = $thisComponentEvent['label'];
    if($thisComponentEvent['label']){
        $thisNav = $TRUE;
    }else{
        $thisNav = $FALSE;
    }
    $thisType = $thisComponentEvent['type'];
    $thisSubParam = $thisComponentEvent['subParam'];
    $thisElementId = $thisComponentEvent['elementId'];
    if($thisSubParam=='' | $thisSubParam==null){
        $query = "INSERT INTO dgpath_events(component_id, label, navigation, event_type, show_sub, elementId) values (?,?,?,?,?,?)";
        if ($stmt = mysqli_prepare($link, $query)) {
            mysqli_stmt_bind_param($stmt, "dsssis", $componentId, $thisLabel, $thisNav, $thisType, $FALSE, $thisElementId);
            mysqli_stmt_execute($stmt);
            if(mysqli_stmt_affected_rows($stmt)<=0){
                $thisError = mysqli_error($link);
                header('HTTP/1.0 400 Nothing saved - event insert - '.$thisError);
                exit;
            }
        }else{
            header('HTTP/1.0 400 bad query - event insert');
            exit;
        }
    }else{
        $newSub = str_replace("C?", "C".$componentId, $thisSubParam);  // what is this for ???
        $query = "INSERT INTO dgpath_events(component_id, label, navigation, event_type, show_sub, sub_param, elementId) values (?,?,?,?,?,?, ?)";
        if($showSub=='true'){
            $showSubValue = $TRUE;
        }else{
            $showSubValue = $FALSE;
        }
        if ($stmt = mysqli_prepare($link, $query)) {
            mysqli_stmt_bind_param($stmt, "dsssiss", $componentId, $thisLabel, $thisNav, $thisType, $showSubValue, $newSub, $thisElementId);
            mysqli_stmt_execute($stmt);
            if(mysqli_stmt_affected_rows($stmt)==0){
                header('HTTP/1.0 400 Nothing saved - event insert');
                exit;
            }
        }else{
            header('HTTP/1.0 400 bad query - event insert');
            exit;
        }
    }
}

$newComponentJson = loadComponents($context, $link);
echo($newComponentJson);



