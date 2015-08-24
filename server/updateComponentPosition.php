<?php
/**
 * Created by PhpStorm.
 * User: georgepipkin
 * Date: 3/1/14
 * Time: 10:49 PM
 */

require_once '../server/jsonED.php';
require_once '../server/constants.php';
require_once '../server/insertDocument.php';
require_once '../server/loadComponents.php';
require_once '../server/dbparams.php';

$xpos = round($_POST['xpos']);
$ypos = round($_POST['ypos']);
$componentId = $_POST['componentId'];

$query = "UPDATE dgpath_component set x='$xpos', y='$ypos' where id = '$componentId'";
$result = mysql_query($query);
if (!$result) {
    die('Invalid query: ' . mysql_error());
}

echo 'ok';