<?php
/**
 * Created by JetBrains PhpStorm.
 * User: georgepipkin
 * Date: 4/2/13
 * Time: 7:31 PM
 * To change this template use File | Settings | File Templates.
 */

require_once '../server/constants.php';
require_once '../server/jsonED.php';
require_once '../server/dbparams.php';



$jevents = $_POST["componentEvents"];
$connectionId = $_POST['connectionId'];
$goAhead = $_POST['goAhead'];

$selectedEvents = json_decode($jevents);

if($goAhead=='true'){
    $query = "UPDATE dgpath_connection set go_ahead=1 where dgpath_connection.id='$connectionId'";
}else{
    $query = "UPDATE dgpath_connection set go_ahead=0 where dgpath_connection.id='$connectionId'";
}
$result = mysql_query($query);
if (!$result) {
    die('Invalid query: ' . mysql_error());
}


foreach($selectedEvents as $thisSelectedEvent){
    $eventArray = get_object_vars($thisSelectedEvent);
    $thisEventId = $eventArray['evtId'];
    $thisEventLogicalRole = $eventArray['logicalRole'];
    $thisEventArg = $eventArray['arg'];
    $query = "";
    $explodedEvent = explode(".", $thisEventId);
    $recordExists = false;
    $runQuery=false;
    $query = "SELECT * from dgpath_rules where event_id = '$explodedEvent[1]' and connection_id = '$connectionId'";

    $result = mysql_query($query);
    if (!$result) {
        die('Invalid query: ' . mysql_error());
    }
    while($row=mysql_fetch_array($result)){
        $recordExists=true;
    }
    switch ($thisEventLogicalRole){
        case "necessary":
            if(!$recordExists){
                $query = "INSERT into dgpath_rules (event_id, connection_id, necessary, sufficient, necessary_ex, detail_re) values ('$explodedEvent[1]','$connectionId', 1,0,0,'$thisEventArg')";
            }else{
                $query = "UPDATE dgpath_rules set necessary=1, sufficient = 0, necessary_ex = 0, detail_re = '$thisEventArg' where event_id = '$explodedEvent[1]' and connection_id = '$connectionId'";
            }
            break;
        case "sufficient":
            if(!$recordExists){
                $query = "INSERT into dgpath_rules (event_id, connection_id, necessary, sufficient, necessary_ex, detail_re) values ('$explodedEvent[1]','$connectionId', 0,1,0,'$thisEventArg')";
            }else{
                $query = "UPDATE dgpath_rules set necessary=0, sufficient = 1, necessary_ex = 0, detail_re = '$thisEventArg' where event_id = '$explodedEvent[1]' and connection_id = '$connectionId'";
            }
            break;
        case "exclude":
            if(!$recordExists){
                $query = "INSERT into dgpath_rules (event_id, connection_id, necessary, sufficient, necessary_ex, detail_re) values ('$explodedEvent[1]','$connectionId', 0,0,1,'$thisEventArg')";
            }else{
                $query = "UPDATE dgpath_rules set necessary=0, sufficient = 0, necessary_ex = 1, detail_re = '$thisEventArg' where event_id = '$explodedEvent[1]' and connection_id = '$connectionId'";
            }
            break;
        case "clear":
            if($recordExists) $runQuery=true;
            $query = "DELETE from dgpath_rules where event_id = '$explodedEvent[1]' and connection_id = '$connectionId'";

    }

    $result = mysql_query($query);
    if (!$result) {
        die('Invalid query: ' . mysql_error());
    }

}
echo("ok");