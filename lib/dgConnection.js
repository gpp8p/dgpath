/**
 * Created by georgepipkin on 12/17/13.
 */

function dgConnection(f, t, i){
    this.fromLayerName = f.id;
    this.toLayerName = t.id;
    this.startX = parseInt(f.x);
    this.startY = parseInt(f.y);
    this.endX = parseInt(t.x);
    this.endY = parseInt(t.y);

    this.connectionId = i;
    this.draw = function(){
        drawArrow(this.startX, this.startY, this.endX, this.endY);
    }
    this.setup = function(cmpId, ctxId, conId){
        editPath(cmpId, ctxId, conId);
    }

    return this;
};

var componentRuleOptions = [["Veto if True","1",false],["Veto if not True","2",false], ["Pass if True", "3",false], ["Pass if not True","4",false], ["Add Extra eight to Score", "5",false], ["Add Normal Weight to Score","6",true], ["Add less than Normal Weight to Score","7",false]];
var componentRuleOptionsGoAhead = [["Add Extra eight to Score", "5",false], ["Add Normal Weight to Score","6",true], ["Add less than Normal Weight to Score","7",false]];
var scoreableOptions =[["Pass if Score > 10%", "8",false],["Pass if Score < 10%", "9",false],["Pass if Score > 20%", "10",false],["Pass if Score < 20%", "11",false],["Pass if Score > 30%", "12",false],["Pass if Score < 30%", "13",false],["Pass if Score > 40%", "14",false],["Pass if Score < 40%", "15",false],["Pass if Score > 50%", "16",false],["Pass if Score < 50%", "17",false],["Pass if Score > 60%", "18",false],["Pass if Score < 60%", "19",false],["Pass if Score > 65%", "20",false],["Pass if Score < 65%", "21",false],["Pass if Score > 70%", "22",false],["Pass if Score < 70%", "23",false],["Pass if Score > 75%", "24",false],["Pass if Score < 75%", "25",false],["Pass if Score > 80%", "26",false],["Pass if Score < 80%", "27",false],["Pass if Score > 85%", "28",false],["Pass if Score <85%", "29",false],["Pass if Score > 90%", "30",false],["Pass if Score < 90%", "31",false],["Pass if Score > 95%", "32",false],["Pass if Score < 95%", "33",false],["Pass if Score is 100%", "34",false], ["Pass if Score < 100%", "35",false]];
//-----------------------------------------arrow drawing---------------------------------------------

function drawArrow(fromX, fromY, toX, toY, goAhead){
    var rad = Math.atan2(toY-fromY, toX-fromX);
    var sine = Math.sin(rad);
    var cosine = Math.cos(rad);
    newStartX = Math.round(cosine*30);
    newStartY = Math.round(sine*30);
    newX1 = Math.round(fromX+newStartX);
    newY1 = Math.round(fromY+newStartY);
    newX2 = Math.round(toX-newStartX);
    newY2 = Math.round(toY-newStartY);
    if(goAhead>0){
        lineColor = "#4e8805";
    }else{
        lineColor = "#ff0000";
    }
    $("canvas").drawLine({
        strokeStyle: lineColor,
        strokeWidth: 3,
        layer: true,
        index: 0,
        rounded: true,
        x1: newX1, y1: newY1,
        x2: newX2, y2: newY2

    });
    thisLayer = $('canvas').getLayer(-1);
    a1Angle = Math.round(figureAngle(fromX,fromY,toX,toY)) -30;
    a2Angle = Math.round(figureAngle(fromX,fromY,toX,toY)) +30;
    a1Rad = a1Angle * Math.PI/180;
    a2Rad = a2Angle * Math.PI/180;
    a1NewStartX = Math.cos(a1Rad)*20;
    a1NewStartY = Math.sin(a1Rad)*20;
    a2NewStartX = Math.cos(a2Rad)*20;
    a2NewStartY = Math.sin(a2Rad)*20;
    $("canvas").drawLine({
        strokeStyle: lineColor,
        strokeWidth: 3,
        layer: true,
        index: 0,
        rounded: true,
        x1: toX-newStartX, y1: toY-newStartY,
        x2: (toX-newStartX)-a1NewStartX, y2: (toY-newStartY)-a1NewStartY
    });
    $("canvas").drawLine({
        strokeStyle: lineColor,
        strokeWidth: 3,
        layer: true,
        index: 0,
        rounded: true,
        x1: toX-newStartX, y1: toY-newStartY,
        x2: (toX-newStartX)-a2NewStartX, y2: (toY-newStartY)-a2NewStartY
    });
}



function figureAngle(x1,y1,x2,y2){
    deltaX = x2-x1;
    deltaY = y2-y1;
    return angleFromDelta(deltaY, deltaX);
}

function angleFromDelta(deltaY, deltaX){
    var rad = Math.atan2(deltaY, deltaX);
    var sine = Math.sin(rad);
    var cosine = Math.cos(rad);


    return rad * (180/Math.PI);

}
// --------------------------------------  connection property setting -----------------------------------------


function gatherOptionalEvents(thisEvent, connectionId, currentComponentId, componentTitle){
    // need tp change this not to use indexing in the return array



    newComp = "thisComp = new "+thisEvent['componentType']+"()";
    eval(newComp);
    thisComp.layerName = thisEvent['componentId'];
    thisComp.context = thisEvent['componentContext'];
    thisComp.type = thisEvent['componentType'];
    thisComp.title = thisEvent['componentTitle'];
    thisComp.subcontext = thisEvent['subcontext'];

    if (thisComp.getPathOptions && typeof(thisComp.getPathOptions) == "function"){
        OptionalEvents = thisComp.getPathOptions(thisComp, connectionId, currentComponentId, componentTitle);

    }
}

function componentSelectPopulate(selectedComponentId, thisComponentId, componentTitle, contextId){
    var lFunction = "showThisComponent(this.value,"+contextId+");"
    if(selectedComponentId==thisComponentId){
        $('#mySelectEv')
            .append($('<option>', { selected: true, value :thisComponentId, onchange: lFunction })
                .text(componentTitle));

    }else{
        $('#mySelectEv')
            .append($('<option>', { value :thisComponentId, onchange: lFunction })
                .text(componentTitle));
    }
}

function eventRow(eventLabel, eventId, componentId, currentComponentId, connectionId){
    var hreturn;

    var rowId = "erow."+componentId+"."+eventId;
    if(componentId == currentComponentId){
        hreturn = hreturn + "<tr id='"+rowId+"'><td class='rtcell' align='left'>"+eventLabel+"</td><td class='rtradio' ><input  type = 'radio' name='evt"+eventId+"' id='evt."+eventId+"."+connectionId+"' value='necessary' /></td><td class='rtradio'><input type = 'radio' name='evt"+eventId+"' id='evt."+eventId+"."+connectionId+"' value='sufficient' /></td><td class='rtradio'><input type = 'radio' name='evt"+eventId+"' id='evt."+eventId+"."+connectionId+"' value='exclude' /></td></tr>";
    }else{
        hreturn = hreturn + "<tr id='"+rowId+"' hidden='true'><td class='rtcell' align='left'>"+eventLabel+"</td><td class='rtradio' ><input  type = 'radio' name='evt"+eventId+"' id='evt."+eventId+"."+connectionId+"' value='necessary' /></td><td class='rtradio'><input type = 'radio' name='evt"+eventId+"' id='evt."+eventId+"."+connectionId+"' value='sufficient' /></td><td class='rtradio'><input type = 'radio' name='evt"+eventId+"' id='evt."+eventId+"."+connectionId+"' value='exclude' /></td></tr>";
    }
    return hreturn;
}



function eTableFooter(thisComponentId, contextId){
    var hrtn;
    var lFunction = "loadThisComponent(this.value,"+contextId+");"
    hrtn = "<tr id='etableFooterTr'><td align=\"left\" style=\"background:#FFCCBA;\"><span class=\"dd3\">View choices for:</span></td><td colspan=\"3\"><select name=\"mySelectEv\" id=\"mySelectEv\" class=\"componentSelect3\" onchange=\""+lFunction+"\;\"></select></td></tr>";
    return hrtn;
}

function editPath(componentId, contextId, connId){
    var thisTransaction = urlBase+find_predecessor_paths+"?"+debug;
    var connectionId;
    if(connId==null){
        connectionId = $("#pathSelectDropDown").val();
    }else{
        connectionId = connId;
    }
    myData = {componentId: componentId, contextId: contextId, connectionId: connectionId};
    $.ajax({
        type: "POST",
        url: thisTransaction,
        componentId: componentId,
        connectionId: connectionId,
        contextId: contextId,
        data: myData,
        success: function(msg) {
            var yesGoAhead = "<input type=\"radio\" id = \"yesGoAhead\" />";
            var noGoAhead = "<input type=\"radio\" id = \"noGoAhead\" />";
            result = eval(msg);
            $('#popup').html(getEventsEditHTML_v3(connectionId));
            $("#connectionId").val(connectionId);
            $("#deletePath").on("click", function(){
                deletePath($("#connectionId").val());
            });
            $("#cancel").on("click", function(){
                cancelEv();
            });
            $("#save").on("click", function(){
                saveSelectedEvents($("#connectionId").val());
            });
            $('tr[id^="erow"]').remove();
            $('tr[id^="etableFooterTr"]').remove();
            $("#learnerAtLabel").html($.t("pathDialog.learnerAtLabel"));
            $("#learnerTargetLabel").html($.t("pathDialog.learnerTargetLabel"));
            $("#summaryEventsComponentName").html("&#160;&#160;"+result[0].startTitle);
            $("#summaryEventsConnectionToName").html("&#160;&#160;"+result[0].endTitle);
            $("#goAheadYes").html(yesGoAhead+$.t("pathDialog.goAheadYes"));
            $("#goAheadNo").html(noGoAhead+$.t("pathDialog.goAheadNo"));
            $("#componentTitle").html($.t("pathDialog.componentTitle"));
            $("#eventLabel").html($.t("pathDialog.eventLabel"));
            $("#activate").html($.t("pathDialog.activate"));

            $("#titleBar").html($.t("pathDialog.titleBar"));
            $("#pathTitleBar").html($.t("pathDialog.pathTitleBar"))
            var goAhead = false;
            if(result[0].goAhead){
                goAhead = true;
                $("#evtsBar").html($.t("pathDialog.goAheadBar"));
                $("#goAheadYes").addClass("goAheadOn");
                $("#goAheadNo").addClass("goAheadOff");
                $("#yesGoAhead").prop("checked", true);
                $("#noGoAhead").prop("checked", false);

            }else{
                goAhead = false;
                $("#evtsBar").html($.t("pathDialog.evtsBar"));
                $("#goAheadYes").addClass("goAheadOff");
                $("#goAheadNo").addClass("goAheadOn");
                $("#yesGoAhead").prop("checked", false);
                $("#noGoAhead").prop("checked", true);

            }

            $("#goAheadYes").bind("click", function(){
                 goAhead = true;
                 $("#evtsBar").html($.t("pathDialog.goAheadBar"));
                 $("#goAheadYes").removeClass("goAheadOff");
                 $("#goAheadYes").addClass("goAheadOn");
                 $("#goAheadNo").removeClass("goAheadOn");
                 $("#goAheadNo").addClass("goAheadOff");
                 $("#yesGoAhead").prop("checked", true);
                 $("#noGoAhead").prop("checked", false);
                $('#summaryEventsTable tbody').html("");
                for(var i=0;i<priorContextEvents.length;i++){
                    var thisPEvent = priorContextEvents[i];
                    if(showThisEvent(goAhead,thisPEvent[ev_event_type])){
                        thisRow = editableEventRow_v3(thisPEvent, connectionId, goAhead, componentId);
                        $('#summaryEventsTable tbody').append(thisRow);
                    }
                }
            });
            $("#goAheadNo").bind("click", function(){
                 goAhead = false;
                 $("#evtsBar").html($.t("pathDialog.evtsBar"));
                 $("#goAheadYes").addClass("goAheadOff");
                 $("#goAheadYes").removeClass("goAheadOn");
                 $("#goAheadNo").removeClass("goAheadOff");
                 $("#goAheadNo").addClass("goAheadOn");
                 $("#yesGoAhead").prop("checked", false);
                 $("#noGoAhead").prop("checked", true);
                $('#summaryEventsTable tbody').html("");
                for(var i=0;i<priorContextEvents.length;i++){
                    var thisPEvent = priorContextEvents[i];
                    if(showThisEvent(goAhead,thisPEvent[ev_event_type])){
                        thisRow = editableEventRow_v3(thisPEvent, connectionId, goAhead, componentId);
                        $('#summaryEventsTable tbody').append(thisRow);
                    }
                }
            });

            priorContextEvents = result[1];
            for(var i=0;i<priorContextEvents.length;i++){
                var thisPEvent = priorContextEvents[i];
                if(showThisEvent(goAhead,thisPEvent[ev_event_type])){
                    thisRow = editableEventRow_v3(thisPEvent, connectionId, goAhead, componentId);
                    $('#summaryEventsTable tbody').append(thisRow);
                }
            }
            $("#popup").show();

        },
        error: function(err) {
            alert(err.toString());
            if (err.status == 200) {
                ParseResult(err);
            }
            else { alert('Error:' + err.responseText + '  Status: ' + err.status); }
        }

    });
}

function deletePath(connectionId){

    var thisTransaction = urlBase+delete_connection+"?"+debug;
    myData = {connectionId: connectionId};
    $.ajax({
        type: "POST",
        url: thisTransaction,
        data: myData,
        success: function(msg) {
            $("#popup").hide();
            $("#popup").html("");
            reloadAllComponents($("#reLoadContext").val());
        },
        error: function(err) {
            alert(err.toString());
            if (err.status == 200) {
                ParseResult(err);
            }
            else { alert('Error:' + err.responseText + '  Status: ' + err.status); }
        }
    });

}

function editPath_old(componentId, contextId, connId){
    var thisTransaction = urlBase+get_connection_events+"?"+debug;
    var connectionId;
    if(connId==null){
        connectionId = $("#pathSelectDropDown").val();
    }else{
        connectionId = connId;
    }
    myData = {componentId: componentId, contextId: contextId, connectionId: connectionId};

    $.ajax({
        type: "POST",
        url: thisTransaction,
        data: myData,
        success: function(msg) {
            result = eval(msg);
//            $('#popup').html(getEventsEditHTML(connectionId));
            $('#popup').html(getEventsEditHTML_v3(connectionId));
            $('tr[id^="erow"]').remove();
            $('tr[id^="etableFooterTr"]').remove();
            $("#startTitle").html("Learner at:");
            $("#startTitleContent").html(result[0].startTitle);
            $("#proceedOnL1").html("Add contents of ");
            $("#proceedOnL2").html(result[0].startTitle);
            $("#proceedOnL3").html(" to what the learner sees and proceed to ");
            $("#proceedOnL4").html(result[0].endTitle);
            $("#proceedIfL1").html("Proceed to ");
            $("#proceedIfL2").html(result[0].endTitle);
            $("#proceedIfL3").html(" when:");
            if(result[0].existingConnections < 2){
                if(result[0].goAhead==true && result[0].existingConnections){
                    $("#rProceedOnTrue").prop('checked', true);
                    $("#rProceedOnFalse").prop('checked', false);
                }else{
                    $("#rProceedOnTrue").prop('checked', false);
                    $("#rProceedOnFalse").prop('checked', true);
                }
            }else{
                $("#rProceedOnTrue").prop('checked', false);
                $("#rProceedOnFalse").prop('checked', true);
                $("#rProceedOnFalse").attr('disabled', true);
                $("#rProceedOnTrue").attr('disabled', true);
            }
            priorContextEvents = result[1];
            for(var i=0;i<priorContextEvents.length;i++){
                var thisPEvent = priorContextEvents[i];
                thisRow = editableEventRow_v2(thisPEvent, connectionId);
//                thisRow = editableEventRow(thisPEvent);
                $('#componentEventsTable tbody').append(thisRow);
            }
            thisComponent = findComponent(componentId, currentComponents);
            $('#popup').show();
            newComp = "thisComp = new "+thisComponent.type+"()";
            eval(newComp);
            thisComp.getPathOptions(componentId, contextId, connectionId);



        },
        error: function(err) {
            alert(err.toString());
            if (err.status == 200) {
                ParseResult(err);
            }
            else { alert('Error:' + err.responseText + '  Status: ' + err.status); }
        }

    });
}



function editableEventRow(eventRecord){
    var hreturn;
    var evtRuleId = 'evt.'+eventRecord['eventId'];
    var radio_necessary;
    if(eventRecord['necessary']==1){
        radio_necessary = "<input  type = 'radio' name="+evtRuleId+" id="+evtRuleId+" value='necessary' checked='checked' />";
    }else{
        radio_necessary = "<input  type = 'radio' name="+evtRuleId+" id="+evtRuleId+" value='necessary' />";
    }

    var radio_sufficient;
    if(eventRecord['sufficient']==1){
        radio_sufficient =  "<input  type = 'radio' name="+evtRuleId+" id="+evtRuleId+" value='sufficient' checked='checked' />";
    }else{
        radio_sufficient =  "<input  type = 'radio' name="+evtRuleId+" id="+evtRuleId+" value='sufficient' />";
    }
    var radio_necessary_ex;
    if(eventRecord['exclude']==1){
        radio_necessary_ex =  "<input  type = 'radio' name="+evtRuleId+" id="+evtRuleId+" value='exclude' checked='checked' />";
    }else{
        radio_necessary_ex =  "<input  type = 'radio' name="+evtRuleId+" id="+evtRuleId+" value='exclude' />";
    }
    clear_row =  "<input  type = 'radio' name="+evtRuleId+" id="+evtRuleId+" value='clear' />";

    hreturn = hreturn + "<tr ><td class='rtcell' align='left'>"+eventRecord['eventLabel']+"</td><td class='rtradio' >"+radio_necessary+"</td><td class='rtradio'>"+radio_sufficient+"</td><td class='rtradio'>"+radio_necessary_ex+"</td><td class='rtradio'>"+clear_row+"</td></tr>";

    return hreturn;
}

function getEventsEditHTML(connectionId){

    var strVar="";
    strVar += "    <div id=\"componentEventsEdit\" class=\"componentEvents\">";
    strVar += "        <table border=\"0\" id=\"componentEventsTable\">";
    strVar += "            <thead>"
    strVar += "            <tr>";
    strVar += "            <td colspan=\"5\">";
    strVar += "                 <div>";
    strVar += "                     <span id=\"startTitle\" class=\"hdr11\"></span> "
    strVar += "                     <span id=\"startTitleContent\" class=\"hdr3\"></span>";
    strVar += "                 <\/div>";
    strVar += "            <\/td>";
//    strVar += "            <td colspan=\"3\">";
//    strVar += "                 <div id=\"endTitle\" class=\"hdr3\">";
//    strVar += "                 <\/div>";
//    strVar += "            <\/td>";
    strVar += "            <tr>";
    strVar += "            <td colspan=\"5\">";
    strVar += "                 <div>";
    strVar += "                     <span id=\"proceedOn\"><input type=\"radio\" id=\"rProceedOnTrue\" name=\"rProceedOn\"/></span> "
    strVar += "                     <span id=\"proceedOnL1\" class=\"hdr12\"></span>";
    strVar += "                     <span id=\"proceedOnL2\" class=\"hdr13\"></span>";
    strVar += "                     <span id=\"proceedOnL3\" class=\"hdr12\"></span>";
    strVar += "                     <span id=\"proceedOnL4\" class=\"hdr13\"></span>";
    strVar += "                 <\/div>";
    strVar += "            <\/td>";
    strVar += "            <\/tr>";
    strVar += "            <tr>";
    strVar += "            <td colspan=\"5\">";
    strVar += "                 <div>";
    strVar += "                     <span id=\"proceedIf\"><input type=\"radio\" id=\"rProceedOnFalse\" name=\"rProceedOn\"/></span> "
    strVar += "                     <span id=\"proceedIfL1\" class=\"hdr12\"></span>";
    strVar += "                     <span id=\"proceedIfL2\" class=\"hdr13\"></span>";
    strVar += "                     <span id=\"proceedIfL3\" class=\"hdr12\"></span>";
    strVar += "                 <\/div>";
    strVar += "            <\/td>";
    strVar += "            <\/tr>";
    strVar += "            <tr>";
    strVar += "                <th align=\"left\" class=\"rthdr\">";
    strVar += "                    When:";
    strVar += "                <\/th>";
    strVar += "                <th align=\"left\" class=\"rthdr\">";
    strVar += "                    Only If";
    strVar += "                <\/th>";
    strVar += "                <th align=\"left\" class=\"rthdr\">";
    strVar += "                    Always If";
    strVar += "                <\/th>";
    strVar += "                <th align=\"left\" class=\"rthdr\">";
    strVar += "                    Never If";
    strVar += "                <\/th>";
    strVar += "                <th align=\"left\" class=\"rthdr\">";
    strVar += "                    Clear Rule";
    strVar += "                <\/th>";

    strVar += "            <\/tr>";
    strVar += "            </thead>";
    strVar += "            <tbody>";
    strVar += "            </tbody>";
    strVar += "            <tfoot>";
    strVar += "            </tfoot>";
    strVar += "        <\/table>";
    strVar += "        <div><a href=\"#\" onclick=\"cancelEv();\"><img src=\"images\/cancelCreate.png\" \/><a href=\"#\" onclick=\"saveSelectedEvents("+connectionId+");\"><img src=\"images\/saveEvents.png\" \/><\/a><\/div>";
    strVar += "    <\/div>";
    strVar += "";
    return strVar;
}

function getSummaryEventsHTML(connectionId){
    var strVar="";
    strVar += "<div id = \"summaryEventsEdit\" class=\"summaryEvents\">";
    strVar += "	<div class=\"summaryEventsHeader\">";
    strVar += "		Learner at:<span id=\"summaryEventsComponentName\" class=\"summaryEventsComponentNameStyle\"><\/span>";
    strVar += "	<\/div>";
    strVar += "	<div id=\"summaryEventsConnectionTo\">";
    strVar += "		Proceed to:<span id=\"summaryEventsConnectionToName\" class=\"summaryEventsConnectionToNameStyle\"><\/span>";
    strVar += "	<\/div>";
    strVar += "	<div id=\"summaryEventsTableScroll>";
    strVar += "		<table border=\"0\" id=\"summaryEventsTable\">";
    strVar += "			<thead>";
    strVar += "				<tr>";
    strVar += "					<th align=\"left\" class = rthdr\" width=\"30%\">";
    strVar += "						At Component:";
    strVar += "					<\/th>";
    strVar += "					<th align=\"left\" class = rthdr\" width=\"30%\">";
    strVar += "						When:";
    strVar += "					<\/th>";
    strVar += "					<th align=\"left\" class = rthdr\" width=\"40%\">";
    strVar += "						Action:";
    strVar += "					<\/th>";
    strVar += "				<\/tr>";
    strVar += "			<\/thead>";
    strVar += "			<tbody>";
    strVar += "			<\/tbody>";
    strVar += "			<tfoot>";
    strVar += "			<\/tfoot>";
    strVar += "		<\/table>";
    strVar += "	<\/div>";
    strVar += "<\/div>";
    strVar += "<div><a href=\"#\" onclick=\"cancelEv();\"><img src=\"images\/cancelCreate.png\" \/><a href=\"#\" onclick=\"saveSelectedEvents("+connectionId+");\"><img src=\"images\/saveEvents.png\" \/><\/a><\/div>";
    strVar += "<\/div>";
    return strVar;

}

function getEventsEditHTML_v2(connectionId){
   var strVar="";
    strVar += "    <div id=\"componentEventsEdit\" class=\"componentEvents\">";
    strVar += "        <table border=\"0\" id=\"componentEventsTable\">";
    strVar += "            <thead>"
    strVar += "            <tr>";
    strVar += "            <td colspan=\"5\">";
    strVar += "                 <div>";
    strVar += "                     <span id=\"startTitle\" class=\"hdr11\"></span> "
    strVar += "                     <span id=\"startTitleContent\" class=\"hdr3\"></span>";
    strVar += "                 <\/div>";
    strVar += "            <\/td>";
//    strVar += "            <td colspan=\"3\">";
//    strVar += "                 <div id=\"endTitle\" class=\"hdr3\">";
//    strVar += "                 <\/div>";
//    strVar += "            <\/td>";
    strVar += "            <tr>";
    strVar += "            <td colspan=\"5\">";
    strVar += "                 <div>";
    strVar += "                     <span id=\"proceedOn\"><input type=\"radio\" id=\"rProceedOnTrue\" name=\"rProceedOn\"/></span> "
    strVar += "                     <span id=\"proceedOnL1\" class=\"hdr12\"></span>";
    strVar += "                     <span id=\"proceedOnL2\" class=\"hdr13\"></span>";
    strVar += "                     <span id=\"proceedOnL3\" class=\"hdr12\"></span>";
    strVar += "                     <span id=\"proceedOnL4\" class=\"hdr13\"></span>";
    strVar += "                 <\/div>";
    strVar += "            <\/td>";
    strVar += "            <\/tr>";
    strVar += "            <tr>";
    strVar += "            <td colspan=\"5\">";
    strVar += "                 <div>";
    strVar += "                     <span id=\"proceedIf\"><input type=\"radio\" id=\"rProceedOnFalse\" name=\"rProceedOn\"/></span> "
    strVar += "                     <span id=\"proceedIfL1\" class=\"hdr12\"></span>";
    strVar += "                     <span id=\"proceedIfL2\" class=\"hdr13\"></span>";
    strVar += "                     <span id=\"proceedIfL3\" class=\"hdr12\"></span>";
    strVar += "                 <\/div>";
    strVar += "            <\/td>";
    strVar += "            <\/tr>";
    strVar += "            <tr>";
    strVar += "                <th align=\"left\" class=\"rthdr\" width=\"35%\" \">";
    strVar += "                    When:";
    strVar += "                <\/th>";
    strVar += "                <th align=\"left\" colspan=\"4\" class=\"rthdr\" width=\"65%\">";
    strVar += "                    Action";
    strVar += "                <\/th>";
    strVar += "            <\/tr>";
    strVar += "            </thead>";
    strVar += "            <tbody>";
    strVar += "            </tbody>";
    strVar += "            <tfoot>";
    strVar += "            </tfoot>";
    strVar += "        <\/table>";
    strVar += "        <div><a href=\"#\" onclick=\"cancelEv();\"><img src=\"images\/cancelCreate.png\" \/><a href=\"#\" onclick=\"saveSelectedEvents("+connectionId+");\"><img src=\"images\/saveEvents.png\" \/><\/a><\/div>";
    strVar += "    <\/div>";
    strVar += "";
    return strVar;
}

function getEventsEditHTML_v3(connectionId){

    var strVar="";
    strVar += "<div id = \"summaryEventsEdit\" class=\"componentEvents summaryEvents\">";


    strVar += "<table border=\"0\" id=\"tlTable\" width=\"100%\" align=\"center\" >";

    strVar += "<tr>";
    strVar += "<td colspan=\"2\" class=\"evtsBarStyle td\">";
    strVar += "<div id =\"titleBar\" >";
    strVar += "</div>";
    strVar += "</td>";
    strVar += "<td colspan=\"2\" class=\"evtsBarStyle td\">";
    strVar += "<div id =\"pathTitleBar\" >";
    strVar += "</div>";
    strVar += "</td>";

    strVar += "</tr>";


    strVar += "<tr>";
    strVar += "<td class=\"summaryEventsComponentLabels\" colspan=\"2\">";
    strVar += "<span id = \"learnerAtLabel\" class=\"summaryEventsLabelStyle\"></span>";
    strVar += "<span id = \"summaryEventsComponentName\" class=\"summaryEventsContentStyle\"></span>";
    strVar += "</td>";
    strVar += "<td class=\"summaryEventsComponentLabels\" colspan=\"2\">";
    strVar += "<span id = \"learnerTargetLabel\" class=\"summaryEventsLabelStyle\"></span>";
    strVar += "<span id = \"summaryEventsConnectionToName\" class=\"summaryEventsContentStyle\"></span>";
    strVar += "</td>";
    strVar += "</tr>";

    strVar += "<tr>";
    strVar += "<td id=\"goAheadYesButton\" class=\"summaryEventsComponentLabels\" colspan=\"2\">";
    strVar += "<span id = \"goAheadYes\" class=\"summaryEventsLabelStyle\"></span>";
    strVar += "</td>";
    strVar += "<td id=\"goAheadNoButton\" class=\"summaryEventsComponentLabels\" colspan=\"2\">";
    strVar += "<span id = \"goAheadNo\" class=\"summaryEventsLabelStyle\"></span>";
    strVar += "</td>";
    strVar += "</tr>";

    strVar += "<tr>";
    strVar += "<td colspan=\"4\" class=\"evtsBarStyle td\">";
    strVar += "<div id =\"evtsBar\" >";
    strVar += "</div>";
    strVar += "</td>";
    strVar += "</tr>";

    strVar += "<tr>";
    strVar += "<td class=\"summaryEventsComponentLabels summaryEventsComponentLabelsB\" colspan=\"1\" width=\"30%\">";
    strVar += "<span id = \"componentTitle\"></span>";
    strVar += "</td>";
    strVar += "<td class=\"summaryEventsComponentLabels summaryEventsComponentLabelsB\" colspan=\"1\" width=\"70%\">";
    strVar += "<span id = \"eventLabel\"></span>";
    strVar += "</td>";
    strVar += "<td class=\"summaryEventsComponentLabels\" colspan=\"2\" width=\"50%\">";
    strVar += "<span id = \"activate\"></span>";
    strVar += "</td>";
    strVar += "</tr>";







    strVar += "<tr>";
    strVar += "<td colspan=\"4\">";
    strVar += "	<div id=\"summaryEventsTableScroll\">";
    strVar += "		<table border=\"0\" id=\"summaryEventsTable\" width=\"100%\">";
    strVar += "			<tbody>";
    strVar += "			<\/tbody>";
    strVar += "			<tfoot>";
    strVar += "			<\/tfoot>";
    strVar += "		<\/table>";
    strVar += "	<\/div>";
    strVar += "</td>";
    strVar += "</tr>"
    strVar += "<tr>";
    strVar += "<td colspan=\"4\" align=\"center\">";
    strVar += "<div class=\"saveButtons\">"
    strVar += "        <div><input type=\"button\" id = \"cancel\" value=\"Cancel\" /><input type=\"button\" id = \"save\" value=\"Save\" /><input type=\"button\" id = \"deletePath\" value=\"Delete This Path\" /><\/div>";
    strVar += "<\/div>";
    strVar += "</td>";
    strVar += "</tr>"
    strVar += "	<\/table>";
    strVar += "<\/div>";
    strVar += "    <input id=\"connectionId\" name=\"connectionId\" hidden=\"true\"  \/>";

    return strVar;

}


function editableEventRow_v2(eventRecord, connectionId){
    var hreturn;
    var cevt = "cevt."+eventRecord['eventId']+"."+ connectionId;
    hreturn = hreturn + "<tr ><td class='rtcell' align='left'>"+eventRecord['eventLabel']+"</td><td><div class='selectEvt'><select id='"+cevt+"'><option value='0'>Select Action</option>"+getEventSelect(componentRuleOptions, eventRecord['activate'])+"</select></div></td></tr>";

    return hreturn;
}


function editableEventRow_v3(eventRecord, connectionId, goAheadValue, thisComponentId){
    var hreturn="";
    var cevt = "cevt."+eventRecord[ev_event_id]+"."+ eventRecord[ev_connection_id];
    var thisEventIndex = "events."+ eventRecord[ev_event_type];
//    var thisEventLabel = $.t(thisEventIndex);
    var thisEventLabel;
    if(eventRecord[ev_event_type]==correctFibAnswer) {
        if (eventRecord[ev_eventLabel].indexOf(":") > 0) {
            thisEventLabel = $.t(thisEventIndex) + eventRecord[ev_eventLabel].substr(18);
        } else {
            thisEventLabel = $.t(thisEventIndex) + eventRecord[ev_eventLabel];
        }
    }else if(eventRecord[ev_event_type]==tfAnswer) {
        thisEventLabel = $.t(thisEventIndex) + eventRecord[ev_sub_param];
    }else if(eventRecord[ev_event_type]==mcAnswerX){
        thisEventLabel = $.t("events.chosen")+ eventRecord[ev_eventLabel];
    }else{
        thisEventLabel = $.t(thisEventIndex)
    }
    var defaultMayBeApplied = false;
    if(eventRecord[ev_activate]==0 && defaultValueApplied.indexOf(eventRecord[ev_event_type])>0){
        defaultMayBeApplied=true;
    }
    hreturn = "<tr ><td class='rtcell' align='left' width='25%'>"+eventRecord[ev_componentTitle]+"</td><td class='rtcell' align='left' width='25%'>"+thisEventLabel+"</td><td width='50%'><div class='selectEvt'>&#160;&#160;<select id='"+cevt+"'><option value='0'>Select Action</option>"+getEventSelect(getComponentRuleOptions(goAheadValue), eventRecord[ev_activate], defaultMayBeApplied)+"</select></div></td></tr>";
    if(eventRecord[ev_component_id]==thisComponentId && !goAheadValue && eventRecord[ev_event_type]==componentViewed){
        hreturn = hreturn + "<tr ><td class='rtcell' align='left' width='25%'>"+eventRecord[ev_componentTitle]+"</td><td class='rtcell' align='left' width='25%'>Average Score of Scoreable Components:</td><td width='50%'><div class='selectEvt'>&#160;&#160;<select id='"+cevt+"'><option value='0'>Select Action</option>"+getEventSelect(scoreableOptions, eventRecord[ev_activate], defaultMayBeApplied)+"</select></div></td></tr>";
    }
    return hreturn;
}

function getComponentRuleOptions(goAheadValue){
    if(goAheadValue){
        return componentRuleOptionsGoAhead;
    }else{
        return componentRuleOptions;
    }
}

function showThisEvent(goAheadValue,eventType){
    if(goAheadValue){
        if(goAheadView.indexOf(eventType)){
            return true;
        }else{
            return false;
        }
    }else{
        return true;
    }
}

function dgListener(layer){
    var s = parseInt($("#clickStatus").val());
    var layer = layer;
    switch(s){
        case 0:
            layer.event.stopPropagation();
            break;
        case 1:
            $("#clickStatus").val("2");
            drawPathEndPrompt();
            $("#newPathStart").val(layer.name);
            layer.event.stopPropagation();
            break;
        case 2:

            getConfirmConnection("popup3", layer);
            layer.event.stopPropagation();
            break;

    }
}
var getConfirmConnection = function(popName, layer){
    var popName = popName;
    $("#"+popName).html(getConfirmConnectionHtml());
    $("#confirmConnectionPromptId").html($.t('pathDialog.connectionConfigurationPrompt'));
    $("#connectGoAhead").prop('value', $.t('pathDialog.defaultConnection'));
    $("#connectConfigure").prop('value', $.t('pathDialog.manualConfiguration'));
    $("#connectConfigure").on('click',function(){
        newConnection(popName, layer);
    });
    $("#connectCancel").prop('value', $.t('pathDialog.cancelConnection'));
    $("#connectCancel").on('click', function(){
        $("#"+popName).hide();
        var thisContextId = $("#componentContext").val();
        reloadAllComponents(thisContextId, true);
    });
    $("canvas").removeLayer("pathPromptEndMsg");
    $('canvas').drawLayers();
    layer.event.stopPropagation();
    $("#"+popName).show();
};

var getConfirmConnectionHtml = function(){
    var strVar="";
    strVar += "<div id=\"confirmConnectionId\" class=\"pathConfirmCss\"><span id=\"confirmConnectionPromptId\"><\/span><br/>";
    strVar += "<input type=\"button\" id=\"connectGoAhead\" \/><input type=\"button\" id=\"connectConfigure\" \/><input type=\"button\" id=\"connectCancel\" \/></div>";
    return strVar;
}


var newConnection = function(popName, layer){
    $("#"+popName).hide();


    startComponent = findComponent($("#newPathStart").val(), currentComponents);
    instancedStartComponentEval = " new "+startComponent.type+"(startComponent)";
    instancedStartComponent = eval(instancedStartComponentEval);
    endComponent = findComponent(layer.name, currentComponents);
    var thisTransaction = urlBase+insert_this_connection+"?"+debug;
    myData = {startId:startComponent.id, endId:endComponent.id };
    $.ajax({
        type: "POST",
        url: thisTransaction,
        data: myData,
        success: function(msg) {
            var thisId = parseInt(msg);
            var thisConnection = new dgConnection(startComponent, endComponent, thisId);
            thisConnection.draw();
            connections.push(thisConnection);
            $("canvas").removeLayer("pathPromptEndMsg");
            $('canvas').drawLayers();
//                    unShadeTblIcons();
            currentState = STATE_NOT_WAITING_FOR_ANYTHING;
            lineStartLayer = null;
            lineEndLayer = null;
            thisContextId = parseInt($("#componentContext").val());
            startComponentId = parseInt(startComponent.id);
//                    note startComponent needs to be 'new'ed"
//                    startComponent.getPathOptions(startComponent,layer);
            $("#clickStatus").val("0");
            $("#contextBar").show();
            thisConnection.setup(startComponentId, thisContextId, thisId);
        },
        error: function(err) {
            alert(err.toString());
            if (err.status == 200) {
                ParseResult(err);
            }
            else { alert('Error:' + err.responseText + '  Status: ' + err.status); }
            layer.event.stopPropagation();
        }

    });
    layer.event.stopPropagation();
}

function drawPathStartPrompt() {


    $("canvas").drawText({
        layer: true,
        name: "pathPromptStartMsg",
        fillStyle: "#900",
        font: "bold 20pt Trebuchet MS",
        text: "Click on the source component",
        x: 250, y: 90,
        maxWidth: 300
    });
}

function drawPathEndPrompt() {
    $("canvas").removeLayer("pathPromptStartMsg");
    $('canvas').drawLayers();
    $("canvas").drawText({
        layer: true,
        name: "pathPromptEndMsg",
        fillStyle: "#900",
        font: "bold 20pt Trebuchet MS",
        text: "Click on the destination component",
        x: 250, y: 90,
        index:1,
        maxWidth: 300
    });

}

function loadThisComponent(componentId, projectId){
    var p = projectId;
    var c = componentId;
    /*
     $('tr[id^="erow"]').remove();
     $('tr[id^="etableFooterTr"]').remove();
     getAvailableComponents(componentId, projectId);
     */
    $('tr[id^="erow"]').hide();
    var showId = "\"erow."+componentId+"\"";
    $('tr[id^="erow"]').each(function(){
        var t = this.id;
    });
    rowSelector = 'tr[id^='+showId+']';
    $(rowSelector).show();
}


function ActiveListener_dgConnection(){
    $("#contextBar").hide();
    $("#clickStatus").val("1");
    toolListener = function(l){
        dgListener(l);
    }
    removeAllComponents();
    drawAllComponents(currentComponents, false);
//    var curCtx = $("#componentContext").val();
//    reloadAllComponents(curCtx,false);
}


function saveSelectedEvents(connectionId){
    var eventsSelected = new Array();
    var goAheadStatus = false;
    if($("#yesGoAhead").prop('checked')== true){
        goAheadStatus = true;
    }
    $('select[id^="cevt"]').each(function(){
            var thisSelectedEvent = new selectedEvent(this.id, "", "", this.value);
            eventsSelected.push(thisSelectedEvent);
    });
    var jsonEventsSelected = JSON.stringify(eventsSelected);
    myData = {componentEvents: jsonEventsSelected, connectionId:connectionId, goAhead: goAheadStatus};
    var thisTransaction = urlBase+save_selected_events+"?"+debug;

    $.ajax({
        type: "POST",
        url: thisTransaction,
        data: myData,
        success: function(msg) {
            if(msg=='ok'){
                $("#componentEventsEdit").hide();
                var thisContextId = $("#componentContext").val();
                reloadAllComponents(thisContextId, true);
            }
        },
        error: function(err) {
            alert(err.toString());
            if (err.status == 200) {
                ParseResult(err);
            }
            else { alert('Error:' + err.responseText + '  Status: ' + err.status); }
        }

    });





}

function selectedEvent(e, l, a, activate){
    this.evtId = e;
    this.logicalRole = l;
    this.arg = a;
    this.activate = activate;
}

function getEventSelect(selectItems, thisSelectValue, applyDefault){
    selectReturn = "";
    for(i=0;i<selectItems.length;i++){
        thisSelectItem = selectItems[i];
        if(thisSelectItem[1]==thisSelectValue || (applyDefault && thisSelectItem[2])){
            selectReturn = selectReturn +"<option value=\""+thisSelectItem[1]+"\" selected=\"selected\">"+thisSelectItem[0]+"</option>"
        }else{
            selectReturn = selectReturn +"<option value=\""+thisSelectItem[1]+"\">"+thisSelectItem[0]+"</option>"
        }
    }
    return selectReturn;
}

controlIcons.push("dgConnection");
controlFunctions.push(pathClick);