<?php
/**
 * Created by JetBrains PhpStorm.
 * User: georgepipkin
 * Date: 4/2/13
 * Time: 7:31 PM
 * To change this template use File | Settings | File Templates.
 */

require_once '../server_mysqli/constants.php';
require_once '../server_mysqli/jsonED.php';
require_once '../server_mysqli/dbparams.php';
require_once '../server_mysqli/preparedQuery.php';



$jevents = $_POST["componentEvents"];
$connectionId = $_POST['connectionId'];
$goAhead = $_POST['goAhead'];

$selectedEvents = json_decode($jevents);

$query = "UPDATE dgpath_connection set go_ahead= ? where dgpath_connection.id= ?";
if($goAhead=='true'){
    $setGoAhead =1;
//    $query = "UPDATE dgpath_connection set go_ahead=1 where dgpath_connection.id='$connectionId'";
}else{
//    $query = "UPDATE dgpath_connection set go_ahead=0 where dgpath_connection.id='$connectionId'";
    $setGoAhead = 0;
}
if ($stmt = mysqli_prepare($link, $query)) {
    mysqli_stmt_bind_param($stmt, "id", $setGoAhead,$connectionId );
    mysqli_stmt_execute($stmt);
    if(strlen(mysqli_error($link))!=0){
        header('HTTP/1.0 400 Nothing saved - update connection');
        exit;
    }
}else{
    header('HTTP/1.0 400 bad query - update connection');
    exit;
}


foreach($selectedEvents as $thisSelectedEvent){
    $eventArray = get_object_vars($thisSelectedEvent);
    $thisEventId = $eventArray['evtId'];
    $activate = $eventArray['activate'];
    $thisEventLogicalRole = $eventArray['logicalRole'];
    $thisEventArg = $eventArray['arg'];
    $query = "";
    $explodedEvent = explode(".", $thisEventId);
    $recordExists = false;
    $runQuery=false;
    $query = "SELECT * from dgpath_rules where event_id = ? and connection_id = ?";
    $Params = array($explodedEvent[1], $explodedEvent[2]);
    $queryResult = mysqli_prepared_query($link,$query,"ss",$Params);

    if ($queryResult[0]=="error") {
        header('HTTP/1.0 400 connection error look up user on rule query');
        exit;
    }
    $dataFound = false;
    foreach($queryResult as $row){
        $recordExists=true;
    }
    if(!$recordExists){
        if($activate!=0){
            $query = "INSERT into dgpath_rules (event_id, connection_id, activate) values (?,?,?)";
            if ($stmt = mysqli_prepare($link, $query)) {
                mysqli_stmt_bind_param($stmt, "ddd", $explodedEvent[1],$explodedEvent[2], $activate);
                mysqli_stmt_execute($stmt);
                if(mysqli_stmt_affected_rows($stmt)==0){
                    header('HTTP/1.0 400 Nothing saved - rule insert');
                    exit;
                }
            }else{
                header('HTTP/1.0 400 bad query - rule insert');
                exit;
            }
        }
    }else{
        if($activate==0){
            $query = "DELETE from dgpath_rules where event_id = ? and connection_id = ?";
            if ($stmt = mysqli_prepare($link, $query)) {
                mysqli_stmt_bind_param($stmt, "sd", $explodedEvent[1],$explodedEvent[2]);
                mysqli_stmt_execute($stmt);
                if(mysqli_stmt_affected_rows($stmt)==0){
                    header('HTTP/1.0 400 Nothing saved - rule delete');
                    exit;
                }
            }else{
                header('HTTP/1.0 400 bad query - rule delete');
                exit;
            }
        }else{
            $query = "UPDATE dgpath_rules set activate = ? where event_id = ? and connection_id = ?";
            if ($stmt = mysqli_prepare($link, $query)) {
                mysqli_stmt_bind_param($stmt, "ddd", $activate, $explodedEvent[1], $explodedEvent[2]);
                mysqli_stmt_execute($stmt);
                if(strlen(mysqli_error($link))!=0){
                    header('HTTP/1.0 400 Nothing saved - rule update');
                    exit;
                }
            }else{
                header('HTTP/1.0 400 bad query - rule update');
                exit;
            }
        }
    }
}
echo("ok");