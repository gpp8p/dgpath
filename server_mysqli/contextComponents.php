<?php
/**
 * Created by JetBrains PhpStorm.
 * User: georgepipkin
 * Date: 3/3/13
 * Time: 12:26 PM
 * To change this template use File | Settings | File Templates.
 */


require_once '../server_mysql1/constants.php';
require_once '../server_mysql1/jsonED.php';
require_once '../server_mysql1/dbparams.php';
require_once '../server_mysqli/preparedQuery.php';


$thisComponentId = $_POST["componentId"];
$thisContextId = $_POST['contextId'];



$paths = array();

$query = "SELECT dgpath_connection.start_id as conn_start_id, dgpath_connection.end_id as conn_end_id from dgpath_connection, dgpath_component ";
$query = $query."where dgpath_component.id = dgpath_connection.start_id ";
$query = $query."and dgpath_component.context = ?";
if ($stmt = mysqli_prepare($link, $query)) {
    mysqli_stmt_bind_param($stmt, "s", $thisContextId);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_bind_result($stmt, $startId, $endId);
    while (mysqli_stmt_fetch($stmt)) {
        $thisPath = array($startId, $endId,0);
        array_push($paths,$thisPath);
        $dataFound=true;
    }
}else{
    header('HTTP/1.0 400 Bad query');
    exit;
}
if(!$dataFound){
    die("no paths found");
}

$foundPredecessors = array();
lookForPredecessor($paths, $foundPredecessors, intval($thisComponentId));
$predecessorNodes = weedDuplicates($foundPredecessors);

$preds = $thisComponentId;
for($p = 0;$p<count($predecessorNodes);$p++){
    $pn = $predecessorNodes[$p];
    $preds = $preds.",";
    $preds = $preds.strval($pn);
}
$query = "select id, type, x, y, context, content, context, title from dgpath_component where id in (?) order by dgpath_component.id";
$connectionParams = array($preds);
$queryResult = mysqli_prepared_query($link,$query,"s",$connectionParams);

if ($queryResult[0]=="error") {
    header('HTTP/1.0 400 connection error look up user on predecessor query');
    exit;
}







$dataFound = false;
$priorContextComponents = array();
foreach($queryResult as $row){
    $thisPriorComponent = array('id'=>$row['id'], 'type'=>$row['type'], 'x'=>$row['x'], 'y'=>$row['y'], 'content'=>$row['content'], 'context'=>$row['context'], 'title'=>$row['title'] );
    array_push($priorContextComponents, $$thisPriorComponent);
}

$jsonPriorComponents = json_encode($priorContextComponents);
echo($jsonPriorComponents);










function frontierNodes($at, &$nodes){
    $thisFrontier = array();
    for($i=0;$i<count($nodes);$i++){
        $thisNode = $nodes[$i];
        if($thisNode[1]==$at && $thisNode[2]==0){
            $nodes[$i][2] = 1;
            $thisFrontier[]=$nodes[$i];
        }
    }
    return $thisFrontier;
}


function lookForPredecessor(&$nodes, &$predecessorNodes, $startAt){
    $thisFrontier = frontierNodes($startAt, $nodes);
    if(count($thisFrontier)==0){
        return;
    }else{
        foreach($thisFrontier as $f){
            $predecessorNodes[] = $f;
            lookForPredecessor($nodes, $predecessorNodes, $f[0]);
        }
    }
}

function weedDuplicates($foundPredecessors){
    $predecessorNodes = array();


    foreach($foundPredecessors as $t){
//        echo($t[0]."-".$t[1]."-".$t[2]."\n");
        if(! in_array($t[0], $predecessorNodes)){
            $predecessorNodes[]=$t[0];
        }
    }
    return $predecessorNodes;
}
