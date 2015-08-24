<?php
/**
 * Created by JetBrains PhpStorm.
 * User: georgepipkin
 * Date: 1/25/13
 * Time: 4:56 PM
 * To change this template use File | Settings | File Templates.
 */


require_once '../server_mysqli/jsonED.php';
require_once '../server_mysqli/constants.php';
require_once '../server_mysqli/insertDocument.php';
require_once '../server_mysqli/loadComponents.php';
require_once '../server_mysqli/dbparams.php';
require_once '../server_mysqli/preparedQuery.php';


$xpos = $_POST['xpos'];
$ypos = $_POST['ypos'];
$type = $_POST['componentType'];
$title = $_POST['title'];
$content = $_POST['content'];
$context = $_POST['context'];
$componentId = $_POST['componentId'];
$reloadContext = $_POST['reloadContext'];

$thisMcQuestion = json_decode($content, true);
$content = str_replace('\\n', '', $content);

// $query = "UPDATE dgpath_component set type = '$type', x = '$xpos', y = '$ypos', title = '$title', content = '$content', context = '$context' where id = '$componentId'";
$query = "UPDATE dgpath_component set type = ?, x = ?, y = ?, title = ?, content = ?, context = ? where id = ?";
if ($stmt = mysqli_prepare($link, $query)) {
    mysqli_stmt_bind_param($stmt, "sssssss", $type, $xpos, $ypos, $title, $content, $context, $componentId);
    mysqli_stmt_execute($stmt);
    if(mysqli_stmt_affected_rows($stmt)==0){
        echo("no change");
    }else{
//        $newComponentJson = loadComponents($context, $link);
//        echo($newComponentJson);
        echo($reloadContext);
    }
}else{
    header('HTTP/1.0 400 Problem with query - component update');
    exit;

}

