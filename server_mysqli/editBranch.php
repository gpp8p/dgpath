<?php
/**
 * Created by PhpStorm.
 * User: georgepipkin
 * Date: 9/11/15
 * Time: 9:30 AM
 */
require_once '../server_mysqli/jsonED.php';

require_once '../server_mysqli/constants.php';
require_once '../server_mysqli/insertDocument.php';
require_once '../server_mysqli/loadComponents.php';
require_once '../server_mysqli/dbparams.php';
require_once '../server_mysqli/preparedQuery.php';


$componentId = $_POST['componentId'];
$thisPassFailPoint = $_POST['passFailPoint'];
$newContent = $_POST['content'];

$passActivate;
$failActivate;

switch($thisPassFailPoint){
    case '10':
        $passActivate = $passIfScoreGt10;
        $failActivate = $passIfScoreLt10;
        break;
    case '20':
        $passActivate = $passIfScoreGt20;
        $failActivate = $passIfScoreLt20;
        break;
    case '30':
        $passActivate = $passIfScoreGt30;
        $failActivate = $passIfScoreLt30;
        break;
    case '40':
        $passActivate = $passIfScoreGt40;
        $failActivate = $passIfScoreLt40;
        break;
    case '50':
        $passActivate = $passIfScoreGt50;
        $failActivate = $passIfScoreLt50;
        break;
    case '60':
        $passActivate = $passIfScoreGt60;
        $failActivate = $passIfScoreLt60;
        break;
    case '65':
        $passActivate = $passIfScoreGt65;
        $failActivate = $passIfScoreLt65;
        break;
    case '70':
        $passActivate = $passIfScoreGt70;
        $failActivate = $passIfScoreLt70;
        break;
    case '75':
        $passActivate = $passIfScoreGt75;
        $failActivate = $passIfScoreLt75;
        break;
    case '80':
        $passActivate = $passIfScoreGt80;
        $failActivate = $passIfScoreLt80;
        break;
    case '85':
        $passActivate = $passIfScoreGt85;
        $failActivate = $passIfScoreLt85;
        break;
    case '90':
        $passActivate = $passIfScoreGt90;
        $failActivate = $passIfScoreLt90;
        break;
    case '95':
        $passActivate = $passIfScoreGt95;
        $failActivate = $passIfScoreLt95;
        break;
    default:
        break;
}


$query = "select dgpath_rules.id as ruleId from dgpath_connection, dgpath_rules ";
$query = $query."where dgpath_rules.connection_id = dgpath_connection.id ";
$query = $query."and dgpath_connection.start_id = ? ";
$query = $query."and dgpath_rules.detail_re = 'pass'";

$connectionFoundPass = false;
$componentParams = array($componentId);
$queryResult = mysqli_prepared_query($link,$query,"s",$componentParams);
if ($queryResult[0]=="error") {
    header('HTTP/1.0 400 error getting pass exit id');
    exit;
}
$passExit;
foreach($queryResult as $componentData){
    $passExit = $componentData['ruleId'];
    $connectionFoundPass = true;
}

if($connectionFoundPass){
    $query = "UPDATE dgpath_component set content = ? where id = ?";
    if ($stmt = mysqli_prepare($link, $query)) {
        mysqli_stmt_bind_param($stmt, "ss", $newContent, $componentId);
        mysqli_stmt_execute($stmt);
        if(strlen(mysqli_error($link))!=0){
            header('HTTP/1.0 400 Nothing saved - update branching component');
            exit;
        }
    }else{
        header('HTTP/1.0 400 bad query - update rules pass exit');
        exit;
    }
    $query = "UPDATE dgpath_rules set activate = ? where dgpath_rules.id = ?";
    if ($stmt = mysqli_prepare($link, $query)) {
        mysqli_stmt_bind_param($stmt, "ss", $passActivate, $passExit);
        mysqli_stmt_execute($stmt);
        if(strlen(mysqli_error($link))!=0){
            header('HTTP/1.0 400 Nothing saved - update pass link');
            exit;
        }
    }else{
        header('HTTP/1.0 400 bad query - pass exit rule update failed');
        exit;
    }
}else{
    header('HTTP/1.0 400 connection no pass connection was found');
    exit;
}
$query = "select dgpath_rules.id as ruleId from dgpath_connection, dgpath_rules ";
$query = $query."where dgpath_rules.connection_id = dgpath_connection.id ";
$query = $query."and dgpath_connection.start_id = ? ";
$query = $query."and dgpath_rules.detail_re = 'fail'";

$connectionFoundFail = false;
$componentParams = array($componentId);
$queryResult = mysqli_prepared_query($link,$query,"s",$componentParams);
if ($queryResult[0]=="error") {
    header('HTTP/1.0 400 error getting fail exit id');
    exit;
}
$failExit;
foreach($queryResult as $componentData){
    $failExit = $componentData['ruleId'];
    $connectionFoundFail = true;
}
if($connectionFoundFail){
    $query = "UPDATE dgpath_rules set activate = ? where dgpath_rules.id = ?";
    if ($stmt = mysqli_prepare($link, $query)) {
        mysqli_stmt_bind_param($stmt, "ss", $failActivate, $failExit);
        mysqli_stmt_execute($stmt);
        if(strlen(mysqli_error($link))!=0){
            header('HTTP/1.0 400 Nothing saved - update connection');
            exit;
        }
    }else{
        header('HTTP/1.0 400 bad query - update rules fail exit');
        exit;
    }
}else{
    header('HTTP/1.0 400 connection no fail connection was found');
    exit;
}
echo "ok";



