<?php
/**
 * Created by PhpStorm.
 * User: georgepipkin
 * Date: 2/8/15
 * Time: 11:56 AM
 */

require_once '../server_mysqli/jsonED.php';
require_once '../server_mysqli/constants.php';
require_once '../server_mysqli/dbparams.php';
require_once '../server_mysqli/preparedQuery.php';

$thisConnectionId = $_POST['connectionId'];

$query = "delete from dgpath_rules where connection_id = ?";

$connectionParams = array($thisConnectionId);
$queryResult = mysqli_prepared_query($link,$query,"s",$connectionParams);

if ($queryResult[0]<0) {
    header('HTTP/1.0 400 error deleting rules in connection delete');
    exit;
}

$query = "delete from dgpath_connection where id = ?";

$connectionParams = array($thisConnectionId);
$queryResult = mysqli_prepared_query($link,$query,"s",$connectionParams);

if ($queryResult[0]<0) {
    header('HTTP/1.0 400 error in deleting connection');
    exit;
}

echo "ok";
