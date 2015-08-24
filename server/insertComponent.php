<?php
/**
 * Created by JetBrains PhpStorm.
 * User: georgepipkin
 * Date: 1/23/13
 * Time: 5:52 PM
 * To change this template use File | Settings | File Templates.
 */

require_once '../server/jsonED.php';
require_once '../server/constants.php';
require_once '../server/insertDocument.php';
require_once '../server/loadComponents.php';
require_once '../server/dbparams.php';


$xpos = $_POST['xpos'];
$ypos = $_POST['ypos'];
$type = $_POST['type'];
$title = $_POST['title'];
$content = $_POST['content'];
$context = $_POST['context'];



switch($type){
    case "doc":
        insertDocument($xpos, $ypos, $type, $content, $context, $title);
        break;
// keep compat with earlier vbersion
    case "doc_icon":
        insertDocument($xpos, $ypos, $type, $content, $context, $title);
        break;
    case "multichoice":
        insertMulti($xpos, $ypos, $type, $content, $context, $title);
        break;

    case "truefalse":
        insertTf($xpos, $ypos, $type, $content, $context, $title);
        break;

    case "exit_door":
        insertEx($xpos, $ypos, $type, $content, $context, $title);
        break;

}


$newComponentJson = loadComponents($context);
echo($newComponentJson);
