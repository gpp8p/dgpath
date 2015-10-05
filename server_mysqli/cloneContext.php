<?php
/**
 * Created by PhpStorm.
 * User: georgepipkin
 * Date: 10/28/14
 * Time: 10:46 PM
 */

require_once '../server_mysqli/constants.php';
require_once '../server_mysqli/jsonED.php';
require_once '../server_mysqli/dbparams.php';
require_once '../server_mysqli/preparedQuery.php';
require_once '../server_mysqli/loadContent.php';
require_once '../server_mysqli/evtypes.php';





$componentQuery = "SELECT dgpath_component.id as id, dgpath_component.type as type, dgpath_component.x as x, dgpath_component.y as y, dgpath_component.content as content, dgpath_component.context as context,  dgpath_component.subcontext as subcontext, dgpath_component.title as title, dgpath_component.elementId as elementId from dgpath_component ";
$componentQuery = $componentQuery."where dgpath_component.context = ?";

$componentQueryMin = "SELECT dgpath_component.id as id, dgpath_component.type as type,  dgpath_component.subcontext as subcontext, dgpath_component.title as title, dgpath_component.context as context from dgpath_component ";
$componentQueryMin = $componentQueryMin."where dgpath_component.context = ?";


$connectionQuery = "SELECT dgpath_connection.id as connectionId, dgpath_connection.start_id as start_id, dgpath_connection.end_id as end_id, dgpath_connection.go_ahead as go_ahead from dgpath_connection, dgpath_component ";
$connectionQuery = $connectionQuery."where dgpath_connection.start_id = dgpath_component.id ";
$connectionQuery = $connectionQuery."and dgpath_component.context = ?";

$ruleQuery = "SELECT dgpath_rules.id as id, dgpath_rules.event_id as event_id, dgpath_rules.connection_id as connection_id, dgpath_rules.detail_re as detail_re, dgpath_rules.activate as activate from dgpath_rules where connection_id = ?";

$eventQuery = "SELECT dgpath_events.id as id, dgpath_events.component_id as component_id, dgpath_events.label as label, dgpath_events.navigation as navigation, dgpath_events.event_type as event_type, dgpath_events.show_sub as show_sub, dgpath_events.sub_param as sub_param, dgpath_events.elementId as elementId ";
$eventQuery = $eventQuery."from dgpath_events where component_id = ?";

$insertComponentQuery = "INSERT INTO dgpath_component(type,x,y,context, title, content, subcontext, elementId) values(?,?,?,?,?,?,?,?)";

$eventFromElementIdQuery = "select event_type, label, sub_param, id from dgpath_events where elementId= ?";

$eventFromComponentIdQuery = "select id, label, navigation, event_type, show_sub, sub_param, elementId from dgpath_events where component_id= ?";

$insertContextQuery = "INSERT INTO dgpath_context(title, project, parent, topcontext) values (?.?,?,?)";

$updateContextComponentSubContextQuery = "UPDATE dgpath_component set subcontext = ?";

$insertEventQuery = "INSERT INTO dgpath_events (component_id, label, navigation, event_type, show_sub, sub_param, elementId) values(?,?,?,?,?,?,?)";


$traversalResults = array();
$ctx = $_POST['subcontext'];
$target = $_POST['target'];
$newContextTitle = $_POST['newContextName'];
$folderHierarchy = explode("_", $target);
$projectPiece = $folderHierarchy[0];
$projectId = substr($projectPiece,2);
$folderHierarchySize = sizeof($folderHierarchy);
$thisFolderReference = $folderHierarchy[$folderHierarchySize-1];
$targetFolderContextPos = strrpos($thisFolderReference, "-");
$targetFolderParent = substr($thisFolderReference, 2, $targetFolderContextPos-2);
$targetContext = substr($thisFolderReference, $targetFolderContextPos+1);



//$ctx = 155;
//$globalResult = traverseContextTitles($componentQueryMin, $link,48);

$logIt = true;
if($logIt){
    $myfile = fopen("/var/tmp/cloneContextLog.txt", "w");
}


$componentCrossReference = array();
$eventCrossReference = array();
$mock_Id = 679;

$topContextComponentId = insertComponent("subcontext", 0, 0, $targetContext, $newContextTitle, "{}", 0, newGuid(), 0,$link);
$newTopContext = insertContext($projectId, $topContextComponentId, $newContextTitle, 0, $link);
updateContextComponentSubContext($topContextComponentId, $newTopContext, $link);


$globalResult = traverseContext($componentQuery, $connectionQuery, $link, $traversalResults, $newTopContext, $targetFolderParent, $targetContext, $projectId, $newContextTitle);

$returnDataJson = json_encode($globalResult);
if($logIt){
    fclose($myfile);
}

echo($returnDataJson);




function traverseContext($componentQuery, $connectionQuery, $link, &$results, $contextId, $targetFolderId, $targetCtxId, $targetProjId, $newCtxTitle){
    global $eventQuery, $myfile, $logIt, $mock_Id;
    $connectionForComponentQuery = "SELECT dgpath_connection.id as connectionId, dgpath_connection.start_id as start_id, dgpath_connection.end_id as end_id, dgpath_connection.go_ahead as go_ahead from dgpath_connection ";
    $connectionForComponentQuery = $connectionForComponentQuery."where dgpath_connection.start_id = ?";

    $sourceContextId = $contextId;
    $targetContextId = $targetCtxId;
    $targetProjectId = $targetProjId;



    $componentParams = array($sourceContextId);
    $thisContextComponents = array();
    $componentQueryResult = mysqli_prepared_query($link,$componentQuery,"s",$componentParams);
    $txt = "running query:".$componentQuery." with params - ".$componentParams."\n";
    logIt($txt, $logIt);
    foreach($componentQueryResult as $row){
        if($row['type']!='subcontext'){
            $newComponentId = insertComponent($row['type'], $row['x'], $row['y'], $row['context'], $row['title'], $row['content'], $row['subcontext'], $row['emementId'], $row['id'],$link);
            $thisComponentEvents = getComponentEvents($row[id], $eventQuery, $link);
            $thisComponentConnections = getComponentConnections($row[id], $connectionForComponentQuery, $link);
            array_push($thisContextComponents, $row);
        }else{
            $txt = "entering subcontext:".$row['title']."\n";
            logIt($txt, $logIt);
            $topContextComponentId = insertComponent("subcontext", 0, 0, $targetContextId, $row['title'], "{}", 0, newGuid(), 0,$link);
            $newTopContext = insertContext($targetProjectId, $topContextComponentId, $row['title'], 0, $link);
            updateContextComponentSubContext($topContextComponentId, $newTopContext, $link);

            $thisResult = traverseContext($componentQuery, $connectionForComponentQuery, $link, $results, $newTopContext, null, null, null, $row['title']);
            $row['subContextElements']= $thisResult;
            array_push($thisContextComponents, $row);
        }
    }
//    $connectionQueryResult = mysqli_prepared_query($link,$connectionQuery,"s",$componentParams);
    $contextResults = array($thisContextComponents);
    array_push($results, $contextResults);
    return $thisContextComponents;
}

function insertContext($projectId, $parentId, $title, $topContext, $link){
    global $mock_Id,$logIt,  $insertContextQuery;

    if ($stmt = mysqli_prepare($link, $insertContextQuery)) {
        mysqli_stmt_bind_param($stmt, "sssi", $title, $parentId, $projectId, $topContext);
        /*        mysqli_stmt_execute($stmt);
                if(mysqli_affected_rows($link)==0){
                    header('HTTP/1.0 400 Nothing saved - context insert');
                    exit;
                }else {
                    $insertedId = $stmt->insert_id;
                }
        */
        $insertedId = $mock_Id;
        $txt = "Insert context:".$insertedId."-".$insertContextQuery."{".$title.",".$parentId.",".$projectId.",".$topContext."}\n";
        logIt($txt, $logIt);
        $mock_Id++;
        return $insertedId;
    }

}

function updateContextComponentSubContext($contextComponentId, $newSubContextId, $link){
    global $mock_Id, $logIt, $updateContextComponentSubContextQuery;

    if ($stmt = mysqli_prepare($link, $updateContextComponentSubContextQuery)) {
        mysqli_stmt_bind_param($stmt, "s", $newSubContextId);
        /*        mysqli_stmt_execute($stmt);
                if(mysqli_affected_rows($link)==0){
                    header('HTTP/1.0 400 Nothing saved - context component update');
                    exit;
                }
        */
        $txt = "Updated context component:" . $updateContextComponentSubContextQuery . "{" . $newSubContextId . "}";
        logIt($txt, $logIt);
    }
}

function insertComponent($existingComponentType, $existingComponentXpos, $existingComponentYpos, $existingComponentContext, $existingComponentTitle, $existingComponentContent, $existingComponentSubcontext, $existingComponentElementId, $existingComponentId,  $link){
    global $componentCrossReference, $eventCrossReference, $mock_Id, $insertComponentQuery, $logIt, $connectionQuery, $connectionForComponentQuery;

    $type = $existingComponentType;
    $xpos = $existingComponentXpos;
    $ypos = $existingComponentYpos;
    $context = $existingComponentContext;
    $title = $existingComponentTitle;
    $content = $existingComponentContent;
    $subcontext = $existingComponentSubcontext;
    $elementId = $existingComponentElementId;
    $id = $existingComponentId;
    $newContent="";
//    $txt=" new component id:".$title."\n";
//    logIt($txt, $logIt);
    $newComponentId = 0;
    $stmt = null;

    switch ($type) {
        case "fib":
            $elementId = newGuid();
            $packedNewFib = transformFib($content);
            $newContent = $packedNewFib[0];
            if ($stmt = mysqli_prepare($link, $insertComponentQuery)) {
                mysqli_stmt_bind_param($stmt, "ssssssss", $type, $xpos, $ypos, $context, $title, $content, $subcontext, $elementId);
                /*        mysqli_stmt_execute($stmt);
                        if(mysqli_affected_rows($link)==0){
                            header('HTTP/1.0 400 Nothing saved - component insert');
                            exit;
                        }else {
                            $componentLastItemID = $stmt->insert_id;
                        }
                */
                $componentCrossReference[strval($id)] = $mock_Id;
                $componentLastItemID = $mock_Id;
                $txt = "Insert component id:".$mock_Id."-".$insertComponentQuery."{".$type.",".$xpos.",".$ypos.",".$context.",".$title.",".$content.",".$subcontext.",".$elementId."}\n";
                logIt($txt, $logIt);
                $mock_Id++;

            }
            $newEventElementIds = $packedNewFib[1];
            foreach($newEventElementIds as $thisNewEvent){
                $thisNewEventElementId = $thisNewEvent[0];
                $thisNewEventType = $thisNewEvent[1];
                $thisNewEventLabel = $thisNewEvent[2];
                $thisNewEventSubParam = $thisNewEvent[3];
                $thisOldEventId = $thisNewEvent[4];
                $thisNewNav = 0;
                $thisNewShowSub=0;
                $eventCrossReference[strval($thisOldEventId)] = insertNewEvent($componentCrossReference[strval($id)], $thisNewEventLabel, $thisNewNav, $thisNewEventType, $thisNewShowSub, $thisNewEventSubParam, $thisNewEventElementId, $link);
            }
            break;
        case "subcontext":
            $elementId = newGuid();
            mysqli_stmt_bind_param($stmt, "ssssssss", $type, $xpos, $ypos, $context, $title, $content, $subcontext, $elementId);
            /*        mysqli_stmt_execute($stmt);
                    if(mysqli_affected_rows($link)==0){
                        header('HTTP/1.0 400 Nothing saved - component insert');
                        exit;
                    }else {
                        $componentLastItemID = $stmt->insert_id;
                    }
            */
            $componentCrossReference[strval($id)] = $mock_Id;
            $componentLastItemID = $mock_Id;
            $txt="Insert component id:".$mock_Id."-".$insertComponentQuery."{".$type.",".$xpos.",".$ypos.",".$context.",".$title.",".$content.",".$subcontext.",".$elementId."}\n";
            logIt($txt, $logIt);
            $mock_Id++;
            $subContextEvents = getEventsFromComponentId($id, $link);
            foreach($subContextEvents as $thisSubContextEvent){
                $thisOldEventId = $thisSubContextEvent['id'];
                $eventCrossReference[strval($thisOldEventId)] = insertNewEvent($componentCrossReference[strval($id)], $thisSubContextEvent['label'], $thisSubContextEvent['navigation'], $thisSubContextEvent['event_type'], $thisSubContextEvent['show_sub'], $thisSubContextEvent['sub_param'], $elementId, $link);
            }
            break;
        case "folder":
            break;
        case "truefalse":
        case "branch":
        case "exit_door":
        case "entry_door":
        case "doc":


            $elementId = newGuid();
            mysqli_stmt_bind_param($stmt, "ssssssss", $type, $xpos, $ypos, $context, $title, $content, $subcontext, $elementId);
            /*        mysqli_stmt_execute($stmt);
                    if(mysqli_affected_rows($link)==0){
                        header('HTTP/1.0 400 Nothing saved - component insert');
                        exit;
                    }else {
                        $componentLastItemID = $stmt->insert_id;
                    }
            */
            $componentCrossReference[strval($id)] = $mock_Id;
            $componentLastItemID = $mock_Id;
            $txt="Insert component id:".$mock_Id."-".$insertComponentQuery."{".$type.",".$xpos.",".$ypos.",".$context.",".$title.",".$content.",".$subcontext.",".$elementId."}\n";
            logIt($txt, $logIt);
            $mock_Id++;
            $mock_Id++;
            $docEvents = getEventsFromComponentId($id, $link);
            foreach($docEvents as $thisDocEvent){
                $thisOldEventId = $thisDocEvent['id'];
                $eventCrossReference[strval($thisOldEventId)] = insertNewEvent($componentCrossReference[strval($id)], $thisDocEvent['label'], $thisDocEvent['navigation'], $thisDocEvent['event_type'], $thisDocEvent['show_sub'], $thisDocEvent['sub_param'], $elementId, $link);
            }
            break;
        case "multichoice":
            $elementId = newGuid();
            $decodedContent = json_decode($content);
            $multichoiceQuestion = $decodedContent[0];
            $multiChoiceOptions = $decodedContent[1];
            $multichoiceElementIdTransform = array();
            $mcOptionResults=array();
            foreach ($multiChoiceOptions as $thisMultiChoiceOption) {
                $newElId = newGuid();
                $newMcOption = array($thisMultiChoiceOption[0], $thisMultiChoiceOption[2],$newElId);
                $multichoiceElementIdTransform[$thisMultiChoiceOption[2]]=newGuid();
                array_unshift($mcOptionResults,$newMcOption);
            }
            $newMcContentUnpacked = array($multichoiceQuestion,$mcOptionResults);
            $newMcContent = json_encode($newMcContentUnpacked);

            mysqli_stmt_bind_param($stmt, "ssssssss", $type, $xpos, $ypos, $context, $title, $content, $subcontext, $elementId);
            /*        mysqli_stmt_execute($stmt);
                    if(mysqli_affected_rows($link)==0){
                        header('HTTP/1.0 400 Nothing saved - component insert');
                        exit;
                    }else {
                        $componentLastItemID = $stmt->insert_id;
                    }
            */
            $componentCrossReference[strval($id)] = $mock_Id;
            $componentLastItemID = $mock_Id;
            $txt="Insert component id:".$mock_Id."-".$insertComponentQuery."{".$type.",".$xpos.",".$ypos.",".$context.",".$title.",".$newMcContent.",".$subcontext.",".$elementId."}\n";
            logIt($txt, $logIt);
            $mock_Id++;
            $mock_Id++;
            $docEvents = getEventsFromComponentId($id, $link);
            foreach($docEvents as $thisDocEvent){
                $thisOldEventId = $thisDocEvent['id'];
                $eventCrossReference[strval($thisOldEventId)] = insertNewEvent($componentCrossReference[strval($id)], $thisDocEvent['label'], $thisDocEvent['navigation'], $thisDocEvent['event_type'], $thisDocEvent['show_sub'], $thisDocEvent['sub_param'], $multichoiceElementIdTransform[$thisMultiChoiceOption[2]], $link);
            }
            break;



    }
    return $componentLastItemID;

}

function getConnections($componentId, $link){
    global $connectionQuery;

    $connectionParams = array($componentId);
    $connectionsForThisComponent = array();
    $connectionsForThisComponent = mysqli_prepared_query($link,$connectionQuery,"s",$connectionParams);
    foreach($connectionsForThisComponent as $thisConnection){
        $connectionEnd = $thisConnection['end_id'];
        $connectionStart = $componentId;
        $connectionGoAhead = $thisConnection['go_ahead'];
        $connectionId = $thisConnection['id'];
        $thisConnectionResult = array($connectionId, $connectionStart, $connectionEnd, $connectionGoAhead);
        array_push($connectionsForThisComponent, $thisConnectionResult);
    }
    return $connectionsForThisComponent;

}

function transformFib($fibContent){
    global $eventFromElementIdQuery, $link;
    $explodedFibArray = explode("{", $fibContent);
    $eventsToAdd = array();
    $newFibString = "";
    foreach($explodedFibArray as $thisExplodedFib){
        $closingBracePosition = strpos($thisExplodedFib,"}");
        if($closingBracePosition==false){
            $newFibString=$newFibString.$thisExplodedFib;
            continue;
        }
        $oldElementId = substr($thisExplodedFib,0,$closingBracePosition);
        $newElementId = newGuid();
        $componentParams = array($oldElementId);
        $eventQueryResult = mysqli_prepared_query($link,$eventFromElementIdQuery,"s",$componentParams);
        foreach($eventQueryResult as $thisEventQueryResult){
            $newEvent = array();
            array_push($newEvent, $newElementId);
            array_push($newEvent, $thisEventQueryResult['event_type']);
            array_push($newEvent, $thisEventQueryResult['label']);
            array_push($newEvent, $thisEventQueryResult['sub_param']);
            array_push($newEvent, $thisEventQueryResult['id']);
            array_push($eventsToAdd, $newEvent);
        }
        $newFib = "{".$newElementId."}".substr($thisExplodedFib,$closingBracePosition+1);
        $newFibString=$newFibString.$newFib;
    }
    $transformFibPackage = array();
    array_push($transformFibPackage,$newFibString);
    array_push($transformFibPackage, $eventsToAdd);
    return $transformFibPackage;
}

function transformMultiChoice($multiChoiceContent){

}

function getEventsFromComponentId($componentId, $link){
    global $eventFromComponentIdQuery;
    $componentParams = array($componentId);
    $eventQueryResult = mysqli_prepared_query($link,$eventFromComponentIdQuery,"s",$componentParams);
    return $eventQueryResult;

}

function insertNewEvent($componentId, $label, $navigation, $eventType, $showSub, $subParam, $elementId, $link){
    global $mock_Id,$insertEventQuery, $logIt;

    if ($stmt = mysqli_prepare($link, $insertEventQuery)) {
        mysqli_stmt_bind_param($stmt, "ssisiss", $componentId, $label, $navigation, $eventType, $showSub, $subParam, $elementId);
        /*        mysqli_stmt_execute($stmt);
                if(mysqli_affected_rows($link)==0){
                    header('HTTP/1.0 400 Nothing saved - component insert');
                    exit;
                }else {
                    $insertedEventId = $stmt->insert_id;
                }
        */
        $insertedEventId = $mock_Id;
        $mock_Id++;
        return $insertedEventId;
    }

}

function traverseContextTitles($componentQuery,  $link, $contextId){

    $componentParams = array($contextId);
    $thisContextComponents = array();
    $componentQueryResult = mysqli_prepared_query($link,$componentQuery,"s",$componentParams);
    foreach($componentQueryResult as $row){
        if($row['type']!='subcontext'){
            array_push($thisContextComponents, $row);
        }else{
            $thisResult = traverseContextTitles($componentQuery,  $link,  $row['subcontext']);
            $row['subContextElements']= $thisResult;
            array_push($thisContextComponents, $row);
        }
    }
    return $thisContextComponents;
}

function getComponentConnections($componentId, $connectionQuery, $link){
    global $ruleQuery;

    $connectionResult = array();
    $connectionParams = array($componentId);
    $connectionQueryResult = mysqli_prepared_query($link,$connectionQuery,"s",$connectionParams);
    foreach($connectionQueryResult as $row){
        $row['connectionRules']=getConnectionRules($row['connectionId'], $ruleQuery, $link);
        array_push($connectionResult, $row);
    }
    return $connectionResult;
}

function getConnectionRules($connectionId, $ruleQuery, $link){
    $ruleParams = array($connectionId);
    return mysqli_prepared_query($link,$ruleQuery,"s",$ruleParams);
}

function getComponentEvents($componentId, $eventQuery, $link){
    $eventParams = array($componentId);
    return mysqli_prepared_query($link,$eventQuery,"s",$eventParams);
}

function logIt($txt, $logOn){
    global $myfile;
    fwrite($myfile, $txt);
}

function newGuid() {
    $s = strtoupper(md5(uniqid(rand(),true)));
    $guidText =
        substr($s,0,8) . '-' .
        substr($s,8,4) . '-' .
        substr($s,12,4). '-' .
        substr($s,16,4). '-' .
        substr($s,20);
    return $guidText;
}
