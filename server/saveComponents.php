<?php
/**
 * Created by JetBrains PhpStorm.
 * User: georgepipkin
 * Date: 11/26/12
 * Time: 10:24 PM
 * To change this template use File | Settings | File Templates.
 */

require_once '../server/jsonED.php';
require_once '../server/constants.php';
require_once '../server/dbparams.php';


$jsonComponentData =  $_POST["components"];
$jsonConnectionData = $_POST["connections"];
$thisProject = $_POST["thisProject"];

$submittedComponents = json_decode($jsonComponentData, true);
$submittedConnections = json_decode($jsonConnectionData, true);




$projectId= $thisProject;
if($projectId>0){
    $componentKeys = array();
    foreach ($submittedComponents as $component){
        $canvasX = $component['canvasX'];
        $canvasY = $component['canvasY'];
        $icon = $component['icon'];
        $componentId = $component['id'];
        $layerName = $component['layerName'];
        $query = "SELECT x,y from dgpath_component where dgpath_component.id = '$componentId'";
        $result = mysql_query($query);
        if (!$result) {
            die('Invalid query: ' . mysql_error());
        }
        $dataFound = false;
        while($data=mysql_fetch_array($result)){
            $dataFound = true;
        }
        if($dataFound){
            $query = "UPDATE dgpath_component SET dgpath_component.x='$canvasX', dgpath_component.y='$canvasY' where dgpath_component.id = '$componentId'";
            $result = mysql_query($query);
            if (!$result) {
                die('Invalid query: ' . mysql_error());
            }
            $componentKeys[$layerName] = $componentId;
        }else{
            $query = "INSERT INTO dgpath_component(type,x,y,project) values('$icon', '$canvasX', '$canvasY','$projectId')";
            $result = mysql_query($query);
            if (!$result) {
                die('Invalid query: ' . mysql_error());
            }
            $componentLastItemID = mysql_insert_id();
            $componentKeys[$layerName] = $componentLastItemID;
            if($layerName == $thisComponentName){
                $thisComponentName = $componentLastItemID;
            }

        }


    }
    foreach ($submittedConnections as $sconnection){
        $fromLayerName = $sconnection['fromLayerName'];
        $start_id = $componentKeys[$fromLayerName];
        $toLayerName = $sconnection['toLayerName'];
        $end_id = $componentKeys[$toLayerName];
        $query = "SELECT start_id,end_id from dgpath_connection where start_id = '$start_id' and end_id = '$end_id'";
        $result = mysql_query($query);
        if (!$result) {
            die('Invalid query: ' . mysql_error());
        }
        $connectionExists=false;
        while($data=mysql_fetch_array($result)){
            $connectionExists=true;
        }
        if(!$connectionExists){
            $query = "INSERT INTO dgpath_connection(start_id,end_id) values ('$start_id', '$end_id')";
            $result = mysql_query($query);
            if (!$result) {
                die('Invalid query: ' . mysql_error());
            }
        }

    }
    echo("Project currently in view was saved");
}

?>







