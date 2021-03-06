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

$insertContextQuery = "INSERT INTO dgpath_context(title, project, parent, topcontext) values (?,?,?,?)";

$updateContextComponentSubContextQuery = "UPDATE dgpath_component set subcontext = ? where id = ?";

$insertEventQuery = "INSERT INTO dgpath_events (component_id, label, navigation, event_type, show_sub, sub_param, elementId) values(?,?,?,?,?,?,?)";
$insertConnectionQuery = "INSERT INTO dgpath_connection (start_id, end_id, go_ahead) values (?,?,?)";
$insertRuleQuery = "INSERT INTO dgpath_rules (event_id, connection_id, detail_re, activate) values (?,?,?,?)";

$contextLookupQuery = "SELECT project from dgpath_context where id = ?";



$traversalResults = array();

$targetContextId = $_POST['copyTarget'];

$componentParams = array($targetContextId);
$contextFound=FALSE;
$contextQueryResult = mysqli_prepared_query($link,$contextLookupQuery,"s",$componentParams);
foreach($contextQueryResult as $thisContextQueryResult){
    $contextFound=TRUE;
    $targetProject=$thisContextQueryResult['project'];
}
if(!$contextFound){
    header('HTTP/1.0 400 context not found');
    exit;
}

$targetComponentX = $_POST['componentX'];
$targetComponentY = $_POST['componentY'];




/*
$ctx = $_POST['subcontext'];
$target = $_POST['target'];
$description = $_POST['description'];
$newContextTitle = $_POST['newContextName'];
$folderHierarchy = explode("_", $target);
$projectPiece = $folderHierarchy[0];
$projectId = substr($projectPiece,2);
$folderHierarchySize = sizeof($folderHierarchy);
$thisFolderReference = $folderHierarchy[$folderHierarchySize-1];
$targetFolderContextPos = strrpos($thisFolderReference, "-");
$targetFolderParent = substr($thisFolderReference, 2, $targetFolderContextPos-2);
$targetContext = substr($thisFolderReference, $targetFolderContextPos+1);
*/

$copyTarget = $_POST['copyTarget'];
$copySource = $_POST['copySource'];
$componentX = $_POST['componentX'];
$componentY = $_POST['componentY'];
$description = $_POST['description'];
$projectId = $_POST['thisProject'];
$contextLabel=$_POST['thisContextLabel'];



//$ctx = 155;
//$globalResult = traverseContextTitles($componentQueryMin, $link,48);

$logIt = true;
if($logIt){
    $myfile = fopen("/var/tmp/cloneContextLog.txt", "w");
}


$componentCrossReference = array();
$eventCrossReference = array();
$allComponentConnections = array();
$mock_Id = 679;
if($description !=NULL){
    $thisDescription = "{"."\"description\":\"".$description."\"}";
}else{
    $thisDescription="{}";
}

$topContextComponentId = insertComponent("subcontext", $componentX, $componentY, $copyTarget, $contextLabel, $thisDescription, 0, newGuid(), 0,$link);
$newTopContext = insertContext($targetProject, $topContextComponentId, $contextLabel, 0, $link);
updateContextComponentSubContext($topContextComponentId, $newTopContext, $link);
$newTcLabel = $newContextTitle." entered by user";
$newTcNav = 1;
insertNewEvent($topContextComponentId, $newTcLabel, $newTcNav, $contextEntered, 0, "", $elementId, $link);


$globalResult = traverseContext($componentQuery, $connectionQuery, $link, $traversalResults, $copySource, $topContextComponentId, $newTopContext, $projectId, $newContextTitle);
insertConnectionsAndRules($allComponentConnections, $componentCrossReference, $eventCrossReference, $link);


$returnDataJson = json_encode($globalResult);
if($logIt){
    fclose($myfile);
}

echo($returnDataJson);




function traverseContext($componentQuery, $connectionQuery, $link, &$results, $contextId, $targetFolderId, $targetCtxId, $targetProjId, $newCtxTitle){
    global $eventQuery, $myfile, $logIt, $mock_Id, $allComponentConnections;
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
            $newComponentId = insertComponent($row['type'], $row['x'], $row['y'], $targetContextId, $row['title'], $row['content'], NULL, newGuid(), $row['id'],$link);
            $thisComponentEvents = getComponentEvents($row[id], $eventQuery, $link);
            $thisComponentConnections = getComponentConnections($row[id], $connectionForComponentQuery, $link);
            if(count($thisComponentConnections)>0) {
                array_push($allComponentConnections, $thisComponentConnections);
            }
            array_push($thisContextComponents, $row);
        }else{
            $txt = "entering subcontext:".$row['title']."\n";
            logIt($txt, $logIt);
            $thisComponentConnections = getComponentConnections($row[id], $connectionForComponentQuery, $link);
            if(count($thisComponentConnections)>0) {
                array_push($allComponentConnections, $thisComponentConnections);
            }
            $topContextComponentId = insertComponent("subcontext", $row['x'], $row['y'] , $targetContextId, $row['title'], "{}", 0, newGuid(), $row['id'],$link);
            $newTopContext = insertContext($targetProjectId, $topContextComponentId, $row['title'], 0, $link);
            updateContextComponentSubContext($topContextComponentId, $newTopContext, $link);

            $thisResult = traverseContext($componentQuery, $connectionForComponentQuery, $link, $results, $row['subcontext'], $topContextComponentId, $newTopContext, $targetProjectId, $row['title']);
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
        mysqli_stmt_bind_param($stmt, "sssi", $title,  $projectId, $parentId,$topContext);
                mysqli_stmt_execute($stmt);
                if(mysqli_affected_rows($link)==0){
                    header('HTTP/1.0 400 Nothing saved - context insert');
                    exit;
                }else {
                    $insertedId = $stmt->insert_id;
                }

 //       $insertedId = $mock_Id;
        $txt = "Insert context:".$insertedId."-".$insertContextQuery."{".$title.",".$parentId.",".$projectId.",".$topContext."}\n";
        logIt($txt, $logIt);
//        $mock_Id++;
        return $insertedId;
    }

}

function updateContextComponentSubContext($contextComponentId, $newSubContextId, $link){
    global $mock_Id, $logIt, $updateContextComponentSubContextQuery;

    if ($stmt = mysqli_prepare($link, $updateContextComponentSubContextQuery)) {
        mysqli_stmt_bind_param($stmt, "ss", $newSubContextId,$contextComponentId);
                mysqli_stmt_execute($stmt);
                if(mysqli_affected_rows($link)==0){
                    header('HTTP/1.0 400 Nothing saved - context component update');
                    exit;
                }

        $txt = "Updated context component:" . $updateContextComponentSubContextQuery . "{" . $newSubContextId . "}\n";
        logIt($txt, $logIt);
    }
}

function insertComponent($existingComponentType, $existingComponentXpos, $existingComponentYpos, $existingComponentContext, $existingComponentTitle, $existingComponentContent, $targetComponentSubcontext, $newComponentElementId, $existingComponentId,  $link){
    global $componentCrossReference, $eventCrossReference, $mock_Id, $insertComponentQuery, $logIt, $connectionQuery, $connectionForComponentQuery;

    $type = $existingComponentType;
    $xpos = $existingComponentXpos;
    $ypos = $existingComponentYpos;
    $context = $existingComponentContext;
    $title = $existingComponentTitle;
    $content = $existingComponentContent;
    $subcontext = $targetComponentSubcontext;
    $elementId = $newComponentElementId;
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
                        mysqli_stmt_execute($stmt);
                        if(mysqli_affected_rows($link)==0){
                            header('HTTP/1.0 400 Nothing saved - component insert');
                            exit;
                        }else {
                            $componentLastItemID = $stmt->insert_id;
                        }

                $componentCrossReference[strval($id)] = $componentLastItemID;
//                $componentLastItemID = $mock_Id;
                $txt = "Insert component id:".$componentLastItemID."-".$insertComponentQuery."{".$type.",".$xpos.",".$ypos.",".$context.",".$title.",".$newContent.",".$subcontext.",".$elementId."}\n";
                logIt($txt, $logIt);
//                $mock_Id++;

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
            if ($stmt = mysqli_prepare($link, $insertComponentQuery)) {
                mysqli_stmt_bind_param($stmt, "ssssssss", $type, $xpos, $ypos, $context, $title, $content, $subcontext, $elementId);
                mysqli_stmt_execute($stmt);
                if (mysqli_affected_rows($link) == 0) {
                    header('HTTP/1.0 400 Nothing saved - component insert');
                    exit;
                } else {
                    $componentLastItemID = $stmt->insert_id;
                }
            }
            $componentCrossReference[strval($id)] = $componentLastItemID;
//            $componentLastItemID = $mock_Id;
            $txt="Insert component id:".$componentLastItemID."-".$insertComponentQuery."{".$type.",".$xpos.",".$ypos.",".$context.",".$title.",".$content.",".$subcontext.",".$elementId."}\n";
            logIt($txt, $logIt);
//            $mock_Id++;
            $subContextEvents = getEventsFromComponentId($id, $link);
            if($id !='0') {
                foreach ($subContextEvents as $thisSubContextEvent) {
                    $thisOldEventId = $thisSubContextEvent['id'];
                    $eventCrossReference[strval($thisOldEventId)] = insertNewEvent($componentCrossReference[strval($id)], $thisSubContextEvent['label'], $thisSubContextEvent['navigation'], $thisSubContextEvent['event_type'], $thisSubContextEvent['show_sub'], $thisSubContextEvent['sub_param'], $elementId, $link);
                }
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
            if ($stmt = mysqli_prepare($link, $insertComponentQuery)) {
                mysqli_stmt_bind_param($stmt, "ssssssss", $type, $xpos, $ypos, $context, $title, $content, $subcontext, $elementId);
                mysqli_stmt_execute($stmt);
                if (mysqli_affected_rows($link) == 0) {
                    header('HTTP/1.0 400 Nothing saved - component insert');
                    exit;
                } else {
                    $componentLastItemID = $stmt->insert_id;
                }
            }

            $componentCrossReference[strval($id)] = $componentLastItemID;
  //          $componentLastItemID = $mock_Id;
            $txt="Insert component id:".$componentLastItemID."-".$insertComponentQuery."{".$type.",".$xpos.",".$ypos.",".$context.",".$title.",".$content.",".$subcontext.",".$elementId."}\n";
            logIt($txt, $logIt);
//            $mock_Id++;
//            $mock_Id++;
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
                $newMcOption = array($thisMultiChoiceOption[0], $thisMultiChoiceOption[1],$newElId);
                $multichoiceElementIdTransform[$thisMultiChoiceOption[2]]=newGuid();
                array_unshift($mcOptionResults,$newMcOption);
            }
            $newMcContentUnpacked = array($multichoiceQuestion,$mcOptionResults);
            $newMcContent = json_encode($newMcContentUnpacked);

            if ($stmt = mysqli_prepare($link, $insertComponentQuery)) {
                mysqli_stmt_bind_param($stmt, "ssssssss", $type, $xpos, $ypos, $context, $title, $content, $subcontext, $elementId);
                mysqli_stmt_execute($stmt);
                if (mysqli_affected_rows($link) == 0) {
                    header('HTTP/1.0 400 Nothing saved - component insert');
                    exit;
                } else {
                    $componentLastItemID = $stmt->insert_id;
                }
            }

            $componentCrossReference[strval($id)] = $componentLastItemID;
//            $componentLastItemID = $mock_Id;
            $txt="Insert component id:".$componentLastItemID."-".$insertComponentQuery."{".$type.",".$xpos.",".$ypos.",".$context.",".$title.",".$newMcContent.",".$subcontext.",".$elementId."}\n";
            logIt($txt, $logIt);
//            $mock_Id++;
            $docEvents = getEventsFromComponentId($id, $link);
            foreach ($docEvents as $thisDocEvent) {
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
                mysqli_stmt_execute($stmt);
                if(mysqli_affected_rows($link)==0){
                    header('HTTP/1.0 400 Nothing saved - component insert');
                    exit;
                }else {
                    $insertedEventId = $stmt->insert_id;
                }

//        $insertedEventId = $mock_Id;
        $txt="Insert event id:".$insertedEventId."-".$insertEventQuery."{".$componentId.",".$label.",".$navigation.",".$eventType.",".$showSub.",".$subParam.",".$elementId."}\n";
        logIt($txt, $logIt);
//        $mock_Id++;
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

function insertConnectionsAndRules($allConnections, $componentCrossRef, $eventCrossRef, $link)
{
    global $insertConnectionQuery, $mock_id, $logIt, $mock_Id, $insertRuleQuery;
    foreach ($allConnections as $thisComponentConnection) {
        foreach ($thisComponentConnection as $thisConnection) {
            $oldConnectionId = $thisConnection['id'];
            $oldStartId = $thisConnection['start_id'];
            $newStartId = $componentCrossRef[$oldStartId];
            $oldEndId = $thisConnection['end_id'];
            $newEndId = $componentCrossRef[$oldEndId];
            $newGoAhead = $thisConnection['go_ahead'];
            $connectionRules = $thisConnection['connectionRules'];
            if ($stmt = mysqli_prepare($link, $insertConnectionQuery)) {
                mysqli_stmt_bind_param($stmt, "ssi", $newStartId, $newEndId, $newGoAhead);
                        mysqli_stmt_execute($stmt);
                         if(mysqli_affected_rows($link)==0){
                             header('HTTP/1.0 400 Nothing saved - connection insert');
                             exit;
                         }else {
                             $insertedConnectionId = $stmt->insert_id;
                         }

//                $insertedConnectionId = $mock_Id;
                $txt="Insert connection id:".$insertedConnectionId."-".$insertConnectionQuery."{from (".$oldStartId.")  ".$newStartId.",".$newEndId.",".$newGoAhead."}\n";
                logIt($txt, $logIt);
//                $mock_Id++;
                if(count($connectionRules)>0){
                    foreach($connectionRules as $thisConnectionRule){
                        $oldConnectionRuleEventId = $thisConnectionRule['event_id'];
                        $newConnectionRuleEventId = $eventCrossRef[$oldConnectionRuleEventId];
                        $newActivate = $thisConnectionRule['activate'];
                        $newDetailRe = $thisConnectionRule['detail_re'];
                        if ($stmt = mysqli_prepare($link, $insertRuleQuery)) {
                            mysqli_stmt_bind_param($stmt, "sssi", $newConnectionRuleEventId, $insertedConnectionId,  $newDetailRe, $newActivate);
                                    mysqli_stmt_execute($stmt);
                                     if(mysqli_affected_rows($link)==0){
                                         header('HTTP/1.0 400 Nothing saved - rule insert');
                                         exit;
                                     }else {
                                         $insertedRuleId = $stmt->insert_id;
                                     }

                            $txt="Insert rule id:".$insertedRuleId."-".$insertRuleQuery."{".$newConnectionRuleEventId.",".$insertedConnectionId.",".$newDetailRe.",".$newActivate."}\n";
                            logIt($txt, $logIt);
//                            $mock_Id++;
                        }
                    }
                }
            }
        }
    }
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
