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


$ownerContext =  $_POST["ownerContext"];


//$ownerContext = "2";
$projects = array();
$query = "SELECT dgpath_context.id, dgpath_project.proj_name from dgpath_project, dgpath_context where dgpath_context.project = dgpath_project.id and owner_context = '$ownerContext' and dgpath_context.topcontext=TRUE";
$result = mysql_query($query);
if (!$result) {
    die('Invalid query: ' . mysql_error());
}
while($data=mysql_fetch_array($result)){
    $thisProject = array($data[0],$data[1]);
//    $thisProject = array('id'=>$data['id'],'projName'=>$data['proj_name']);
    $projects[] = $thisProject;
}
$projectResults = json_encode($projects);
echo($projectResults);
