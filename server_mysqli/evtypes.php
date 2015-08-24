<?php
/**
 * Created by PhpStorm.
 * User: georgepipkin
 * Date: 7/22/14
 * Time: 10:52 PM
 */
$documentViewed = 1;
$documentLinkClicked = 2;
$mcViewed=3;
$mcCorrect=4;
$mcAnswerX=5;
$tfTrueSelected=7;
$tfFalseSelected=8;
$tfViewed=6;
$tfCorrect=9;
$tfClicked=22;
$contextEntered=10;
$contextExited=11;
$entryDoorEntered = 12;
$exitDoorExited = 13;
$correctAnswer = 14;
$fibViewed = 15;
$correctFibAnswer = 16;
$fibAnswered = 17;
$fibResponse = 20;
$componentViewed = 18;
$tfAnswer=19;
$scoreTotalMatched=21;

$userLoggedIn=23;
$componentsView=24;
$mcClicked=25;


$entryEvents = "(".$documentViewed.",".$mcViewed.",".$tfViewed.",".$contextEntered.",".$entryDoorEntered.")";
$responseEvents = array($fibAnswered,$tfClicked,$mcClicked);

$high = 5;
$medium = 4;
$lowMedium = 3;
$low = 2;
$veryLow = 2;
$archive = 0;

