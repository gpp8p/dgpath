<?php
/**
 * Created by JetBrains PhpStorm.
 * User: georgepipkin
 * Date: 12/16/12
 * Time: 7:34 PM
 * To change this template use File | Settings | File Templates.
 */

require_once '../server/jsonED.php';
require_once '../server/dbparams.php';


$contextId =  $_POST["contextId"];




$query = "SELECT project, title from dgpath_context where id='$contextId' ";
$result = mysql_query($query);
if (!$result) {
    die('Invalid query: ' . mysql_error());
}$project_found = false;
while($data=mysql_fetch_array($result)){
    $thisProject = array($data[0], $data[1]);
    $project_found = true;
}
if(!$project_found){
    die('Project with contextId:'+$contextId+' does not exist');
}
$projectResults = json_encode($thisProject);
echo($projectResults);
