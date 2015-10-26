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

function recordLogin($thisSessionId, $thisUserId){

    $loginEventTraversalQuery = "INSERT session, user_id into dgpath_agent_traversal values (?,?)";


}