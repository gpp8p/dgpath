<?php
/**
 * Created by PhpStorm.
 * User: georgepipkin
 * Date: 10/25/14
 * Time: 10:49 PM
 */


session_start();
require_once '../server_mysqli/jsonED.php';
require_once '../server_mysqli/dbparams.php';
require_once '../server_mysqli/constants.php';
require_once '../server_mysqli/loadContent.php';
require_once '../server_mysqli/evtypes.php';
require_once '../server_mysqli/preparedQuery.php';
require_once '../server_mysqli/userEvents.php';


$thisContextId = $_POST['contextId'];
$startingComponent = $_POST['startComponentId'];

$loadedComponents = array();
if($startingComponent=='undefined'){
    $thisQuery2 = "select dgpath_component.id from dgpath_component where "
        ."dgpath_component.type = 'entry_door' "
        ."and dgpath_component.context = ? ";

    if ($stmt = mysqli_prepare($link, $thisQuery2)) {
        mysqli_stmt_bind_param($stmt, "s", $thisContextId);
        mysqli_stmt_execute($stmt);
        mysqli_stmt_bind_result($stmt, $startComponent );
        while (mysqli_stmt_fetch($stmt)) {
            $startComponentFound = true;
            $thisStartComponent = $startComponent;
        }
        if(!$startComponentFound){
            header('HTTP/1.0 400 no starting component defective course');
            exit;
        }else{
            loadContent($thisStartComponent,$link,$loadedComponents);
        }
    }
}else{
    loadContent($thisStartComponent,$link,$loadedComponents);
}
$jsonReturn = json_encode($loadedComponents);
echo($jsonReturn);
