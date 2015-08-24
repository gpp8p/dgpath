<?php
/**
 * Created by PhpStorm.
 * User: georgepipkin
 * Date: 3/1/14
 * Time: 10:49 PM
 */

require_once '../server_mysqli/jsonED.php';
require_once '../server_mysqli/constants.php';
require_once '../server_mysqli/insertDocument.php';
require_once '../server_mysqli/loadComponents.php';
require_once '../server_mysqli/dbparams.php';

$xpos = round($_POST['xpos']);
$ypos = round($_POST['ypos']);
$componentId = $_POST['componentId'];

$query = "UPDATE dgpath_component set x='$xpos', y='$ypos' where id = '$componentId'";
if ($stmt = mysqli_prepare($link, $query)) {
    mysqli_stmt_bind_param($stmt, "d", $componentId);
    mysqli_stmt_execute($stmt);
    if(mysqli_stmt_affected_rows($stmt)==0){
        header('HTTP/1.0 400 Nothing saved -  component position update');
        exit;
    }
}else{
    header('HTTP/1.0 400 bad query - component position update');
    exit;
}


echo 'ok';