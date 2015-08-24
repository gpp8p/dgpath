<?php
/**
 * Created by PhpStorm.
 * User: georgepipkin
 * Date: 4/19/14
 * Time: 9:16 AM
 */


require_once '../server/jsonED.php';
require_once '../server/constants.php';
require_once '../server/loadComponents.php';
require_once '../server/dbparams.php';


$doorId = $_POST['doorId'];
$title  = $_POST['title'];
$doorConfig = $_POST['doorConfig'];
$subContextComponentId = $_POST['subContextComponentId'];
$subContextId = $_POST['subContextId'];


$query = "UPDATE dgpath_component set title = '$title' where id = '$subContextComponentId'";
$result = mysql_query($query);
if (!$result) {
    die('Invalid query: ' . mysql_error());
}

$query = "UPDATE dgpath_component set content = '$doorConfig' where id = '$doorId'";
$result = mysql_query($query);
if (!$result) {
    die('Invalid query: ' . mysql_error());
}

$query = "UPDATE dgpath_context set title = '$title' where id = '$subContextId'";
$result = mysql_query($query);
if (!$result) {
    die('Invalid query: ' . mysql_error());
}
echo("ok");