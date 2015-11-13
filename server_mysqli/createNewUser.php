<?php
/**
 * Created by PhpStorm.
 * User: georgepipkin
 * Date: 11/12/15
 * Time: 8:56 PM
 */
session_start();
require_once '../server_mysqli/jsonED.php';
require_once '../server_mysqli/constants.php';
require_once '../server_mysqli/insertDocument.php';
require_once '../server_mysqli/loadComponents.php';
require_once '../server_mysqli/dbparams.php';
require_once '../server_mysqli/preparedQuery.php';

if (mysqli_connect_errno()) {
    header('HTTP/1.0 400 Database Available');
    exit();
}

$lastName = $_POST['lastname'];
$firstName = $_POST['firstname'];
$eid = $_POST['eid'];
$email = $_POST['email'];
$password = $_POST['password'];
$userType = $_POST['userType'];





echo('ok');