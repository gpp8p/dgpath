<?php
/**
 * Created by JetBrains PhpStorm.
 * User: georgepipkin
 * Date: 12/16/12
 * Time: 7:34 PM
 * To change this template use File | Settings | File Templates.
 */

require_once '../server_mysqli/jsonED.php';
require_once '../server_mysqli/dbparams.php';
require_once '../server_mysqli/preparedQuery.php';


$contextId =  $_POST["contextId"];




$query = "SELECT project, title from dgpath_context where id= ? ";
$connectionParams = array($contextId);
$userQueryResult = mysqli_prepared_query($link,$query,"s",$connectionParams);
if ($connectionResult[0]=="error") {
    header('HTTP/1.0 400 connection error look up user on project create');
    exit;
}




foreach($userQueryResult as $data){
    $thisProject = array($data['project'], $data['title']);
    $project_found = true;
}
if(!$project_found){
    die('Project with contextId:'+$contextId+' does not exist');
}
$projectResults = json_encode($thisProject);
echo($projectResults);
