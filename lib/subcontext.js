/**
 * Created by georgepipkin on 12/20/13.
 */

function subcontext(c){
    if(arguments.length>0){
        this.x = c.x;
        this.y = c.y;
        this.icon = "subcontext";
        this.active = false;
        this.title = c.title;
        this.content = c.content;
        this.id = c.id;
        this.context = c.context;
        this.subcontext = c.subcontext;
    }else{
        this.x = 0;
        this.y = 0;
        this.icon = "subcontext";
        this.active = false;
        this.layerName = "";
    }

    this.contentEntry = function(x,y,n,popName,saveContext){
        $("#saveContext").val(saveContext);
        $("#reLoadContext").val($("#subContext").val());
        showNewSubcontextEntryScreen(this,x,y,"entry")};

//    this.contentUpdate = function(l){ showSubContextUpdateScreen(this,l)};
    this.contentEdit = function(thisComponent, layer, connections, popName, saveContext){
        $("#saveContext").val(saveContext);
        $("#reLoadContext").val($("#subContext").val());
        editSubcontextContent(this, thisComponent,layer, connections)};

    this.getPathOptions = function(componentId, contextId, connectionId){
        return getCtxExits(componentId, contextId, connectionId);
    }
    this.editEntry = function(){showNewSubcontextEntryScreen(this,this.x,this.y,"edit")}

    this.entry = function(thisComponent){
        var returnContextUserEvents = function(){
            var thisUserEventsArray = [];
            thisUserEventsArray.push(new userEvent(thisComponent.id, "", contextEntered, thisComponent.elementId));
            return thisUserEventsArray;
        }
        return returnContextUserEvents;
    }

    var showNewSubcontextEntryScreen = function(t,x,y,mode){

        var thisSubcontext = t.context;
        var thisSubcontextId = t.id;
        var thisSubcontextComponent = t;
        if(mode=="entry"){
            $('#popup').html(getSubContextScreen(mode));
        }
        $("#componentX").val(x);
        $("#componentY").val(y);
        $("#cloneSubContext").hide();
        $("#contextLabel").html("Context Name:");
//        $("#contextName").html("This project");
        $("#accessLabel").html("Access:");
        $("#internalAccessLabel").html("Access only from other components in this project");
        $("#urlLabel").html("URL:");
        $("#ltiKeyLabel").html("Key:");
        $("#ltiSecretLabel").html("Secret:");
        $("#contextTitle").val(t.title);
        $("#selectInternalAccess").bind( "click", function() {
            $("#accessType").val("internal");
            $("#urlValue").css( "color", "#bbbbbb" );
            $("#ltiKey").prop('disabled', true);
            $("#ltiSecret").prop('disabled', true);
            $("#ltiKeyLabel").css( "color", "#bbbbbb" );
            $("#ltiSecretLabel").css( "color", "#bbbbbb" );
            $("#urlLabel").css( "color", "#bbbbbb" );
        });
        $("#externalAccessLabel").html("Access using a login or LTI");
        $("#selectExternalAccess").bind( "click", function() {
            $("#accessType").val("external");
            $("#urlValue").css( "color", "red" );
            $("#ltiKey").prop('disabled', false);
            $("#ltiSecret").prop('disabled', false);
            $("#ltiKeyLabel").css( "color", "black" );
            $("#ltiSecretLabel").css( "color", "black" );
            $("#urlLabel").css( "color", "black" );

        });
        $("#bothAccessLabel").html("Access internally or externally (login or LTI)");
        $("#selectBothAccess").bind( "click", function() {
            $("#accessType").val("both");
            $("#urlValue").css( "color", "red" );
            $("#ltiKey").prop('disabled', false);
            $("#ltiSecret").prop('disabled', false);
            $("#ltiKeyLabel").css( "color", "black" );
            $("#ltiSecretLabel").css( "color", "black" );
            $("#urlLabel").css( "color", "black" );
        });
        if(mode=='entry'){
            $("#urlValue").html("http://dgpath.com/project");
            $("#selectInternalAccess").prop('checked', true);
            $("#selectExternalAccess").prop('checked', false);
            $("#selectBothAccess").prop('checked', false);
            $("#accessType").val("internal");
            $("#urlValue").css( "color", "#bbbbbb" );
            $("#ltiKey").prop('disabled', true);
            $("#ltiSecret").prop('disabled', true);
            $("#ltiKeyLabel").css( "color", "#bbbbbb" );
            $("#ltiSecretLabel").css( "color", "#bbbbbb" );
            $("#urlLabel").css( "color", "#bbbbbb" );
        }else{
            $("#urlValue").html(t.accessURL);
            $("#componentX").val(t.x);
            $("#componentY").val(t.y);
            $("#componentId").val(t.id);
            $("#subContext").val(t.context);
            $("#doorId").val(t.doorId);
            $("#ltiKey").val(t.key);
            $("#ltiSecret").val(t.secret);
            if(t.accessType=='internal'){
                $("#selectInternalAccess").prop('checked', true);
                $("#selectExternalAccess").prop('checked', false);
                $("#selectBothAccess").prop('checked', false);
                $("#accessType").val("internal");
                $("#urlValue").css( "color", "#bbbbbb" );
                $("#ltiKey").prop('disabled', true);
                $("#ltiSecret").prop('disabled', true);
                $("#ltiKeyLabel").css( "color", "#bbbbbb" );
                $("#ltiSecretLabel").css( "color", "#bbbbbb" );
                $("#urlLabel").css( "color", "#bbbbbb" );
            }else if(t.accessType=='external'){
                $("#selectInternalAccess").prop('checked', false);
                $("#selectExternalAccess").prop('checked', true);
                $("#selectBothAccess").prop('checked', false);

                $("#accessType").val("external");
                $("#urlValue").css( "color", "red" );
                $("#ltiKey").prop('disabled', false);
                $("#ltiSecret").prop('disabled', false);
                $("#ltiKeyLabel").css( "color", "black" );
                $("#ltiSecretLabel").css( "color", "black" );
                $("#urlLabel").css( "color", "black" );
            }else if(t.accessType=='both'){
                $("#selectInternalAccess").prop('checked', false);
                $("#selectExternalAccess").prop('checked', false);
                $("#selectBothAccess").prop('checked', true);

                $("#accessType").val("both");
                $("#urlValue").css( "color", "red" );
                $("#ltiKey").prop('disabled', false);
                $("#ltiSecret").prop('disabled', false);
                $("#ltiKeyLabel").css( "color", "black" );
                $("#ltiSecretLabel").css( "color", "black" );
                $("#urlLabel").css( "color", "black" );
            }else{
                $("#selectInternalAccess").prop('checked', true);
                $("#selectExternalAccess").prop('checked', false);
                $("#selectBothAccess").prop('checked', false);
                $("#accessType").val("internal");
                $("#urlValue").css( "color", "#bbbbbb" );
                $("#ltiKey").prop('disabled', true);
                $("#ltiSecret").prop('disabled', true);
                $("#ltiKeyLabel").css( "color", "#bbbbbb" );
                $("#ltiSecretLabel").css( "color", "#bbbbbb" );
                $("#urlLabel").css( "color", "#bbbbbb" );
            }
        }
        $("#cloneSubContext").prop('value',$.t("libraryControlBar.cloneSubContext"));
        $("#cloneSubContext").show();
        $("#cloneSubContext").on('click', function() {
            cloneThis("popup3", thisSubcontextComponent, CLONE_TO);
        });

        $('#popup').show();
        $('#cancel').on('click', function(){
            cancelEntry();
        });
        if(mode=="entry"){
            $("#copySubContext").prop('value',$.t("libraryControlBar.copySubContext"));
            $("#copySubContext").on('click', function(){
                cloneThis("popup3", thisSubcontextComponent, CLONE_FROM);
            });
            $("#copySubContext").show();
            $('#createSubContext').on('click', function(){
                createAndEnterSubContext();
            })
        }else{
            $("#copySubContext").hide();
            $('#enterSubContext').on('click', function(){
                enterSubContext();
            })
            $('#updateSubContext').on('click', function(){
                updateSubContextEntryConfiguration();
            })
            $('#deleteSubContext').on('click', function(){
                deleteSubContext();
            })
        }
//        $("#pathSelect").hide();

    }






    var getSubContextScreen = function(mode){
        var strVar="";
        strVar += "    <div id=\"componentEdit\" class=\"doorComponent\">";
        strVar += "        <table>";
        strVar += "            <tr>";
        strVar += "                <td width=\"100%\" colspan=\"4\">";
        strVar += "                    <span class=\"hdr3\" id=\"contextLabel\"><\/span><span class=\"hdr2\" id=\"contextName\"><input id=\"contextTitle\" name=\"contextTitle\" size=\"40\" placeholder=\"Enter component name here....\"><\/span>";
        strVar += "                <\/td>";
        strVar += "             <\/tr>";
        strVar += "            <tr>";
        strVar += "                <td width=\"20%\" colspan=\"1\">";
        strVar += "                    <span class=\"hdr3\" id=\"accessLabel\"><\/span>";
        strVar += "                <\/td>";
        strVar += "                <td width=\"10%\" colspan = \"1\">";
        strVar += "                    <input type=\"radio\" value=\"internal\" id=\"selectInternalAccess\"  name=\"selectAccess\" \/>";
        strVar += "                <\/td>";
        strVar += "                <td width=\"70%\" colspan=\"2\">";
        strVar += "                    <span class=\"hdr12\" id=\"internalAccessLabel\"><\/span>";
        strVar += "                <\/td>";
        strVar += "            <\/tr>";
        strVar += "            <tr>";
        strVar += "                <td width=\"20%\" colspan=\"1\">";
        strVar += "";
        strVar += "                <\/td>";
        strVar += "                <td width=\"10%\" colspan = \"1\">";
        strVar += "                    <input type=\"radio\" value=\"external\" id=\"selectExternalAccess\"  name=\"selectAccess\" \/>";
        strVar += "                <\/td>";
        strVar += "                <td width=\"70%\" colspan=\"2\">";
        strVar += "                    <span class=\"hdr12\" id=\"externalAccessLabel\"><\/span>";
        strVar += "                <\/td>";
        strVar += "            <\/tr>";
        strVar += "            <tr>";
        strVar += "                <td width=\"20%\" colspan=\"1\">";
        strVar += "";
        strVar += "                <\/td>";
        strVar += "                <td width=\"10%\" colspan = \"1\">";
        strVar += "                    <input type=\"radio\" value=\"both\" id=\"selectBothAccess\"  name=\"selectAccess\" \/>";
        strVar += "                <\/td>";
        strVar += "                <td width=\"70%\" colspan=\"2\">";
        strVar += "                    <span class=\"hdr12\" id=\"bothAccessLabel\"><\/span>";
        strVar += "                <\/td>";
        strVar += "            <\/tr>";
        strVar += "            <tr>";
        strVar += "                <td width=\"30%\" colspan=\"1\">";
        strVar += "";
        strVar += "                <\/td>";
        strVar += "                <td width=\"70%\" colspan=\"3\">";
        strVar += "                    <span class=\"hdr12\" id=\"urlLabel\"><\/span><span class=\"hdr13\" id=\"urlValue\"><\/span>";
        strVar += "                <\/td>";
        strVar += "            <\/tr>";
        strVar += "            <tr>";
        strVar += "                <td width=\"30%\" colspan=\"1\">";
        strVar += "";
        strVar += "                <\/td>";
        strVar += "                <td width=\"70%\" colspan=\"3\">";
        strVar += "                    <span class=\"hdr12\" id=\"ltiKeyLabel\"><\/span><span class=\"hdr13\" id=\"ltiKeySpan\"><input type=\"text\" id=\"ltiKey\" name=\"ltiKey\" size=\"20\" maxlength=\"40\" \/><\/span>";
        strVar += "                <\/td>";
        strVar += "            <\/tr>";
        strVar += "            <tr>";
        strVar += "                <td width=\"30%\" colspan=\"1\">";
        strVar += "";
        strVar += "                <\/td>";
        strVar += "                <td width=\"70%\" colspan=\"3\">";
        strVar += "                    <span class=\"hdr12\" id=\"ltiSecretLabel\"><\/span><span class=\"hdr13\" id=\"urlSecretSpan\"><input type=\"text\" id=\"ltiSecret\" name=\"ltiSecret\" size=\"20\" maxlength=\"40\" \/><\/span>";
        strVar += "                <\/td>";
        strVar += "            <\/tr>";
        strVar += "";
        strVar += "        <\/table>";
        strVar += "         <br/><br/>";
        strVar += "         <div class=\"docSubmit\" id=\"addSubcontextSubmit\">";
        if(mode=="entry"){
            strVar += "             <input type=\"submit\" id= \"createSubContext\" value=\"Create and Enter this Sub-Context\"  \/>";
            strVar += "             <input type=\"submit\" id= \"copySubContext\"  \/>";
            strVar += "             <input type=\"submit\" id = \"cancel\" value=\"Cancel\"  \/>";
        }else{
            strVar += "             <input type=\"submit\" id = \"enterSubContext\" value=\"Enter this Sub-Context\" \/>";
            strVar += "             <input type=\"submit\" id = \"updateSubContext\" value=\"Update and Enter this Sub-Context\" \/>";
            strVar += "             <input type=\"submit\" id = \"deleteSubContext\" value=\"Remove This Sub-Context\"  \/>";
            strVar += "             <input type=\"button\" id = \"cloneSubContext\" \/>";
            strVar += "             <input type=\"submit\" id = \"cancel\" value=\"Cancel\"  \/>";
            strVar += "             <div id = \"pathSelect\">"
            strVar += "                 <select name=\"pathSelectDropDown\" id = \"pathSelectDropDown\" >";
            strVar += "                     <option value=\"\">Select A Path To Edit<\/option>";
            strVar += "                 <\/select>";
            strVar += "             </div>";
        }

        strVar += "         <\/div>";
        strVar += "         <div class=\"docSubmit\" id=\"pathSelect\">";
        strVar += "         <\/div>";
        strVar += "    <\/div>";
        strVar += "    <input type=\"hidden\" id=\"accessType\" name=\"accessType\" \/>";


        strVar += "    <input id=\"componentX\" name=\"componentX\" hidden=\"true\"  \/>";
        strVar += "    <input id=\"componentY\" name=\"componentY\" hidden=\"true\" \/>";
        strVar += "    <input id=\"componentType\" name=\"componentType\" hidden=\"true\" value=\"subcontext\" \/>";
        strVar += "    <input id=\"componentId\" name=\"componentId\" hidden=\"true\" hidden=\"true\" \/>";
        strVar += "    <input id=\"componentContent\" name=\"componentContent\" hidden=\"true\" \/>";
        strVar += "    <input id=\"subContext\" name=\"subContext\" hidden=\"true\" \/>";
        strVar += "    <input id=\"doorId\" name=\"doorId\" hidden=\"true\" \/>";
        strVar += "    <input id=\"debug\" name=\"debug\" hidden=\"true\" \/>";


        strVar += "";
        return strVar;

    }

    var getPathSelectHTML = function(componentId, contextId){
        var strVar="";
        strVar += "         <select name=\"pathSelectDropDown\" id = \"pathSelectDropDown\" onchange=\" editPath("+componentId+","+contextId+");\">";
        strVar += "             <option value=\"\">Select A Path To Edit<\/option>";
        strVar += "         <\/select>";
        return strVar;

    }

    var editSubcontextContent;
    editSubcontextContent = function (t, thisComponent, layer, connections) {

        $('#popup').html(getSubContextScreen("edit"));
        $('#pathSelectDropDown').on('change', function() {
            editPath($("#componentId").val(),$("#subContext").val());
        });
        setPathSelect(connections);
        var thisTransaction = urlBase + load_subcontext_door + "?" + debug;
        var thisSubcontext = thisComponent.subcontext;
        var myData = {contextId: thisSubcontext};
        var tx = 1;
        $.ajax({
            type: "POST",
            url: thisTransaction,
            data: myData,
            success: function (msg) {
                doorResults = JSON.parse(msg);
                tc = getThisComponent();
                thisSubContext = new subcontext(tc);
                edContent = JSON.parse(doorResults.entryDoorConfiguration.content);
                thisSubContext.entryDoorTitle = doorResults.entryDoorConfiguration.title;
                thisSubContext.accessType = edContent.accessType;
                thisSubContext.context = doorResults.entryDoorConfiguration.context;
                thisSubContext.doorId = doorResults.entryDoorConfiguration.id;
                thisSubContext.accessURL = edContent.accessURL;
                thisSubContext.key = edContent.key;
                thisSubContext.secret = edContent.secret;
                thisSubContext.editEntry();


            },
            error: function (err) {
                alert(err.toString());
                if (err.status == 200) {
                    ParseResult(err);
                }
                else {
                    alert('Error:' + err.responseText + '  Status: ' + err.status);
                }
            }

        });

        var getThisComponent = function () {
            return thisComponent;
        }


//    $('#popup').html(showContextUpdateScreen(t.layerName,thisComponent.x,thisComponent.y,thisComponent.id, $("#componentContext").val(), thisComponent.subcontext));
//    setPathSelect(connections);

//    setupThisProject(c.subcontext);

//    $("#subContext").val(c.subcontext);
//    getComponentForEdit(c.id, showContextUpdateScreen);
//    $('#popup').show();
    };

}

subcontext.prototype = new component();

function showSubContextEntryScreen(t,x,y,n){
    $('#popup').html(subContextEntryScreen(t.layerName,x,y,n));
    $('#popup').show();
}

function subContextEntryScreen(layerName,x,y,n){
    var strVar="";
    strVar += "    <div id=\"componentEdit\" class=\"contextComponent\">";
    strVar += "            <div class=\"hdr3\">";
    strVar += "                Sub-Context:<input id=\"subcontextTitle\" name=\"subcontextTitle\" size=\"40\" placeholder=\"Enter Sub-Context name here....\">";
    strVar += "            <\/div>";
    strVar += "         <div class=\"hdr2\">";
    strVar += "             <input type=\"radio\" id = \"sequencecomp\" name=\"sequencecomp\" checked=\"checked\" value=\"seq\"\/>Sequence all connected components<br\/>";
    strVar += "             <input type=\"radio\" id = \"sequencecomp\" name=\"sequencecomp\" value=\"noseq\"\/>Present connected components in one screen<br\/>";
    strVar += "        <\/div>";
    strVar += "        <br/>"
    strVar += "        <div class=\"docSubmit\" id=\"addDocSubmit\">";
    strVar += "            <input type=\"submit\" value=\"Create and Enter this Sub-Context\"  onclick=\"createAndEnterSubContext(); return false;\"\/>";
    strVar += "            <input type=\"submit\" value=\"Cancel\"  onclick=\"cancelEntry(); return false;\"\/>";
    strVar += "        <\/div>";
    strVar += "    <\/div>";
    strVar += "    <input id=\"componentX\" name=\"componentX\" hidden=\"true\" value=\""+x+"\" \/>";
    strVar += "    <input id=\"componentY\" name=\"componentY\" hidden=\"true\" value=\""+y+"\"\/>";
    strVar += "    <input id=\"componentType\" name=\"componentType\" hidden=\"true\" value=\"subcontext\" \/>";
    strVar += "    <input id=\"componentId\" name=\"componentId\" hidden=\"true\" hidden=\"true\" value=\""+n+"\"\/>";
    strVar += "    <input id=\"componentContent\" name=\"componentContent\" hidden=\"true\" \/>";
    strVar += "    <input id=\"debug\" name=\"debug\" hidden=\"true\" \/>";

    strVar += "";
    return strVar;
}

var showContextUpdateScreen = function(layerName,x,y,componentId,contextId, subcontextId){
    var strVar="";
    strVar += "    <div id=\"componentEdit\" class=\"contextComponent\">";
    strVar += "            <div class=\"hdr3\">";
    strVar += "                Sub-Context:<input id=\"subcontextTitle\" name=\"subcontextTitle\" size=\"40\" placeholder=\"Enter Sub-Context name here....\">";
    strVar += "            <\/div>";
    strVar += "         <div class=\"hdr2\">";
    strVar += "             <input type=\"radio\" id = \"sequencecomp\" name=\"sequencecomp\" checked=\"checked\" value=\"seq\"\/>Sequence all connected components<br\/>";
    strVar += "             <input type=\"radio\" id = \"sequencecomp\" name=\"sequencecomp\" value=\"noseq\"\/>Present connected components in one screen<br\/>";
    strVar += "        <\/div>";
    strVar += "        <br/>"
    strVar += "        <div class=\"docSubmit\" id=\"addDocSubmit\">";
    strVar += "            <input type=\"submit\" value=\"Enter this Sub-Context\"  onclick=\"setupThisProject("+subcontextId+"); return false;\"\/>";
    strVar += "            <input type=\"submit\" value=\"Cancel\"  onclick=\"cancelEntry(); return false;\"\/>";
    strVar += "         <select name=\"pathSelectDropDown\" id = \"pathSelectDropDown\" onchange=\" editPath("+componentId+","+contextId+");\">";
    strVar += "             <option value=\"\">Select A Path To Edit<\/option>";
    strVar += "         <\/select>";
    strVar += "        <\/div>";
    strVar += "    <\/div>";
    strVar += "    <input id=\"componentX\" name=\"componentX\" hidden=\"true\" value=\""+x+"\" \/>";
    strVar += "    <input id=\"componentY\" name=\"componentY\" hidden=\"true\" value=\""+y+"\"\/>";
    strVar += "    <input id=\"componentType\" name=\"componentType\" hidden=\"true\" value=\""+subcontextId+"\" \/>";
    strVar += "    <input id=\"componentId\" name=\"componentId\" hidden=\"true\" hidden=\"true\" value=\""+componentId+"\"\/>";
    strVar += "    <input id=\"componentContent\" name=\"componentContent\" hidden=\"true\" \/>";
    strVar += "    <input id=\"debug\" name=\"debug\" hidden=\"true\" \/>";

    strVar += "";
    return strVar;

}



function getCtxExits(componentId, contextId, connectionId){

    var myData = {componentId: componentId, connectionId: connectionId};
    var thisTransaction = urlBase+get_context_exits+"?"+debug;


    $.ajax({
        type: "POST",
        url: thisTransaction,
        data: myData,
        success: function(msg) {
            var contextExits = eval(msg);
            for(var e=0; e < contextExits.length; e++){
                var thisExit = contextExits[e];
                thisRow = editableEventRow(thisExit);
                $('#componentEventsTable tbody').append(thisRow);

            };
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


function createAndEnterSubContext(){
    var xp = $("#componentX").val();
    var yp = $("#componentY").val();
    var tit = $("#contextTitle").val();
    var ctx = $("#componentContext").val();
    var cprj = $("#currentProjectId").val();
    var newContextTitle = $("#contextTitle").val();

    var thisSubcontextProperties = {sequencecomp:$("#sequencecomp").val()};
    var contextProperties = JSON.stringify(thisSubcontextProperties);

    var subcontextEntryDoor = new EntryDoor($("#contextTitle").val(), $("#accessType").val(), $("#urlValue").html(), $("#ltiKey").val(), $("#secret").val());
    var subcontextEntryDoorContent = JSON.stringify(subcontextEntryDoor);

    var myData = {xpos:xp, ypos:yp, title:tit, context:ctx, project: cprj, content:contextProperties, entryDoorContent:subcontextEntryDoorContent};
    var thisTransaction = urlBase+insert_new_context+"?"+debug;

    $.ajax({
        type: "POST",
        url: thisTransaction,
        data: myData,
        success: function(msg) {
            newContextId = eval(msg);
            $("#componentContext").val(newContextId);
            $("#subContext").val(newContextId);
            $("#saveContext").val(newContextId);
            $("#reLoadContext").val(newContextId);
            inContextNow = newContextId;
            computeNewProjectStack(newContextId, newContextTitle);
            reloadAllComponents(newContextId);
            $('#popup').hide();

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

function enterSubContext (){
    $("#subContext").val(thisSubContext.context);
    $("#saveContext").val(thisSubContext.context);
    $("#reLoadContext").val(thisSubContext.context);
    inContextNow = thisSubContext.context;
    setupThisProject(thisSubContext.context);
}

function deleteSubContext(){
//    $("#subContext").val(thisSubContext.context);
//    $("#saveContext").val(thisSubContext.context);
//    $("#reLoadContext").val(thisSubContext.context);
//    inContextNow = thisSubContext.context;
    deleteComponent(thisSubContext.id, thisSubContext.title, "false");

}

var updateSubContextEntryConfiguration;
updateSubContextEntryConfiguration = function(){
    var subContextTitle = $("#contextTitle").val();
    var accessType;
    if($("#selectInternalAccess").prop('checked')){
        accessType = 'internal';
    }else if($("#selectExternalAccess").prop('checked')){
        accessType = 'external';
    }else if($("#selectBothAccess").prop('checked')){
        accessType = 'both';
    }else{
        accessType = 'internal';
    }
    var thisLtiKey = $("#ltiKey").val();
    var thisLtiSecret = $("#ltiSecret").val();
    var thisSubContextComponentId = $("#componentId").val();
    var thisSubContextDoorId = $("#doorId").val();
    var subcontextEntryDoor = new EntryDoor(subContextTitle, accessType, $("#urlValue").html(), thisLtiKey, thisLtiSecret);
    var subcontextEntryDoorContent = JSON.stringify(subcontextEntryDoor);
    var thisSubContextId = $("#subContext").val();
    var myData = {doorId:thisSubContextDoorId, title: subContextTitle, doorConfig: subcontextEntryDoorContent, subContextComponentId: thisSubContextComponentId, subContextId:thisSubContextId};
    var thisTransaction = urlBase+update_subcontext_configuration+"?"+debug;
    $.ajax({
        type: "POST",
        url: thisTransaction,
        data: myData,
        success: function(msg) {
            $('#popup').hide();
            reloadAllComponents($("#subContext").val());
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








toolIcons.push("subcontext");
