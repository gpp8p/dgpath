<?php
/**
 * Created by PhpStorm.
 * User: georgepipkin
 * Date: 10/27/15
 * Time: 6:28 PM
 */

require_once '../server_mysqli/constants.php';
require_once '../server_mysqli/jsonED.php';
require_once '../server_mysqli/dbparams.php';
require_once '../server_mysqli/preparedQuery.php';
require_once '../server_mysqli/loadContent.php';
require_once '../server_mysqli/evtypes.php';
require_once '../server_mysqli/recordUserEvents.php';

$traversalIdQuery = "SELECT id, user_id from dgpath_agent_traversal where session = ?";


session_start();
$thisSessionId = session_id();
$logFunction = $_POST['logFunction'];
if($logFunction==null){
    header('HTTP/1.0 400 no log function provided');
    exit;
}

$traversalParams = array($thisSessionId);
$traversalFound = false;
$queryResult = mysqli_prepared_query($link,$traversalIdQuery,"s",$traversalParams);
foreach($queryResult as $row){
    $traversalFound=true;
    $thisTraversalId = $row['id'];
    $thisUserId = $row['user_id'];
}
if(!$traversalFound){
    header('HTTP/1.0 400 session problem - traversal not found');
    exit;
}

switch($logFunction){

    case "authorSelect":
        recordSelectionAuthoring($contextId, $traversalId, $userId);
        break;

    default:
        header('HTTP/1.0 400 unknown log function:'.$logFunction);
        exit;
}






$thisEventType = $userLoggedIn;
$thisUserName = $userEid." logged in at:".strftime("%F %T");
$thisDetailArray = array("msg"=>$thisUserName);
$thisDetail = json_encode($thisDetailArray);
$thisProjectId = 0;
$thisPriority = $veryLow;
$thisStatus = $notCurrentlyRelevent;
$thisBatchId = 0;
$thisTraversal = 0;
$thisAttenTo = $adminRole;
