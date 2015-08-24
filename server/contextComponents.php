<?php
/**
 * Created by JetBrains PhpStorm.
 * User: georgepipkin
 * Date: 3/3/13
 * Time: 12:26 PM
 * To change this template use File | Settings | File Templates.
 */


require_once '../server/constants.php';
require_once '../server/jsonED.php';
require_once '../server/dbparams.php';


$thisComponentId = $_POST["componentId"];
$thisContextId = $_POST['contextId'];



$paths = array();

$query = "SELECT dgpath_connection.start_id as conn_start_id, dgpath_connection.end_id as conn_end_id from dgpath_connection, dgpath_component ";
$query = $query."where dgpath_component.id = dgpath_connection.start_id ";
$query = $query."and dgpath_component.context = '$thisContextId'";

$result = mysql_query($query);
if (!$result) {
    die('Invalid query: ' . mysql_error());
}
$dataFound = false;
while($row=mysql_fetch_array($result)){
    $thisPath = array($row['conn_start_id'], $row['conn_end_id'],0);
    array_push($paths,$thisPath);
    $dataFound=true;
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
$query = "select id, type, x, y, context, content, context, title from dgpath_component where id in (".$preds") order by dgpath_component.id";
$result = mysql_query($query);
if (!$result) {
    die('Invalid query: ' . mysql_error());
}
$dataFound = false;
$priorContextComponents = array();
while($row=mysql_fetch_array($result)){
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
