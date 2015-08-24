<?php
/**
 * Created by JetBrains PhpStorm.
 * User: georgepipkin
 * Date: 12/18/12
 * Time: 11:48 AM
 * To change this template use File | Settings | File Templates.
 */
require_once '../server/jsonED.php';
require_once '../server/constants.php';
require_once '../server/dbparams.php';



$docContent =  $_POST["docContent"];
$thisComponentName = $_POST["thisComponentName"];
$thisProject = $_POST["thisProject"];
$debug = $_POST["debug"];
$title = $_POST["componentTitle"];
$newProjectName = $_POST["pName"];


if($thisProject != "-1"){
    $query = "SELECT x, y, type, id, title from dgpath_component where project = '$thisProject'";
    $result = mysql_query($query);
    if (!$result) {
        die('Invalid query: ' . mysql_error());
    }
    $components = array();
    $componentIds = array();

    while($row = mysql_fetch_array($result)){
        $thisComponent = array('canvasX'=>$row['x'],'canvasY'=>$row['y'],'icon'=>$row['type'], 'id'=>$row['id'], 'title'=>$row['title']);
        $thisComponentId = $row['id'];
        $components[] = $thisComponent;
        $componentIds[$thisComponentId] = $thisComponent;

    }

    $connections = array();
    foreach ($componentIds as $thisId){
        $componentStartId = $thisId['id'];
        $query = "SELECT start_id,end_id from dgpath_connection  where start_id = '$componentStartId'";
        $result = mysql_query($query);
        if (!$result) {
            die('Invalid query: ' . mysql_error());
        }
        while($row = mysql_fetch_array($result)){
            $startId = $row['start_id'];
            $endId = $row['end_id'];
            $startComponent = $componentIds[$startId];
            $endComponent = $componentIds[$endId];
            $thisConnection = array('fromLayerName'=>$startId,'toLayerName'=>$endId,'startX'=>$startComponent['canvasX'],'startY'=>$startComponent['canvasY'],'endX'=>$endComponent['canvasX'],'endY'=>$endComponent['canvasY']);
            $connections[] = $thisConnection;
        }
    }
}else{
//    $jsonComponents =  $_POST["components"];
//    $jsonConnections = $_POST["connections"];

    $query = "INSERT INTO dgpath_project(owner_context, proj_name) values(2,'$newProjectName')";
    $result = mysql_query($query);
    if (!$result) {
        die('Invalid query: ' . mysql_error());
    }
    $thisProject = mysql_insert_id();
    $connections = array();
    $components = array();
}
$jsonComponents = json_encode($components);
$jsonConnections = json_encode($connections);
