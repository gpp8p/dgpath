<?php
/**
 * Created by PhpStorm.
 * User: georgepipkin
 * Date: 3/9/14
 * Time: 10:43 AM
 */
require_once '../server_mysqli/jsonED.php';
require_once '../server_mysqli/constants.php';
require_once '../server_mysqli/insertDocument.php';
require_once '../server_mysqli/loadComponents.php';
require_once '../server_mysqli/dbparams.php';
require_once '../server_mysqli/preparedQuery.php';


$xpos = $_POST['xpos'];
$ypos = $_POST['ypos'];
$type = $_POST['type'];
$title = $_POST['title'];
$content = $_POST['content'];
$context = $_POST['context'];
$events = $_POST['events'];
$showSub = $_POST['showSub'];
$elementId = $_POST['elementId'];
$reloadContext = $_POST['reloadContext'];



$query = "INSERT INTO dgpath_component(type,x,y,context, title, content, elementId) values(?,?,?,?,?,?,?)";
if ($stmt = mysqli_prepare($link, $query)) {
    mysqli_stmt_bind_param($stmt, "sssssss", $type, $xpos, $ypos, $context, $title, $content, $elementId);
    mysqli_stmt_execute($stmt);
    if(mysqli_stmt_affected_rows($stmt)==0){
        header('HTTP/1.0 400 Nothing saved - project insert');
        exit;
    }
}else{
    header('HTTP/1.0 400 bad query - project insert');
    exit;
}

$componentLastItemID = $stmt->insert_id;

$componentEvents = json_decode($events);

foreach($componentEvents as $thisComponentEvent){
    $query="";
    $componentEventAsArray=get_object_vars($thisComponentEvent);
    $thisLabel = $componentEventAsArray['label'];
    if($componentEventAsArray['label']){
        $thisNav = $TRUE;
    }else{
        $thisNav = $FALSE;
    }
    $thisType = $componentEventAsArray['type'];
    $thisSubParam = $componentEventAsArray['subParam'];
    $thisElementId = $componentEventAsArray['elementId'];
    if($thisSubParam=='' | $thisSubParam==null){
        $query = "INSERT INTO dgpath_events(component_id, label, navigation, event_type, show_sub, elementId) values (?,?,?,?,?,?)";
        if ($stmt = mysqli_prepare($link, $query)) {
            mysqli_stmt_bind_param($stmt, "dsssis", $componentLastItemID, $thisLabel, $thisNav, $thisType, $FALSE, $thisElementId);
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
        $newSub = str_replace("C?", "C".$componentLastItemID, $thisSubParam);
        $query = "INSERT INTO dgpath_events(component_id, label, navigation, event_type, show_sub, sub_param, elementId) values (?,?,?,?,?,?, ?)";
        if($showSub=='true'){
            $showSubValue = $TRUE;
        }else{
            $showSubValue = $FALSE;
        }
        if ($stmt = mysqli_prepare($link, $query)) {
            mysqli_stmt_bind_param($stmt, "dsssiss", $componentLastItemID, $thisLabel, $thisNav, $thisType, $showSubValue, $newSub, $thisElementId);
            mysqli_stmt_execute($stmt);
            if(mysqli_stmt_affected_rows($stmt)==0){
                header('HTTP/1.0 400 Nothing saved - event insert');
                exit;
            }
        }else{
            header('HTTP/1.0 400 bad query - event insert');
            exit;
        }

        $insertId = $stmt->insert_id;
    }
}

//$newComponentJson = loadComponents($context, $link);
//echo($newComponentJson);
$componentInserted = array();
array_push($componentInserted, $reloadContext);
array_push($componentInserted, $componentLastItemID);
array_push($componentInserted, $title);
array_push($componentInserted, $type);
$jsonComponentInserted = json_encode($componentInserted);

echo($jsonComponentInserted);