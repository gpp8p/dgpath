<?php
/**
 * Created by JetBrains PhpStorm.
 * User: georgepipkin
 * Date: 1/25/13
 * Time: 3:34 PM
 * To change this template use File | Settings | File Templates.
 */
require_once '../server/jsonED.php';
require_once '../server/constants.php';
require_once '../server/loadComponents.php';
require_once '../server/dbparams.php';


//$projectId = 2;

$componentId = $_POST['componentId'];


$query = "select dgpath_component.title, dgpath_connection.id from dgpath_connection, dgpath_component where dgpath_component.id = dgpath_connection.end_id and dgpath_connection.start_id = '$componentId'";
$componentQueryResult = mysql_query($query);
if (!$componentQueryResult) {
    die('Invalid query: ' . mysql_error());
}


$allComponentConnections = array();
while($row=mysql_fetch_array($componentQueryResult)){
    $thisTitle = $row['title'];
    $thisConnectionId = $row['id'];
    $thisComponentConnection = array('title'=>$thisTitle, 'connectionId'=>$thisConnectionId);
    array_push($allComponentConnections, $thisComponentConnection);

}
$jsonComponent = json_encode($allComponentConnections);
echo($jsonComponent);


