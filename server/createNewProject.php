<?php
/**
 * Created by JetBrains PhpStorm.
 * User: georgepipkin
 * Date: 3/12/13
 * Time: 9:53 PM
 * To change this template use File | Settings | File Templates.
 */




require_once '../server/jsonED.php';
require_once '../server/constants.php';
require_once '../server/insertDocument.php';
require_once '../server/loadComponents.php';
require_once '../server/dbparams.php';

$projectTitle = $_POST['ptitle'];
$ownerContext = $_POST['ownerContext'];
$canvasWidth = $_POST['width'];
$canvasHeight= $_POST['height'];

$query = "INSERT INTO dgpath_project(owner_context, proj_name) values($ownerContext,'$projectTitle')";
$result = mysql_query($query);
if (!$result) {
    die('Invalid query: ' . mysql_error());
}
$thisProject = mysql_insert_id();

$thisContextTitle = $projectTitle;
$query = "insert into dgpath_context(title, project, parent, topcontext) values ('$thisContextTitle', '$thisProject',0,TRUE)";
$result = mysql_query($query);
if (!$result) {
    die('Invalid query: ' . mysql_error());
}
$contextId = mysql_insert_id();

$entryDoor = insertDoors($contextId, $canvasWidth, $canvasHeight, $projectTitle);



echo($entryDoor);

