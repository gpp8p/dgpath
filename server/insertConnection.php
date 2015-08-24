<?php
/**
 * Created by JetBrains PhpStorm.
 * User: georgepipkin
 * Date: 2/23/13
 * Time: 11:41 AM
 * To change this template use File | Settings | File Templates.
 */

require_once '../server/jsonED.php';

require_once '../server/constants.php';
require_once '../server/insertDocument.php';
require_once '../server/loadComponents.php';
require_once '../server/dbparams.php';


$startId = $_POST['startId'];
$endId = $_POST['endId'];

$query = "INSERT INTO dgpath_connection(start_id,end_id) values ('$startId', '$endId')";
$result = mysql_query($query);
if (!$result) {
    die('Invalid query: ' . mysql_error());
}
$connectionId = mysql_insert_id();

echo($connectionId);