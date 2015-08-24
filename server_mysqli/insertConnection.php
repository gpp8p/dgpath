<?php
/**
 * Created by JetBrains PhpStorm.
 * User: georgepipkin
 * Date: 2/23/13
 * Time: 11:41 AM
 * To change this template use File | Settings | File Templates.
 */

require_once '../server_mysqli/jsonED.php';

require_once '../server_mysqli/constants.php';
require_once '../server_mysqli/insertDocument.php';
require_once '../server_mysqli/loadComponents.php';
require_once '../server_mysqli/dbparams.php';


$startId = $_POST['startId'];
$endId = $_POST['endId'];

$query = "INSERT INTO dgpath_connection(start_id,end_id) values ('$startId', '$endId')";
if ($stmt = mysqli_prepare($link, $query)) {
    mysqli_stmt_bind_param($stmt, "s", $startId, $endId);
    mysqli_stmt_execute($stmt);
    if(mysqli_stmt_affected_rows($stmt)==0){
        header('HTTP/1.0 400 Nothing saved - connection insert');
        exit;
    }
}else{
    header('HTTP/1.0 400 bad query - connection insert');
    exit;
}

$connectionId = $stmt->insert_id;

echo($connectionId);