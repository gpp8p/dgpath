<?php
/**
 * Created by JetBrains PhpStorm.
 * User: georgepipkin
 * Date: 1/23/13
 * Time: 5:55 PM
 * To change this template use File | Settings | File Templates.
 */





function insertDocument($xpos, $ypos, $type, $content, $context, $title){

    global $documentViewed, $documentLinkClicked;

    $query = "INSERT INTO dgpath_component(type,x,y,context, title, content) values('$type', '$xpos', '$ypos','$context','$title', '$content')";
    $result = mysql_query($query);
    if (!$result) {
        die('Invalid query: ' . mysql_error());
    }
    $componentLastItemID = mysql_insert_id();

    $thisAnswerQuery = "SELECT dgpath_user_events.id from dgpath_events, dgpath_user_events where dgpath_user_events.event_id=dgpath_events.id and dgpath_events.component_id=$componentLastItemID and dgpath_events.event_type=$documentViewed";
    $query = "INSERT INTO dgpath_events(component_id, label, navigation, event_type, uevent_query) values ('$componentLastItemID', 'Document viewed by user', TRUE, $documentViewed, '$thisAnswerQuery')";
    $result = mysql_query($query);
    if (!$result) {
        die('Invalid query: ' . mysql_error());
    }
    $thisAnswerQuery = "SELECT dgpath_user_events.id from dgpath_events, dgpath_user_events where dgpath_user_events.event_id=dgpath_events.id and dgpath_events.component_id=$componentLastItemID and dgpath_events.event_type=$documentLinkClicked";
    $query = "INSERT INTO dgpath_events(component_id, label, navigation,  event_type, uevent_query) values ('$componentLastItemID', 'Link in document clicked by user', FALSE, $documentLinkClicked, '$thisAnswerQuery')";
    $result = mysql_query($query);
    if (!$result) {
        die('Invalid query: ' . mysql_error());
    }

}

function insertDoors($context, $canvasWidth, $canvasHeight, $projectTitle){
    global $contextEntered, $contextExited;

    $entryDoorXpos = 50;
    $entryDoorYpos = round($canvasHeight/2);
    $query = "INSERT INTO dgpath_component(type,x,y,context, title, content) values('entry_door', '$entryDoorXpos', '$entryDoorYpos','$context','Entrance', '')";
    $result = mysql_query($query);
    if (!$result) {
        die('Invalid query: ' . mysql_error());
    }
    $componentLastItemID = mysql_insert_id();
    $entryDoorJson = returnComponentAsJson($componentLastItemID);

    $thisDoorQuestion = "Context: ".$projectTitle." entered by user";
    $thisAnswerQuery = "SELECT dgpath_user_events.id from dgpath_events, dgpath_user_events where dgpath_user_events.event_id=dgpath_events.id and dgpath_events.component_id=$componentLastItemID and dgpath_events.event_type=$contextEntered";
    $query = "INSERT INTO dgpath_events(component_id, label, navigation, event_type, uevent_query) values ('$componentLastItemID','$thisDoorQuestion', TRUE, $contextEntered, '$thisAnswerQuery')";
    $result = mysql_query($query);
    if (!$result) {
        die('Invalid query: ' . mysql_error());
    }



    $exitDoorXpos = round($canvasWidth -50);
    $exitDoorYpos = round($canvasHeight/2);
    $query = "INSERT INTO dgpath_component(type,x,y,context, title, content) values('exit_door', '$exitDoorXpos', '$exitDoorYpos','$context','Exit', '')";
    $result = mysql_query($query);
    if (!$result) {
        die('Invalid query: ' . mysql_error());
    }
    $componentLastItemID = mysql_insert_id();
    $thisDoorQuestion = "Context: ".$projectTitle." exited by user";
    $thisAnswerQuery = "SELECT dgpath_user_events.id from dgpath_events, dgpath_user_events where dgpath_user_events.event_id=dgpath_events.id and dgpath_events.component_id=$componentLastItemID and dgpath_events.event_type=$contextExited";
    $query = "INSERT INTO dgpath_events(component_id, label, navigation, event_type, uevent_query) values ('$componentLastItemID','$thisDoorQuestion', TRUE, $contextExited, '$thisAnswerQuery')";
    $result = mysql_query($query);
    if (!$result) {
        die('Invalid query: ' . mysql_error());
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

function returnComponentAsJson($componentId){
    $query = "SELECT dgpath_component.title, dgpath_component.type, dgpath_component.x, dgpath_component.y, dgpath_component.context, dgpath_component.content from dgpath_component where id = '$componentId'";
    $componentQueryResult = mysql_query($query);
    if (!$componentQueryResult) {
        die('Invalid query: ' . mysql_error());
    }
    $dataFound = false;

    $allComponents = array();
    $currentComponentEvents = array();
    while($row=mysql_fetch_array($componentQueryResult)){
        $component_title = $row['title'];
        $componentXpos = $row['x'];
        $componentYpos = $row['y'];
        $componentType = $row['type'];
        $componentContext = $row['context'];
        $componentContent = $row['content'];
        $thisComponent = array('title'=>$component_title, 'id'=>$componentId, 'x'=>$componentXpos, 'y'=>$componentYpos, 'type'=>$componentType, 'context'=>$componentContext, 'content'=>$componentContent);
        $dataFound=true;
    }
    if($dataFound){
        header('Content-Type: application/json');
        $jsonComponent = json_encode($thisComponent);
        return $jsonComponent;
    }else{
        die("error - no component with this id");
    }
}

?>