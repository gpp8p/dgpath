<?php
/**
 * Created by JetBrains PhpStorm.
 * User: georgepipkin
 * Date: 1/17/13
 * Time: 10:19 PM
 * To change this template use File | Settings | File Templates.
 */

require_once '../server_mysqli/jsonED.php';
require_once '../server_mysqli/constants.php';
require_once '../server_mysqli/loadComponents.php';
require_once '../server_mysqli/dbparams.php';
require_once '../server_mysqli/preparedQuery.php';





$contextId = $_POST['contextId'];
$jsonComponentsList = loadComponents($contextId, $link);



echo($jsonComponentsList);
