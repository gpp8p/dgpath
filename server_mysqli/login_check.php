<?php
/**
 * Created by PhpStorm.
 * User: georgepipkin
 * Date: 4/26/14
 * Time: 9:08 PM
 */
session_start();
require_once '../server/jsonED.php';
require_once '../server/dbparams_mysqli.php';


$username = $_POST['username'];
$password = $_POST['password'];

//$link = mysqli_connect("127.0.0.1", "gpp8p", "kal1ca7", "dgpath");

if (mysqli_connect_errno()) {
    header('HTTP/1.0 400 Database Available');
    exit();
}
$loginSuccess = false;
if ($stmt = mysqli_prepare($link, 'SELECT id FROM dgpath_user where
                      user_eid=? and password=?')) {
    /* bind parameters for markers */
    /* Assumes userid is integer and category is string */
    mysqli_stmt_bind_param($stmt, "ss", $username, $password);
    /* execute query */
    mysqli_stmt_execute($stmt);
    mysqli_stmt_bind_result($stmt, $id);

    while (mysqli_stmt_fetch($stmt)) {
        $loginSuccess=true;
    }
}
mysqli_stmt_close($stmt);
mysqli_close($link);
if($loginSuccess){
    $_SESSION['username'] = $username;
    echo('1');
}else{
    header('HTTP/1.0 400 Login Failed');
    exit;
}