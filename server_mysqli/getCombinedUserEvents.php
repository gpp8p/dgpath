<?php
/**
 * Created by PhpStorm.
 * User: georgepipkin
 * Date: 12/9/15
 * Time: 6:17 PM
 */
require_once '../server_mysqli/jsonED.php';
require_once '../server_mysqli/constants.php';
require_once '../server_mysqli/loadComponents.php';
require_once '../server_mysqli/dbparams.php';
require_once '../server_mysqli/preparedQuery.php';





$contextId = $_POST['contextId'];

$componentArray = loadComponentsArray($contextId, $link);
