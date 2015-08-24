<?php
/**
 * Created by PhpStorm.
 * User: georgepipkin
 * Date: 10/5/14
 * Time: 9:52 PM
 */

function userLoginEvent($traversalId, $userId, $link){


    $query = "INSERT INTO dgpath_agent_traversal (session, user_id) values (?,?)";
    if ($stmt = mysqli_prepare($link, $query)) {
        mysqli_stmt_bind_param($stmt, "ss", $traversalId, $userId);
        mysqli_stmt_execute($stmt);
        if(mysqli_stmt_affected_rows($stmt)==0){
            header('HTTP/1.0 400 Nothing saved - login event insert');
            exit;
        }
    }else{
        header('HTTP/1.0 400 bad query - login event insert');
        exit;
    }
    return;

}

function showComponentsEvent($loadedComponents, $startingComponent, $traversalSessionId, $userId, $thisCourseId,  $link){
    global $componentsView, $lowMedium;

    $query = "SELECT id from dgpath_agent_traversal where session = ?";
    $connectionParams = array($traversalSessionId);
    $queryResult = mysqli_prepared_query($link,$query,"s",$connectionParams);
    $thisTraversalId = null;
    foreach($queryResult as $row){
        $thisTraversalId = $row['id'];
    }
    if($thisTraversalId==null){
        header('HTTP/1.0 400 session id not found');
        exit;
    }
    $componentsIncludedInThisView = array();
    foreach($loadedComponents as $thisLoadedComponent){
        array_push($componentsIncludedInThisView, $thisLoadedComponent['id']);
    }
    $componentsIncludedInThisViewJson = json_encode($componentsIncludedInThisView);
    $query = "INSERT INTO dgpath_user_events (component_id, traversal_id, user_id, event_type, project_id, priority, detail) values (?,?,?,?,?,?,?)";
    if ($stmt = mysqli_prepare($link, $query)) {
        mysqli_stmt_bind_param($stmt, "dddddds", $startingComponent, $traversalSessionId, $userId, $componentsView, $thisCourseId, $lowMedium, $componentsIncludedInThisViewJson );
        mysqli_stmt_execute($stmt);
        if(mysqli_stmt_affected_rows($stmt)==0){
            header('HTTP/1.0 400 Nothing saved - login event insert');
            exit;
        }
    }else{
        header('HTTP/1.0 400 bad query - login event insert');
        exit;
    }



}