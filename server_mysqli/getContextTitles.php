<?php
/**
 * Created by PhpStorm.
 * User: georgepipkin
 * Date: 11/1/14
 * Time: 9:38 PM
 */


require_once '../server_mysqli/constants.php';
require_once '../server_mysqli/jsonED.php';
require_once '../server_mysqli/dbparams.php';
require_once '../server_mysqli/preparedQuery.php';
require_once '../server_mysqli/loadContent.php';
require_once '../server_mysqli/evtypes.php';

session_start();
if (mysqli_connect_errno()) {
    header('HTTP/1.0 400 Database Available');
    exit();
}

if(!isset($_SESSION['username'])){
    header('HTTP/1.0 400 No session - please log in');
    exit;
}


$collectionId = $_POST['elementId'];
$collectionTitle = $_POST['collectionTitle'];
$contextId = $_POST['contextId'];
$selectClick = $_POST['selClick'];
$openCollection = $_POST['openCollection'];

if($openCollection=="true"){
    $collectionTitleQuery = "SELECT proj_name, description from dgpath_project where id = ?";
    $componentParams = array($collectionId);
    $collectionQueryResult = mysqli_prepared_query($link,$collectionTitleQuery,"s",$componentParams);
    $foundCollection = false;
    foreach($collectionQueryResult as $row){
        $foundCollection=true;
        $collectionTitle = $row['proj_name'];
        $collectionDescription = $row['description'];
    }
    if(!$foundCollection){
        header('HTTP/1.0 400 collection not found');
        exit;
    }
    if($contextId==null){
        $topContextQuery = "SELECT id from dgpath_context where project=? and topcontext=1";
        $componentParams = array($collectionId);
        $contextQueryResult = mysqli_prepared_query($link,$topContextQuery,"s",$componentParams);
        $foundTopContext = false;
        foreach($contextQueryResult as $row){
            $contextId = $row['id'];
            $foundTopContext=true;
        }
        if(!$foundTopContext){
            header('HTTP/1.0 400 topcontext not found');
            exit;
        }
    }
}






$componentQueryMin = "SELECT dgpath_component.id as id, dgpath_component.type as type,  dgpath_component.subcontext as subcontext, dgpath_component.context as context, dgpath_component.title as title, dgpath_component.content as description from dgpath_component ";
$componentQueryMin = $componentQueryMin."where dgpath_component.context = ?";

$globalResult = getThisContextComponents($componentQueryMin, $link,$contextId);
$return = array($collectionId,$globalResult, $collectionTitle, $selectClick, $collectionDescription);
$returnDataJson = json_encode($return);
echo($returnDataJson);


function getThisContextComponents($componentQuery,  $link, $contextId){
    $componentParams = array($contextId);
    $thisContextComponents = array();
    $componentQueryResult = mysqli_prepared_query($link,$componentQuery,"s",$componentParams);
    foreach($componentQueryResult as $row){
       array_push($thisContextComponents, $row);
    }
    return $thisContextComponents;
}




function traverseContextTitles($componentQuery,  $link, $contextId){
    $componentParams = array($contextId);
    $thisContextComponents = array();
    $componentQueryResult = mysqli_prepared_query($link,$componentQuery,"s",$componentParams);
    foreach($componentQueryResult as $row){
        if(($row['type']!='subcontext')&&($row['type']!='folder')) {
            array_push($thisContextComponents, $row);
        }else{
            $thisResult = traverseContextTitles($componentQuery,  $link,  $row['subcontext']);
            $row['subContextElements']= $thisResult;
            array_push($thisContextComponents, $row);
        }
    }
    return $thisContextComponents;
}
