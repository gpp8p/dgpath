<?php
/**
 * Created by PhpStorm.
 * User: georgepipkin
 * Date: 4/26/14
 * Time: 9:08 PM
 */
session_start();
require_once '../server_mysqli/constants.php';
require_once '../server_mysqli/jsonED.php';
require_once '../server_mysqli/dbparams.php';
require_once '../server_mysqli/preparedQuery.php';
require_once '../server_mysqli/evtypes.php';

$username = $_POST['username'];
$password = $_POST['password'];
$thisSessionId = session_id();
//$link = mysqli_connect("127.0.0.1", "gpp8p", "kal1ca7", "dgpath");

if (mysqli_connect_errno()) {
    header('HTTP/1.0 400 Database Available');
    exit();
}
$loginSuccess = false;

$loginQuery = "SELECT id FROM dgpath_user where user_eid=? and password=?";
$loginEventTraversalQuery = "INSERT session, user_id into dgpath_agent_traversal values (?,?)";
$loginParams = array($username, $password);
$queryResult = mysqli_prepared_query($link,$loginQuery,"ss",$loginParams);
$loginSuccess = false;
$logSuccess = false;
$traversalEntrySuccess=false;
foreach($queryResult as $row){
    $loginSuccess=true;
    $thisUserId = $row['id'];
}
if($loginSuccess){
    $_SESSION['username'] = $username;
    if ($stmt = mysqli_prepare($link, $loginEventTraversalQuery)) {
        mysqli_stmt_bind_param($stmt, "ss",$thisSessionId, $thisUserId );
        mysqli_stmt_execute($stmt);
        if(mysqli_affected_rows($link)==0){
            header('HTTP/1.0 400 Nothing saved - agent_traversal insert');
            exit;
        }else {
            $traversalId = $stmt->insert_id;
        }

    }
    $logSuccess = recordLogin($traversalId, $thisUserId,$username );

    echo('1');
}else{
    header('HTTP/1.0 400 Login Failed');
    exit;
}





