<?php
/**
 * Created by PhpStorm.
 * User: georgepipkin
 * Date: 12/8/14
 * Time: 10:22 PM
 */
session_start();
require_once '../server_mysqli/jsonED.php';
require_once '../server_mysqli/constants.php';
require_once '../server_mysqli/insertDocument.php';
require_once '../server_mysqli/loadComponents.php';
require_once '../server_mysqli/dbparams.php';
require_once '../server_mysqli/preparedQuery.php';

if(!isset($_SESSION['username'])){
    header('HTTP/1.0 400 No session - please log in');
    exit;
}else{
    $thisUser = $_SESSION['username'];
}


$title=$_POST['title'];
$description = $_POST['description'];
$collectionId=$_POST['collectionId'];
$context=$_POST['contextId'];

if($context==NULL && $collectionId!=""){
    $query= "SELECT id from dgpath_context where project = ? and topcontext=1";
    $connectionParams = array($collectionId);
    $contextQueryResult = mysqli_prepared_query($link,$query,"s",$connectionParams);

    if ($connectionResult[0]=="error") {
        header('HTTP/1.0 400 connection error look up context on top folder create');
        exit;
    }
    $dataFound = false;
    foreach($contextQueryResult as $row){
        $dataFound = true;
        $context = $row['id'];
    }
    if(!$dataFound){
        header('HTTP/1.0 400 project not found look up user on top folder create');
        exit;
    }
}else{
    $query= "SELECT project from dgpath_context where id = ?";
    $connectionParams = array($context);
    $contextQueryResult = mysqli_prepared_query($link,$query,"s",$connectionParams);

    if ($connectionResult[0]=="error") {
        header('HTTP/1.0 400 connection error look up user on folder create');
        exit;
    }
    $dataFound = false;
    foreach($contextQueryResult as $row){
        $dataFound = true;
        $collectionId = $row['project'];
    }
    if(!$dataFound){
        header('HTTP/1.0 400 project id not found look up user on folder create');
        exit;
    }

}

$FOLDER = "folder";
$ZERO = 0;
$query = "INSERT INTO dgpath_component(type,x,y,context, title, content) values(?,?,?,?,?,?)";
if ($stmt = mysqli_prepare($link, $query)) {
    mysqli_stmt_bind_param($stmt, "ssssss", $FOLDER, $ZERO, $ZERO, $context, $title, $description);
    mysqli_stmt_execute($stmt);
    if(mysqli_stmt_affected_rows($stmt)==0){
        header('HTTP/1.0 400 Nothing saved - folder component insert');
        exit;
    }
}else{
    header('HTTP/1.0 400 bad query - folder component insert');
    exit;
}
$componentLastItemID = $stmt->insert_id;
$query = "insert into dgpath_context(title, project, parent, topcontext) values (?,?,?,?)";
if ($stmt = mysqli_prepare($link, $query)) {
    mysqli_stmt_bind_param($stmt, "ssss", $title,$collectionId ,$componentLastItemID,$FALSE);
    mysqli_stmt_execute($stmt);
    if(mysqli_stmt_affected_rows($stmt)==0){
        header('HTTP/1.0 400 Nothing saved - context insert');
        exit;
    }
}else{
    header('HTTP/1.0 400 bad query - context insert');
    exit;
}

$contextLastItemID = $stmt->insert_id;


$query = "UPDATE dgpath_component set subcontext= ? where id = ?";
if ($stmt = mysqli_prepare($link, $query)) {
    mysqli_stmt_bind_param($stmt, "ss",$contextLastItemID,$componentLastItemID);
    mysqli_stmt_execute($stmt);
    if(mysqli_stmt_affected_rows($stmt)==0){
        header('HTTP/1.0 400 Nothing saved - component context update');
        exit;
    }
}else{
    header('HTTP/1.0 400 bad query - component context update');
    exit;
}

echo("ok");
