<?php
/**
 * Created by PhpStorm.
 * User: georgepipkin
 * Date: 10/25/15
 * Time: 4:11 PM
 */

require_once '../server_mysqli/constants.php';
require_once '../server_mysqli/jsonED.php';
require_once '../server_mysqli/dbparams.php';
require_once '../server_mysqli/preparedQuery.php';
require_once '../server_mysqli/loadContent.php';
require_once '../server_mysqli/evtypes.php';

function recordThisUserEvent($thisEvent, $thisSessionId){

    GLOBAL $documentViewed,$documentLinkClicked,$mcViewed,$mcCorrect,$mcAnswerX,$tfTrueSelected,$tfFalseSelected;
    GLOBAL $tfViewed,$tfCorrect,$tfClicked,$contextEntered,$contextExited,$entryDoorEntered,$exitDoorExited,$correctAnswer;
    GLOBAL $fibViewed,$correctFibAnswer,$fibAnswered,$fibResponse,$componentViewed,$tfAnswer,$scoreTotalMatched, $linkTransfer;

}

function recordSuccessfulScreenTransfer($thisSessionId, $nextComponentId){
    GLOBAL $linkTransfer;

    $transferRecordId=null;
    return $transferRecordId;
}

function recordLogin($traversalId, $userId, $userEid){

    GLOBAL $link, $userLoggedIn, $veryLow, $notCurrentlyRelevent, $adminRole;
    $thisTraversalId = $traversalId;
    $thisUserId = $userId;
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

    $loginEventQuery = "INSERT component_id, user_id, detail, event_type, project_id, priority, status, submission_batch_id, traversal_id, atten_to values (?,?,?,?,?,?,?,?,?,?)";
    if ($stmt = mysqli_prepare($link, $loginEventQuery)) {

        mysqli_stmt_bind_param($stmt, "ssssssssss", $thisUserId, $thisDetail, $thisEventType ,$thisProjectId, $thisPriority, $thisStatus, $thisBatchId, $thisTraversal, $thisAttenTo );
        mysqli_stmt_execute($stmt);
        if(mysqli_affected_rows($link)==0){
            header('HTTP/1.0 400 Nothing saved - agent_traversal insert');
            exit;
        }
    }
    return true;


}