<?php
/**
 * Created by PhpStorm.
 * User: georgepipkin
 * Date: 9/16/14
 * Time: 10:02 AM
 */

require_once '../server_mysqli/constants.php';
require_once '../server_mysqli/jsonED.php';
require_once '../server_mysqli/dbparams.php';
require_once '../server_mysqli/preparedQuery.php';
require_once '../server_mysqli/loadContent.php';
require_once '../server_mysqli/evtypes.php';
require_once '../server_mysqli/recordUserEvents.php';


session_start();
$thisSessionId = session_id();

$jsonSubmission = $_POST['submission'];
$submission = json_decode($jsonSubmission);
$thisContext = $_POST['context'];
$submittingComponent = $_POST['submittingComponent'];

$eventDataWasMatched = 0;
$eventDataNotMatched=1;
$eventHappenedNoData=2;

$summationDirectives = array($extraWeight,$normalWeight,$lessWeight);
$extraWeightScore = 150;
$normalWeightScore = 100;
$lessWeightScore = 50;
$navigationDirectives = array($vetoIfTrue, $vetoIfFalse, $passIfTrue, $passIfFalse);
$passDirectives = array($passIfTrue, $passIfFalse,$passIfScoreGt10,$passIfScoreLt10,$passIfScoreGt20,$passIfScoreLt20,$passIfScoreGt30,$passIfScoreLt30,$passIfScoreGt40,$passIfScoreLt40,$passIfScoreGt50,$passIfScoreLt50,$passIfScoreGt60,$passIfScoreLt60,$passIfScoreGt65,$passIfScoreLt65,$passIfScoreGt70,$passIfScoreLt70,$passIfScoreGt75,$passIfScoreLt75,$passIfScoreGt80,$passIfScoreLt80,$passIfScoreGt85,$passIfScoreLt85,$passIfScoreGt90,$passIfScoreLt90,$passIfScoreGt95,$passIfScoreLt95,$passIfScoreEq100,$passIfScoreLt100);
$vetoDirectives = array($vetoIfTrue, $vetoIfFalse);
$summationLevels = array();

$summationLevels['8']= array(10,0);
$summationLevels['9']= array(10,1);
$summationLevels['10']= array(20,0);
$summationLevels['11']= array(20,1);
$summationLevels['12']= array(30,0);
$summationLevels['13']= array(30,1);
$summationLevels['14']= array(40,0);
$summationLevels['15']= array(40,1);
$summationLevels['16']= array(50,0);
$summationLevels['17']= array(50,1);
$summationLevels['18']= array(60,0);
$summationLevels['19']= array(60,1);
$summationLevels['20']= array(65,0);
$summationLevels['21']= array(65,1);
$summationLevels['22']= array(70,0);
$summationLevels['23']= array(70,1);
$summationLevels['24']= array(75,0);
$summationLevels['25']= array(75,1);
$summationLevels['26']= array(80,0);
$summationLevels['27']= array(80,1);
$summationLevels['28']= array(85,0);
$summationLevels['29']= array(85,1);
$summationLevels['30']= array(90,0);
$summationLevels['31']= array(90,1);
$summationLevels['32']= array(95,0);
$summationLevels['33']= array(95,1);
$summationLevels['34']= array(100,0);
$summationLevels['35']= array(100,2);

$summationActivityLow = 8;
$summationActivityHigh=35;

$componentEvents = array();
$submittedEvents = array();
// get all the events for each component involved in the submission.  Each component is identified by a componentViewed event.
foreach($submission as $s){
    $thisSubmission = get_object_vars($s);
    if($thisSubmission['type']==$componentViewed){
        $query = "select dgpath_events.elementId as elementId, dgpath_rules.activate as activate, dgpath_rules.connection_id as connectionId, dgpath_events.sub_param as subParam, dgpath_events.event_type as eventType, dgpath_events.component_id as componentId from dgpath_events, dgpath_rules ";
        $query = $query."where dgpath_rules.event_id = dgpath_events.id ";
        $query = $query."and dgpath_events.component_id = ?";
        $componentId = $thisSubmission['componentId'];
        $connectionParams = array($componentId);
        // this query is going to get you a list of events that can potentially be associated with this component
        $queryResult = mysqli_prepared_query($link,$query,"s",$connectionParams);
        foreach($queryResult as $row){
            array_push($componentEvents, $row);
        }
    }else{
        // capturing the incoming events that are not componentViewed events. Thios will be a list by element id's, some of them will have more than one submitted event
        $submittedForThisElement = $submittedEvents[$thisSubmission['elementId']];
        if($submittedForThisElement!=null){
            array_push($submittedForThisElement,array('componentId'=>$thisSubmission['componentId'],'type'=>$thisSubmission['type'], 'data'=>$thisSubmission['data']));
            $submittedEvents[$thisSubmission['elementId']] = $submittedForThisElement;
        }else{
            $submittedEvents[$thisSubmission['elementId']]=array(array('componentId'=>$thisSubmission['componentId'],'type'=>$thisSubmission['type'], 'data'=>$thisSubmission['data']));
        }
    }
}
$matchedEvents = array();
$matchedScoringEvents = array();
$connectionsAvailable=array();
$totalPossibleScore = 0;
foreach($componentEvents as $thisComponentEvent){
    // looking at the potential events for this component that have activate's set as summation events (activate is extra weight, normal weight, or less weight)
    // figuring the total score possible
    if(array_search($thisComponentEvent['activate'], $summationDirectives)){
        if($thisComponentEvent['activate']==$extraWeight){
            $totalPossibleScore+=$extraWeightScore;
        }elseif($thisComponentEvent['activate']==$normalWeight){
            $totalPossibleScore+=$normalWeightScore;
        }else{
            $totalPossibleScore+=$lessWeightScore;
        }
        $thisEventElementId = $thisComponentEvent['elementId'];
        $learnerSubmittedEventsForThisElement = $submittedEvents[$thisEventElementId];
        // the only thing going here will be summation events
        // has there been anything submitted for this potential event ?
        if($learnerSubmittedEventsForThisElement!=null){
            // do the scoring of the answers, establishing the matchedScoringEvents with the scoring info placed there
            foreach($learnerSubmittedEventsForThisElement as $learnerSubmittedEvent){
                updateMatchedEvents($thisComponentEvent, $learnerSubmittedEvent, $matchedScoringEvents, $connectionsAvailable);
            }
        }
    }
}
$totalScore = 0;
// compute the total actual score based on the matched event having a resultType == 0 (a match with a correct answer)
if(count($matchedScoringEvents)>0){
    foreach($matchedScoringEvents as $m){
        // applying weights to the matched scoring events
        foreach($m as $thisMatchedScoringEvent){
            if($thisMatchedScoringEvent['activate']==$extraWeight && $thisMatchedScoringEvent['resultType']==0){
                $totalScore+=$extraWeightScore;
            }elseif($thisMatchedScoringEvent['activate']==$normalWeight && $thisMatchedScoringEvent['resultType']==0){
                $totalScore+=$normalWeightScore;
            }elseif ($thisMatchedScoringEvent['activate']==$lessWeight && $thisMatchedScoringEvent['resultType']==0){
                $totalScore+=$lessWeightScore;
            }
        }
    }
}
if($totalPossibleScore>0){
    $totalWeightedScore = ($totalScore/$totalPossibleScore)*100;
    $roundedScore = ceil($totalWeightedScore);
    foreach($componentEvents as $thisComponentEvent){
        // if it is a scored event - see if it meets the required score
        if($thisComponentEvent['activate']>=$summationActivityLow && $thisComponentEvent['activate']<=$summationActivityHigh){
            $requiredScoreForThisEvent=$summationLevels[$thisComponentEvent['activate']];
            $scoreMatch=FALSE;
            if($requiredScoreForThisEvent[1]==0){
                if($roundedScore>$requiredScoreForThisEvent[0]){
                    $scoreMatch=TRUE;
                }
            }else{
                if($roundedScore<$requiredScoreForThisEvent[0]){
                    $scoreMatch=TRUE;
                }
            }
            if($scoreMatch){
                if($matchedEvents[$thisComponentEvent['connectionId']]!=null){
                    array_push($matchedEvents[$thisComponentEvent['connectionId']], array('activate'=>$thisComponentEvent['activate'], 'resultType'=>$eventDataWasMatched, 'elementId'=>$thisComponentEvent['elementId'], 'eventType'=>$scoreTotalMatched, 'connectionId'=>$thisComponentEvent['connectionId']));
                }else{
                    $matchedEvents[$thisComponentEvent['connectionId']]=array();
                    array_push($matchedEvents[$thisComponentEvent['connectionId']], array('activate'=>$thisComponentEvent['activate'], 'resultType'=>$eventDataWasMatched, 'elementId'=>$thisComponentEvent['elementId'], 'eventType'=>$scoreTotalMatched, 'connectionId'=>$thisComponentEvent['connectionId']));
                }
            }
        }
    }
}

// matching the non-scored events - the cut and dried stuff - vetoIfTrue(1), vetoIfFalse (2), passIfTrue (3), passIfFalse(4)
foreach($componentEvents as $thisComponentEvent){
    if(array_search($thisComponentEvent['activate'], $navigationDirectives)){
        $thisEventElementId = $thisComponentEvent['elementId'];
        $learnerSubmittedEventsForThisElement = $submittedEvents[$thisEventElementId];
        if($learnerSubmittedEventsForThisElement!=null ){
            foreach($learnerSubmittedEventsForThisElement as $learnerSubmittedEvent){
                // if it is NOT a response event - fibAnswered (17) tfClicked (22) mcClicked (25)
                if(!in_array($thisComponentEvent['eventType'], $responseEvents)){
                    updateMatchedEvents($thisComponentEvent, $learnerSubmittedEvent, $matchedEvents, $connectionsAvailable);
                }
            }
        }
        // looking for events that have to happen or an error is sent back
        if(in_array($thisComponentEvent['eventType'], $responseEvents)){
            $responseFound=FALSE;
            // is there a learner submitted event that matches thisComponentEvent - something unclear here - possible trouble
            foreach($learnerSubmittedEventsForThisElement as $learnerSubmittedEvent){
                if(in_array($learnerSubmittedEvent['type'], $responseEvents) && $learnerSubmittedEvent['data']==$eventDataWasMatched){
                    $responseFound=TRUE;
                }
            }
            if(!$responseFound){
                // pushing onto matched events the event with a notMatched result type
                if($matchedEvents[$thisComponentEvent['connectionId']]!=null){
                    array_push($matchedEvents[$thisComponentEvent['connectionId']], array('activate'=>$thisComponentEvent['activate'], 'resultType'=>$eventDataNotMatched, 'elementId'=>$thisComponentEvent['elementId'], 'eventType'=>$thisComponentEvent['eventType'], 'componentId'=>$thisComponentEvent['componentId'],'connectionId'=>$thisComponentEvent['connectionId']));
                }else{
                    $matchedEvents[$thisComponentEvent['connectionId']]=array();
                    array_push($matchedEvents[$thisComponentEvent['connectionId']], array('activate'=>$thisComponentEvent['activate'], 'resultType'=>$eventDataNotMatched, 'elementId'=>$thisComponentEvent['elementId'], 'eventType'=>$thisComponentEvent['eventType'], 'componentId'=>$thisComponentEvent['componentId'],'connectionId'=>$thisComponentEvent['connectionId']));
                }
            }
        }
    }
}
$openConnections = array();
$vetoMessages = array();
$vetoEventsIdentified = array();
// now drawing up a list of open connections based on the matched events
foreach($matchedEvents as $eventsForThisConnection){
    foreach($eventsForThisConnection as $thisConnectionEvent){
        if(in_array($thisConnectionEvent['activate'], $passDirectives)){
            array_push($openConnections, $thisConnectionEvent['connectionId']);
        }
    }
}
// drawing up the veto messages
foreach($matchedEvents as $eventsForThisConnection){
    foreach($eventsForThisConnection as $thisConnectionEvent){
        if(in_array($thisConnectionEvent['activate'], $vetoDirectives)){
            if(!in_array( $thisConnectionEvent['eventType'],$vetoEventsIdentified)){
                array_push($vetoMessages, $vetoExplain[$thisConnectionEvent['eventType']]);
                array_push($vetoEventsIdentified,$thisConnectionEvent['eventType'] );
            }
        }
    }
}
// return a veto result if there were any veto messages
if(count($vetoEventsIdentified)>0){
    $returnData = array('returnType'=>"veto", 'data'=>$vetoMessages);
    $returnDataJson = json_encode($returnData);
    echo($returnDataJson);
}
$connectionsOpenToPass = array();
foreach($matchedEvents as $eventsForThisConnection){
    foreach($eventsForThisConnection as $thisConnectionEvent){
        // looking for a contradictory event that would close a connection
        if($thisConnectionEvent['resultType']!=$eventDataNotMatched){
            if(!in_array($thisConnectionEvent['connectionId'], $connectionsOpenToPass)){
                array_push($connectionsOpenToPass, $thisConnectionEvent['connectionId']);
            }
        }
    }
}
// hopefully we're left with one open connection and we will return it
if(count($connectionsOpenToPass)==1){
    $loadedComponents = array();
    $nextStartingComponentId = getNextStartingComponentFromConnectionId($connectionsOpenToPass[0], $link);
    loadContent($nextStartingComponentId,$link,$loadedComponents);
    $returnData = array('returnType'=>"1pathOpen", 'data'=>$loadedComponents);
    $returnDataJson = json_encode($returnData);

    $submissionBatchId = recordSuccessfulScreenTransfer($thisSessionId, $nextStartingComponentId, $thisContext, $submittingComponent);
    /*
    foreach($submission as $thisSubmittedEvent){
        recordThisUserEvent($thisSubmittedEvent, $thisSessionId, $submissionBatchId);
    }
    */
    echo($returnDataJson);
}


function getNextStartingComponentFromConnectionId($connectionId, $link){
    $query = "SELECT dgpath_connection.end_id as nextComponentId from dgpath_connection where dgpath_connection.id = ?";
    $connectionParams = array($connectionId);
    $queryResult = mysqli_prepared_query($link,$query,"s",$connectionParams);
    $returnComponentId = null;
    foreach($queryResult as $row){
        $returnComponentId = $row['nextComponentId'];
    }
    if($returnComponentId == null){
        header('HTTP/1.0 400 no component with connection id');
        exit;
    }else{
        return $returnComponentId;
    }
}

// this function checks to see if the submitted event actually represents a correct answer to something
function updateMatchedEvents($thisComponentEvent, $learnerSubmittedEvent, &$matchedEvents, &$connectionsAvailable){
    global $fibResponse, $tfAnswer, $correctAnswer, $eventDataWasMatched, $eventDataNotMatched, $eventHappenedNoData,$passIfTrue, $vetoIfFalse, $extraWeight, $normalWeight, $lessWeight;
    // the only types we should be testing are the ones looked for by the component - otherwise don't proceed
    // this could be screwing up mc's because a correct event doesn't get passed, just a selectX
    $eventMatched = matchThisEvent($thisComponentEvent, $learnerSubmittedEvent);
    // if there was no match and the event-looked-for's type differs from the event-submitted's type, we're done
    if(!$eventMatched && ($thisComponentEvent['eventType']!=$learnerSubmittedEvent['type'])){
        return;
    }
    if(in_array($thisComponentEvent['activate'], array($passIfTrue, $vetoIfFalse, $extraWeight, $normalWeight, $lessWeight))){
        if($eventMatched==TRUE){
            $matchValue = $eventDataWasMatched;
        }else{
            $matchValue = $eventDataNotMatched;
            return;
        }
    }else{
        if($eventMatched==FALSE){
            $matchValue = $eventDataWasMatched;
        }else{
            $matchValue = $eventDataNotMatched;
            return;
        }

    }
    $thisConnectionId=$thisComponentEvent['connectionId'];
    // any con nections associated with this event?
    if(!array_search($thisConnectionId, $connectionsAvailable)){
        array_push($connectionsAvailable, $thisComponentEvent['connectionId']);
    }
    // building a list of matched events by connectionId's
    if($matchedEvents[$thisComponentEvent['connectionId']]!=null){
        array_push($matchedEvents[$thisComponentEvent['connectionId']], array('activate'=>$thisComponentEvent['activate'], 'resultType'=>$matchValue, 'elementId'=>$thisComponentEvent['elementId'], 'eventType'=>$learnerSubmittedEvent['type'], 'componentId'=>$learnerSubmittedEvent['componentId'],'connectionId'=>$thisComponentEvent['connectionId']));
    }else{
        $matchedEvents[$thisComponentEvent['connectionId']]=array();
        array_push($matchedEvents[$thisComponentEvent['connectionId']], array('activate'=>$thisComponentEvent['activate'], 'resultType'=>$matchValue, 'elementId'=>$thisComponentEvent['elementId'], 'eventType'=>$learnerSubmittedEvent['type'], 'componentId'=>$learnerSubmittedEvent['componentId'],'connectionId'=>$thisComponentEvent['connectionId']));
    }
}

function matchThisEvent($thisComponentEvent, $learnerSubmittedEvent){
    global $documentViewed,$documentLinkClicked,$mcViewed,$mcCorrect,$mcAnswerX,$tfTrueSelected,$tfFalseSelected,$tfViewed,$tfCorrect,$tfClicked,$contextEntered,$contextExited,$entryDoorEntered,$exitDoorExited,$correctAnswer,$fibViewed,$correctFibAnswer,$fibAnswered,$fibResponse,$componentViewed,$tfAnswer,$scoreTotalMatched,$userLoggedIn,$componentsView,$mcClicked;
    $type = $thisComponentEvent['eventType'];
    $thisMatch = FALSE;
    switch($type){
        case $type ==$documentLinkClicked:
            break;
        case $type ==$mcCorrect:
            if($learnerSubmittedEvent['type']==$mcAnswerX && ($thisComponentEvent['subParam'] == $learnerSubmittedEvent['data'])){
                $thisMatch=TRUE;
            }
            break;
        case $type ==$mcAnswerX:
            if($learnerSubmittedEvent['type']==$mcAnswerX && ($thisComponentEvent['subParam'] == $learnerSubmittedEvent['data'])){
                $thisMatch=TRUE;
            }
            break;
        case $type ==$tfTrueSelected:
            if($learnerSubmittedEvent['data']=="true"){
                $thisMatch=TRUE;
            }
            break;
        case $type ==$tfFalseSelected:
            if($learnerSubmittedEvent['data']=="false"){
                $thisMatch=TRUE;
            }
            break;
        case $type ==$tfViewed:
            break;
        case $type ==$tfCorrect:
            if($thisComponentEvent['subParam'] == $learnerSubmittedEvent['data']){
                $thisMatch=TRUE;
            }
            break;
        case $type ==$tfClicked:
            if($learnerSubmittedEvent['data']=="0"){
                $thisMatch=TRUE;
            }
            break;
        case $type ==$contextEntered:
            break;
        case $type ==$contextExited:
            break;
        case $type ==$entryDoorEntered:
            break;
        case $type ==$exitDoorExited:
            break;
        case $type ==$correctAnswer:
            break;
        case $type ==$fibViewed:
            break;
        case $type ==$correctFibAnswer:
            if($thisComponentEvent['subParam'] == $learnerSubmittedEvent['data']){
                $thisMatch=TRUE;
            }
            break;
        case $type ==$fibAnswered:
            break;
        case $type ==$fibResponse:
            if($thisComponentEvent['subParam'] == $learnerSubmittedEvent['data']){
                $thisMatch=TRUE;
            }
            break;
        case $type ==$componentViewed:
            break;
        case $type ==$tfAnswer:
            if($thisComponentEvent['subParam'] == $learnerSubmittedEvent['data']){
                $thisMatch=TRUE;
            }
            break;
        case $type ==$scoreTotalMatched:
            break;
        case $type ==$userLoggedIn:
            break;
        case $type ==$componentsView:
            break;
        case $type ==$mcClicked:
            if($learnerSubmittedEvent['data']=="0"){
                $thisMatch=TRUE;
            }
            break;
        default:
            if($thisComponentEvent['eventType'] != $learnerSubmittedEvent['type']){
                $thisMatch=TRUE;
            }
    }

    return $thisMatch;
}