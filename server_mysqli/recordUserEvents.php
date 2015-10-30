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
require_once '../server_mysqli/recordUserEvents.php';


function recordThisUserEvent($thisEvent, $thisSessionId){

    GLOBAL $documentViewed,$documentLinkClicked,$mcViewed,$mcCorrect,$mcAnswerX,$tfTrueSelected,$tfFalseSelected;
    GLOBAL $tfViewed,$tfCorrect,$tfClicked,$contextEntered,$contextExited,$entryDoorEntered,$exitDoorExited,$correctAnswer;
    GLOBAL $fibViewed,$correctFibAnswer,$fibAnswered,$fibResponse,$componentViewed,$tfAnswer,$scoreTotalMatched, $linkTransfer;

}

function recordSuccessfulScreenTransfer($thisSessionId, $nextComponentId,$thisContext, $submittingComponent){
    GLOBAL $linkTransfer, $medium, $infoKeepVisible, $adminRole, $link;

    $thisContextId = $thisContext;
    $thisComponentId = $submittingComponent;
    $thisTraversalQueryResult = getTraversalId(session_id());
    $thisTraversalId = $thisTraversalQueryResult[0];
    $thisUserId = $thisTraversalQueryResult[1];
    $thisEventType = $linkTransfer;
    $nextComponentTitle = getComponentTitle($nextComponentId);
    $thisUserDetail = $_SESSION['eid']." responded at:".strftime("%F %T")." linked to ".$nextComponentTitle;
    $thisDetailArray = array("msg"=>$thisUserDetail, "nextComponent"=>$nextComponentId);
    $thisDetail = json_encode($thisDetailArray);
    $projectQueryResult = getProjectFromContext($thisContextId);
    $thisProjectId = $projectQueryResult[0];
    $thisProjectTitle = $projectQueryResult[1];
    $thisPriority = $medium;
    $thisStatus = $infoKeepVisible;
    $thisBatchId = 0;
    $thisTraversal = getTraversalId($thisSessionId);
    $thisAttenTo = $adminRole;
    $logEventQuery = "INSERT into dgpath_user_events (component_id, user_id, detail, event_type, project_id, priority, status, submission_batch_id, traversal_id, atten_to, context_id) values (?,?,?,?,?,?,?,?,?,?,?)";
    if ($stmt = mysqli_prepare($link, $logEventQuery)) {

        mysqli_stmt_bind_param($stmt, "sssssssssss",$thisComponentId, $thisUserId, $thisDetail, $thisEventType ,$thisProjectId, $thisPriority, $thisStatus, $thisBatchId, $thisTraversal, $thisAttenTo, $thisContextId );
        mysqli_stmt_execute($stmt);
        if(mysqli_stmt_affected_rows($stmt)==0){
            header('HTTP/1.0 400 Nothing saved - agent_traversal insert');
            exit;
        }else{
            $transferRecordId = $stmt->insert_id;
        }
    }
    return $transferRecordId;
}

function recordLogin($traversalId, $userId, $userEid){

    GLOBAL $link, $userLoggedIn, $veryLow, $notCurrentlyRelevent, $adminRole;
    $thisComponentId = 0;
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
    $thisContextId = 0;
    $thisAttenTo = $adminRole;

    $loginEventQuery = "INSERT into dgpath_user_events (component_id, user_id, detail, event_type, project_id, priority, status, submission_batch_id, traversal_id, atten_to, context_id) values (?,?,?,?,?,?,?,?,?,?,?)";
    if ($stmt = mysqli_prepare($link, $loginEventQuery)) {

        mysqli_stmt_bind_param($stmt, "sssssssssss",$thisComponentId, $thisUserId, $thisDetail, $thisEventType ,$thisProjectId, $thisPriority, $thisStatus, $thisBatchId, $thisTraversal, $thisAttenTo, $thisContextId );
        mysqli_stmt_execute($stmt);
        if(mysqli_stmt_affected_rows($stmt)==0){
            header('HTTP/1.0 400 Nothing saved - agent_traversal insert');
            exit;
        }
    }
    return true;
}

function recordSelectionAuthoring($contextId, $traversalId, $userId){
    GLOBAL $link, $authorSelect, $veryLow, $notCurrentlyRelevent,$adminRole ;

    $thisComponentId = 0;
    $thisTraversalId = $traversalId;
    $thisUserId = $userId;
    $thisEventType = $authorSelect;
    $thisPriority = $veryLow;
    $thisStatus = $notCurrentlyRelevent;
    $thisBatchId = 0;
    $thisTraversal = 0;
    $thisContextId = $contextId;
    $thisAttenTo = $adminRole;
    $projectQueryResult = getProjectFromContext($thisContextId);
    $thisProjectId = $projectQueryResult[0];
    $thisProjectTitle = $projectQueryResult[1];
    $detailContent = $_SESSION['username']." selected ".$thisProjectTitle." at:".strftime("%F %T");
    $thisDetailArray = array("msg"=>$detailContent);
    $thisDetail = json_encode($thisDetailArray);
    $loginEventQuery = "INSERT into dgpath_user_events (component_id, user_id, detail, event_type, project_id, priority, status, submission_batch_id, traversal_id, atten_to, context_id) values (?,?,?,?,?,?,?,?,?,?,?)";
    if ($stmt = mysqli_prepare($link, $loginEventQuery)) {

        mysqli_stmt_bind_param($stmt, "sssssssssss",$thisComponentId, $thisUserId, $thisDetail, $thisEventType ,$thisProjectId, $thisPriority, $thisStatus, $thisBatchId, $thisTraversalId, $thisAttenTo, $thisContextId );
        mysqli_stmt_execute($stmt);
        if(mysqli_stmt_affected_rows($stmt)==0){
            header('HTTP/1.0 400 Nothing saved - authorSelect insert');
            exit;
        }
    }
    return true;

}

function getProjectFromContext($contextId){
    GLOBAL $link;
    $thisContextId = $contextId;
    $projectLookupQuery = "SELECT dgpath_context.project as projectId, dgpath_project.proj_name as projectTitle  from dgpath_context, dgpath_project where dgpath_project.id = dgpath_context.project and dgpath_context.id = ?";
    $params = array($thisContextId);
    $projectFound = false;
    $queryResult = mysqli_prepared_query($link,$projectLookupQuery,"s",$params);
    foreach($queryResult as $row){
        $projectFound=true;
        $thisProjectId = $row['projectId'];
        $thisProjectTitle = $row['projectTitle'];
    }

    return array($thisProjectId, $thisProjectTitle);
}

function getComponentTitle($componentId){
    GLOBAL $link;

    $componentTitleQuery = "SELECT title from dgpath_component where id = ?";
    $componentTitleParams = array($componentId);
    $componentFound = false;
    $queryResult = mysqli_prepared_query($link,$componentTitleQuery,"s",$componentTitleParams);
    foreach($queryResult as $row){
        $componentFound = true;
        $thisComponentTitle = $row['title'];
    }
    if(!$componentFound){
        header('HTTP/1.0 400 session problem - compopnent not found');
        exit;
    }
    return $thisComponentTitle;
}

function getTraversalId($sessionId){
    GLOBAL $link;
    $traversalIdQuery = "SELECT id, user_id from dgpath_agent_traversal where session = ? order by login_time";
    $traversalParams = array($sessionId);
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
    return array($thisTraversalId, $thisUserId);

}