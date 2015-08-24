<?php
/**
 * Created by JetBrains PhpStorm.
 * User: georgepipkin
 * Date: 1/23/13
 * Time: 5:55 PM
 * To change this template use File | Settings | File Templates.
 */





function insertDocument($xpos, $ypos, $type, $content, $context, $title){

    global $documentViewed, $documentViewedMsg, $documentLinkClicked, $TRUE, $FALSE, $documentLinkClickedMsg;



    $query = "INSERT INTO dgpath_component(type,x,y,context, title, content) values(?,?,?,?,?,?)";
    if ($stmt = mysqli_prepare($link, $query)) {
        mysqli_stmt_bind_param($stmt, "ssssss", $type, $xpos, $ypos, $context, $title, $content);
        mysqli_stmt_execute($stmt);
        if(mysqli_affected_rows($link)==0){
            header('HTTP/1.0 400 Nothing saved - component insert');
            exit;
        }else{
            $componentLastItemID = $stmt->insert_id;
            $thisAnswerQuery = "SELECT dgpath_user_events.id from dgpath_events, dgpath_user_events where dgpath_user_events.event_id=dgpath_events.id and dgpath_events.component_id=$componentLastItemID and dgpath_events.event_type=$documentViewed";
            $query = "INSERT INTO dgpath_events(component_id, label, navigation, event_type, uevent_query) values (?,?,?,?,?)";
            mysqli_stmt_bind_param($stmt2, "dsiss", $componentLastItemID, $documentViewedMsg, $TRUE, $documentViewed, $thisAnswerQuery);
            mysqli_stmt_execute($stmt2);
            if(mysqli_affected_rows($link)==0){
                header('HTTP/1.0 400 Nothing saved - event insert 1');
                exit;
            }else{
                $thisAnswerQuery = "SELECT dgpath_user_events.id from dgpath_events, dgpath_user_events where dgpath_user_events.event_id=dgpath_events.id and dgpath_events.component_id=$componentLastItemID and dgpath_events.event_type=$documentViewed";
                $query = "INSERT INTO dgpath_events(component_id, label, navigation, event_type, uevent_query) values (?,?,?,?,?)";
                mysqli_stmt_bind_param($stmt3, "dsiss", $componentLastItemID, $documentLinkClickedMsg, $TRUE, $documentLinkClicked, $thisAnswerQuery);
                mysqli_stmt_execute($stmt3);
                if(mysqli_affected_rows($link)==0){
                    header('HTTP/1.0 400 Nothing saved - event insert 2');
                    exit;
                }
            }
        }
    }
}

function insertDoors($context, $canvasWidth, $canvasHeight, $projectTitle, $link){
    global $contextEntered, $contextExited,$TRUE,$FALSE, $BLANK;

    $entryDoorJson = "";
    $entryDoorXpos = 60;
    $entryDoorYpos = round($canvasHeight/2);
    $elementId = uniqid();
    $query = "INSERT INTO dgpath_component(type, x, y, context, title, content, elementId) values (?,?,?,?,?,?,?)";
    if ($stmt = mysqli_prepare($link, $query)) {
        $entryDoor = "entry_door";
        $entryDoorTitle = "Entrance";
        mysqli_stmt_bind_param($stmt, "sssssss", $entryDoor, $entryDoorXpos, $entryDoorYpos, $context, $entryDoorTitle, $BLANK,$elementId);
        mysqli_stmt_execute($stmt);
        if(mysqli_affected_rows($link)==0){
            header('HTTP/1.0 400 Nothing saved - entry door insert');
            exit;
        }else{
            $componentLastItemID = $stmt->insert_id;
            $entryDoorJson = returnComponentAsJson($componentLastItemID, $link);
            $thisDoorQuestion = "Context: ".$projectTitle." entered by user";
            $thisAnswerQuery = "SELECT dgpath_user_events.id from dgpath_events, dgpath_user_events where dgpath_user_events.event_id=dgpath_events.id and dgpath_events.component_id=$componentLastItemID and dgpath_events.event_type=$contextEntered";
            $query = "INSERT INTO dgpath_events(component_id, label, navigation, event_type, uevent_query, elementId) values (?,?,?,?,?,?)";

            if ($stmt2 = mysqli_prepare($link, $query)) {
                mysqli_stmt_bind_param($stmt2, "dsidss", $componentLastItemID,$thisDoorQuestion, $TRUE, $contextEntered, $thisAnswerQuery,$elementId);
                mysqli_stmt_execute($stmt2);
                if(mysqli_affected_rows($link)==0){
                    header('HTTP/1.0 400 Nothing saved - entry door event insert');
                    exit;
                }else{
                    $exitDoorXpos = round($canvasWidth -100);
                    $exitDoorYpos = round($canvasHeight/2);
                    $exitDoorElementId = uniqid();
                    $query = "INSERT INTO dgpath_component(type,x,y,context, title, content, elementId) values(?,?,?,?,?,?,?)";
                    if ($stmt3 = mysqli_prepare($link, $query)) {
                        $exitDoor = "exit_door";
                        $exit = "exit";
                        mysqli_stmt_bind_param($stmt3, "sdddsss", $exitDoor, $exitDoorXpos, $exitDoorYpos, $context,$exit, $BLANK,$exitDoorElementId);
                        mysqli_stmt_execute($stmt3);
                        if(mysqli_affected_rows($link)==0){
                            header('HTTP/1.0 400 Nothing saved - exit door insert');
                            exit;
                        }else{
                            $componentLastItemID = $stmt3->insert_id;
                            $thisDoorQuestion = "Context: ".$projectTitle." exited by user";
                            $thisAnswerQuery = "SELECT dgpath_user_events.id from dgpath_events, dgpath_user_events where dgpath_user_events.event_id=dgpath_events.id and dgpath_events.component_id=$componentLastItemID and dgpath_events.event_type=$contextExited";
                            $query = "INSERT INTO dgpath_events(component_id, label, navigation, event_type, uevent_query,elementId) values (?,?,?,?,?,?)";
                            if ($stmt4 = mysqli_prepare($link, $query)) {
                                mysqli_stmt_bind_param($stmt4, "dsidss", $componentLastItemID,$thisDoorQuestion, $TRUE, $contextExited, $thisAnswerQuery,$exitDoorElementId);
                                mysqli_stmt_execute($stmt4);
                                if(mysqli_affected_rows($link)==0){
                                    header('HTTP/1.0 400 Nothing saved - exit door event insert');
                                    exit;
                                }
                            }else{
                                header('HTTP/1.0 400 Bad query - exit door event insert');
                                exit;
                            }
                        }
                    }else{
                        header('HTTP/1.0 400 Bad query - exit door insert');
                        exit;
                    }
                }
            }else{
                header('HTTP/1.0 400 Bad query - entry door event insert');
                exit;
            }
        }
    }else{
        header('HTTP/1.0 400 Bad query - entry door insert');
        exit;
    }
    return $entryDoorJson;
}



function insertMulti($xpos, $ypos, $type, $content, $context, $title){

    global $mcCorrect, $mcAnswerX, $mcViewed;

    $thisMcQuestion = json_decode($content, true);
    $content = str_replace('\\n', '', $content);
    $query = "INSERT INTO dgpath_component(type,x,y,context, title, content) values('$type', '$xpos', '$ypos','$context', '$title', '$content')";
    $result = mysql_query($query);
    if (!$result) {
        die('Invalid query: ' . mysql_error());
    }
    $componentLastItemID = mysql_insert_id();

    $thisMcQuestionQuestion = "Multiple-Choice Question ".$title." attempted by user.";
    $thisAnswerQuery = "SELECT dgpath_user_events.id from dgpath_events, dgpath_user_events where dgpath_user_events.event_id=dgpath_events.id and dgpath_events.component_id=$componentLastItemID and dgpath_events.event_type=$mcViewed";
    $query = "INSERT INTO dgpath_events(component_id, label, navigation, event_type, uevent_query) values ('$componentLastItemID','$thisMcQuestionQuestion', TRUE, $mcViewed, '$thisAnswerQuery')";
    $result = mysql_query($query);
    if (!$result) {
        die('Invalid query: ' . mysql_error());
    }

    $answers = $thisMcQuestion['answers'];
    $answerCorrect = null;
    $a=0;
    foreach($answers as $thisAnswer){
        $answerNumber = strval($a+1);
        $thisAnswerContent = "Multiple-Choice Answer #".$answerNumber." selected by user:";
        $thisAnswerId = $thisAnswer['answerId'];
        $thisAnswerQuery = "SELECT dgpath_user_events.id from dgpath_events, dgpath_user_events where dgpath_user_events.event_id=dgpath_events.id and dgpath_events.component_id=$componentLastItemID and dgpath_events.event_type=$mcAnswerX and dgpath_events.sub_param=$thisAnswerId";
        $query = "INSERT INTO dgpath_events(component_id, label, navigation, event_type, show_sub, sub_param, uevent_query) values ('$componentLastItemID', '$thisAnswerContent', TRUE, $mcAnswerX, FALSE, '$thisAnswerId', '$thisAnswerQuery')";
        $result = mysql_query($query);
        if (!$result) {
            die('Invalid query: ' . mysql_error());
        }

        $thisAnswerCorrect = $thisAnswer['correct'];
        if($thisAnswerCorrect=='true'){
            $answerCorrect = $thisAnswerId;
        }
        $a++;
    }
    $correctMsg = "Multiple-Choice Answer #".($answerCorrect)." correctly chosen by user";
    $thisAnswerQuery = "SELECT dgpath_user_events.id from dgpath_events, dgpath_user_events where dgpath_user_events.event_id=dgpath_events.id and dgpath_events.component_id=$componentLastItemID and dgpath_events.event_type=$mcCorrect";
    $query = "INSERT INTO dgpath_events(component_id, label, navigation,event_type, show_sub,  uevent_query) values ('$componentLastItemID', '$correctMsg', TRUE, $mcCorrect, FALSE, '$thisAnswerQuery')";
    $result = mysql_query($query);
    if (!$result) {
        die('Invalid query: ' . mysql_error());
    }



}

function insertTf($xpos, $ypos, $type, $content, $context, $title){

    global $tfViewed, $tfTrueSelected, $tfFalseSelected, $tfCorrect;

    $thisTfQuestion = json_decode($content, true);
    $answerCorrect = $thisTfQuestion['correctAnswer'];
    $content = str_replace('\\n', '', $content);
    $query = "INSERT INTO dgpath_component(type,x,y,context, title, content) values('$type', '$xpos', '$ypos','$context', '$title', '$content')";
    $result = mysql_query($query);
    if (!$result) {
        die('Invalid query: ' . mysql_error());
    }
    $componentLastItemID = mysql_insert_id();

    $thisTfQuestionQuestion = "True-False Question ".$title." attempted by user.";
    $thisAnswerQuery = "SELECT dgpath_user_events.id from dgpath_events, dgpath_user_events where dgpath_user_events.event_id=dgpath_events.id and dgpath_events.component_id=$thisComponentName and dgpath_events.event_type=$tfViewed";
    $query = "INSERT INTO dgpath_events(component_id, label, navigation, event_type, uevent_query) values ('$componentLastItemID','$thisTfQuestionQuestion', TRUE, $tfViewed, '$thisAnswerQuery')";
    $result = mysql_query($query);
    if (!$result) {
        die('Invalid query: ' . mysql_error());
    }
    $thisTfQuestionQuestion = "True-False Question ".$title." answered TRUE";
    $thisAnswerQuery = "SELECT dgpath_user_events.id from dgpath_events, dgpath_user_events where dgpath_user_events.event_id=dgpath_events.id and dgpath_events.component_id=$thisComponentName and dgpath_events.event_type=$tfTrueSelected";
    $query = "INSERT INTO dgpath_events(component_id, label, navigation, event_type, show_sub, uevent_query) values ('$componentLastItemID', '$thisTfQuestionQuestion', TRUE, $tfTrueSelected, FALSE, '$thisAnswerQuery')";
    $result = mysql_query($query);
    if (!$result) {
        die('Invalid query: ' . mysql_error());
    }
    $thisTfQuestionQuestion = "True-False Question ".$title." answered FALSE";
    $thisAnswerQuery = "SELECT dgpath_user_events.id from dgpath_events, dgpath_user_events where dgpath_user_events.event_id=dgpath_events.id and dgpath_events.component_id=$thisComponentName and dgpath_events.event_type=$tfFalseSelected";
    $query = "INSERT INTO dgpath_events(component_id, label, navigation, event_type, show_sub, uevent_query) values ('$componentLastItemID', '$thisTfQuestionQuestion', TRUE, $tfFalseSelected, FALSE, '$thisAnswerQuery')";
    $result = mysql_query($query);
    if (!$result) {
        die('Invalid query: ' . mysql_error());
    }
    $thisTfQuestionQuestion = "True-False Question ".$title." answered correctly";
    $thisAnswerQuery = "SELECT dgpath_user_events.id from dgpath_events, dgpath_user_events where dgpath_user_events.event_id=dgpath_events.id and dgpath_events.component_id=$thisComponentName and dgpath_events.event_type=$tfCorrect";
    $query = "INSERT INTO dgpath_events(component_id, label, navigation, event_type, show_sub, uevent_query) values ('$componentLastItemID', '$thisTfQuestionQuestion', TRUE, $tfCorrect, FALSE, '$thisAnswerQuery')";
    $result = mysql_query($query);
    if (!$result) {
        die('Invalid query: ' . mysql_error());
    }
}

function returnComponentAsJson($componentId, $link){
    $dataFound = false;
    $query = "SELECT dgpath_component.title, dgpath_component.type, dgpath_component.x, dgpath_component.y, dgpath_component.context, dgpath_component.content from dgpath_component where id = ?";
    if ($stmt = mysqli_prepare($link, $query)) {
        mysqli_stmt_bind_param($stmt, "s", $componentId);
        mysqli_stmt_execute($stmt);
        if(mysqli_affected_rows($link)==0){
            header('HTTP/1.0 400 no component found returnComponentAsJson');
            exit;
        }else{
            mysqli_stmt_bind_result($stmt, $component_title, $componentXpos, $componentYpos, $componentType, $componentContext,$componentContent );
            while (mysqli_stmt_fetch($stmt)) {
                $thisComponent = array('title'=>$component_title, 'id'=>$componentId, 'x'=>$componentXpos, 'y'=>$componentYpos, 'type'=>$componentType, 'context'=>$componentContext, 'content'=>$componentContent);
                $dataFound=true;
            }
            if($dataFound){
                header('Content-Type: application/json');
                $jsonComponent = json_encode($thisComponent);
                return $jsonComponent;
            }else{
                header('HTTP/1.0 400 no component found returnComnponentAsJson');
                exit;

            }
        }
    }else{
        header('HTTP/1.0 400 bad query returnComnponentAsJson');
        exit;
    }


}

?>