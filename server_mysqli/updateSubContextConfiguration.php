<?php
/**
 * Created by PhpStorm.
 * User: georgepipkin
 * Date: 4/19/14
 * Time: 9:16 AM
 */


require_once '../server_mysqli/jsonED.php';
require_once '../server_mysqli/constants.php';
require_once '../server_mysqli/loadComponents.php';
require_once '../server_mysqli/dbparams.php';


$doorId = $_POST['doorId'];
$title  = $_POST['title'];
$doorConfig = $_POST['doorConfig'];
$subContextComponentId = $_POST['subContextComponentId'];
$subContextId = $_POST['subContextId'];


$query = "UPDATE dgpath_component set title = ? where id = ?";
if ($stmt = mysqli_prepare($link, $query)) {
    mysqli_stmt_bind_param($stmt, "sd", $title, $subContextComponentId);
    mysqli_stmt_execute($stmt);
    if(mysqli_stmt_affected_rows($stmt)==0){
        header('HTTP/1.0 400 Nothing saved - subcontext update');
        exit;
    }
}else{
    header('HTTP/1.0 400 bad query - ubcontext update');
    exit;
}


$query = "UPDATE dgpath_component set content = ? where id = ?";
if ($stmt = mysqli_prepare($link, $query)) {
    mysqli_stmt_bind_param($stmt, "sd", $doorConfig, $doorId);
    mysqli_stmt_execute($stmt);
    if(mysqli_stmt_affected_rows($stmt)==0){
        header('HTTP/1.0 400 Nothing saved - context component update');
        exit;
    }
}else{
    header('HTTP/1.0 400 bad query - context component update');
    exit;
}

$query = "UPDATE dgpath_context set title = ? where id = ?";
if ($stmt = mysqli_prepare($link, $query)) {
    mysqli_stmt_bind_param($stmt, "sd", $title, $subContextId);
    mysqli_stmt_execute($stmt);
    if(mysqli_stmt_affected_rows($stmt)==0){
        header('HTTP/1.0 400 Nothing saved - context update');
        exit;
    }
}else{
    header('HTTP/1.0 400 bad query - context update');
    exit;
}

echo("ok");