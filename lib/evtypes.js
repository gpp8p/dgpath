/**
 * Created by georgepipkin on 7/15/14.
 */
var documentViewed = 1;
var documentLinkClicked = 2;
var mcViewed=3;
var mcCorrect=4;
var mcAnswerX=5;
var tfClicked=22;
var tfTrueSelected=7;
var tfFalseSelected=8;
var tfCorrect=9;
var contextEntered=10;
var contextExited=11;
var entryDoorEntered = 12;
var exitDoorExited = 13;
var correctAnswer = 14;
var fibViewed = 15;
var correctFibAnswer = 16;
var fibAnswered = 17;
var fibResponse = 20;
var componentViewed = 18;
var tfAnswer=19;
var scoreTotalMatched=21;
var tfViewed=6;
var userLoggedIn=23;
var mcClicked=25;
var branchEntered=26;


var goAheadView = [documentLinkClicked,mcCorrect,tfCorrect,correctAnswer,correctFibAnswer];
var defaultValueApplied = [tfCorrect,correctAnswer,mcCorrect,correctFibAnswer];

var ev_event_id = 0;
var ev_component_id = 1;
var ev_componentTitle=3;
var ev_activate=8;
var ev_eventLabel=4;
var ev_event_type=5;
var ev_connection_id=6;
var ev_sub_param = 7;


