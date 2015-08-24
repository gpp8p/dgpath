<?php
/**
 * Created by JetBrains PhpStorm.
 * User: georgepipkin
 * Date: 1/25/13
 * Time: 4:56 PM
 * To change this template use File | Settings | File Templates.
 */


require_once '../server/jsonED.php';
require_once '../server/constants.php';
require_once '../server/insertDocument.php';
require_once '../server/loadComponents.php';
require_once '../server/dbparams.php';


$xpos = $_POST['xpos'];
$ypos = $_POST['ypos'];
$type = $_POST['componentType'];
$title = $_POST['title'];
$content = $_POST['content'];
$context = $_POST['context'];
$componentId = $_POST['componentId'];

$thisMcQuestion = json_decode($content, true);
$content = str_replace('\\n', '', $content);

$query = "UPDATE dgpath_component set type = '$type', x = '$xpos', y = '$ypos', title = '$title', content = '$content', context = '$context' where id = '$componentId'";
$result = mysql_query($query);
if (!$result) {
    die('Invalid query: ' . mysql_error());
}





$newComponentJson = loadComponents($context);
echo($newComponentJson);
