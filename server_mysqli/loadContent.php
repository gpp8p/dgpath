<?php
/**
 * Created by PhpStorm.
 * User: georgepipkin
 * Date: 4/30/14
 * Time: 1:10 PM
 */
//echo("load content");

function loadContent($componentId, $link, &$results){
    $thisComponentQuery = "select dgpath_component.title, dgpath_component.content, dgpath_component.type, dgpath_component.context, dgpath_component.subcontext, dgpath_component.id, dgpath_component.elementId from dgpath_component "
        ."where dgpath_component.id = ?";

    $exitDoorQuery = "select dgpath_component.id as targetComponentId from dgpath_component, dgpath_connection, dgpath_rules, dgpath_events "
            ."where dgpath_connection.end_id = dgpath_component.id "
            ."and dgpath_connection.id = dgpath_rules.connection_id "
            ."and dgpath_rules.event_id = dgpath_events.id "
            ."and dgpath_events.component_id = ?";


    $thisConnectionQuery = "select dgpath_connection.end_id from dgpath_connection "
        ."where dgpath_connection.start_id = ? "
        ."and dgpath_connection.go_ahead = 1";
        $goingAhead=true;
        while($goingAhead){
            $thisSubContext = 0;
            if ($stmt = mysqli_prepare($link, $thisComponentQuery)) {
                mysqli_stmt_bind_param($stmt, "s", $componentId);
                mysqli_stmt_execute($stmt);
                mysqli_stmt_bind_result($stmt, $title, $content, $type, $context, $subcontext, $componentId, $elementId );
                $componentFound = false;
                while (mysqli_stmt_fetch($stmt)) {
                    $componentFound = true;
                    $thisTitle = $title;
                    $thisContent = $content;
                    $thisType = $type;
                    $thisContext = $context;
                    $thisSubContext = "";
                    $id = $componentId;
                    if($subcontext!=null){
                        $thisSubContext = $subcontext;
                    }
                    if($elementId!=null){
                        $thisElementId = $elementId;
                    }else{
                        $thisElementId = "";
                    }

                    $thisComponent = array('title'=>$thisTitle, 'content'=>$thisContent, 'type'=>$thisType, 'context'=>$thisContext, 'subcontext'=>$thisSubContext, 'id'=>$id, 'elementId'=>$thisElementId);
                    array_push($results, $thisComponent);
                    $subContextEntryId=null;
//                    if($thisType='subcontext'){
//                        $subContextEntryId = getEntryId($thisSubContext);
//                        loadContent($subContextEntryId, $results);
//                    }
                }
                if(!$componentFound){
                    return array('status'=>"Error - component not found");
                }else{
                    $connectionFound = false;
                    $nextComponent = null;
                    if($thisType==='subcontext'){
                        $componentId =  getSubContextPath($thisSubContext, $link);
                        if($componentId!=null){
                            $connectionFound=true;
                        }else{
                            $connectionFound=false;
                            $goingAhead=false;
                        }
                    }else if($thisType==='exit_door'){
 //                       $componentId =  getParentContextPath($thisContext, $link);
                        $connectionParams = array($componentId);
                        $queryResult = mysqli_prepared_query($link,$exitDoorQuery,"s",$connectionParams);
                        $parentLink = $queryResult[0]['targetComponentId'];
                        if($parentLink!=null){
                            $connectionFound=true;
                            $componentId = $parentLink;
                        }else{
                            $connectionFound=false;
                            $goingAhead=false;
                        }
                    }else{
                        if ($stmt = mysqli_prepare($link, $thisConnectionQuery)) {
                            mysqli_stmt_bind_param($stmt, "s", $componentId);
                            mysqli_stmt_execute($stmt);
                            mysqli_stmt_bind_result($stmt, $endId );
                            while (mysqli_stmt_fetch($stmt)) {
                                $connectionFound = true;
                                $componentId = $endId;
                            }
                            if(!$connectionFound){
                                $goingAhead = false;
                            }
                        }else{
                            return array('status'=>"Error - bad connection query");
                        }
                    }
                }
            }else{
                $goingAhead=false;
            }
        }
    }


function getSubContextPath($subContextId, $link){

    $query = "select dgpath_connection.end_id from dgpath_component, dgpath_connection ";
    $query = $query."where dgpath_component.type = 'entry_door' and dgpath_component.context = ? ";
    $query = $query."and dgpath_connection.start_id = dgpath_component.id";

    if ($stmt = mysqli_prepare($link, $query)) {
        mysqli_stmt_bind_param($stmt, "s", $subContextId);
        mysqli_stmt_execute($stmt);
        mysqli_stmt_bind_result($stmt, $endId);
        $endIdFound = false;
        while (mysqli_stmt_fetch($stmt)) {
            return $endId;
        }
        return null;
    }else{
        return null;
    }

}

function getParentContextPath($contextId, $link){

    $query = "select dgpath_connection.end_id from dgpath_component, dgpath_connection ";
    $query = $query."where dgpath_component.subcontext = ? ";
    $query = $query."and dgpath_connection.start_id = dgpath_component.id ";
    if ($stmt = mysqli_prepare($link, $query)) {
        mysqli_stmt_bind_param($stmt, "s", $contextId);
        mysqli_stmt_execute($stmt);
        mysqli_stmt_bind_result($stmt, $endId);
        $endIdFound = false;
        while (mysqli_stmt_fetch($stmt)) {
            return $endId;
        }
        return null;
    }else{
        return null;
    }

}



