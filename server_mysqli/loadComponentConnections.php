<?php
/**
 * Created by JetBrains PhpStorm.
 * User: georgepipkin
 * Date: 1/25/13
 * Time: 3:34 PM
 * To change this template use File | Settings | File Templates.
 */
require_once '../server_mysqli/jsonED.php';
require_once '../server_mysqli/constants.php';
require_once '../server_mysqli/loadComponents.php';
require_once '../server_mysqli/dbparams.php';
require_once '../server_mysqli/preparedQuery.php';


//$projectId = 2;

$componentId = $_POST['componentId'];


$query = "select dgpath_component.title, dgpath_connection.id from dgpath_connection, dgpath_component where dgpath_component.id = dgpath_connection.end_id and dgpath_connection.start_id = ?";
$connectionParams = array($componentId);
$queryResult = mysqli_prepared_query($link,$query,"s",$connectionParams);

if ($qResult[0]=="error") {
    header('HTTP/1.0 400 connection error look up user on project create');
    exit;
}



$allComponentConnections = array();
foreach($queryResult as $row){
    $thisTitle = $row['title'];
    $thisConnectionId = $row['id'];
    $thisComponentConnection = array('title'=>$thisTitle, 'connectionId'=>$thisConnectionId);
    array_push($allComponentConnections, $thisComponentConnection);

}
$jsonComponent = json_encode($allComponentConnections);
echo($jsonComponent);


