<?php
/**
 * Created by PhpStorm.
 * User: georgepipkin
 * Date: 8/13/14
 * Time: 9:41 AM
 */

require_once '../server_mysqli/jsonED.php';
require_once '../server_mysqli/constants.php';
require_once '../server_mysqli/loadComponents.php';
require_once '../server_mysqli/dbparams.php';
require_once '../server_mysqli/constants.php';
require_once '../server_mysqli/preparedQuery.php';


//$projectId = 2;

$componentId = $_POST['componentId'];



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
echo("ok");

