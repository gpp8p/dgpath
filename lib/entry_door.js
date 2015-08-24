/**
 * Created by georgepipkin on 12/13/13.
 */


function entry_door(loadedComponent){
    if(typeof loadedComponent=="undefined"){
        this.x = 0;
        this.y = 0;
        this.icon = "entry_door";
        this.active = false;
        this.layerName = "";
        this.title = "Entry:";
        this.accessType = "internal";
        this.accessURL = "http://dgpath.com/project";
        this.key="";
        this.secret="";

/*
        this.directAccess = "false";
        this.loginRequired = "true";
        this.accessLti = "false";
        this.ltiUrl = "";
        this.ltiKey = "";
        this.ltiSecret = "";
        this.stopOnEntry = "false";
        this.showPage = "false";
        this.entryPage = "";
        this.projectTitle = "";
        var newEntryContent = new EntryDoor(this.directAccess, this.loginRequired, this.accessLti, this.ltiUrl, this.ltiKey, this.ltiSecret, this.stopOnEntry, this.showPage, this.entryPage, this.projectTitle);
        this.content = JSON.stringify(newEntryContent);
*/
    }else{
        this.title = loadedComponent['title'];
        this.connections = loadedComponent['connections'];
        this.context = loadedComponent['context'];
        this.id = loadedComponent['id'];
        this.icon = "entry_door";
        this.type = "entry_door";
        this.x = loadedComponent['x'];
        this.y = loadedComponent['y'];
        this.id = loadedComponent['id'];
        var loadedContent = loadedComponent['content'];
        if(loadedContent!=null && loadedContent.length>0){
            var parsedContent = JSON.parse(loadedContent);
            /*
            this.directAccess = parsedContent['directAccess'];
            this.loginRequired = parsedContent['loginRequired'];
            this.accessLti = parsedContent['accessLti'];
            this.ltiUrl = parsedContent['ltiUrl'];
            this.ltiSecret = parsedContent['ltiSecret'];
            this.stopOnEntry = parsedContent['stopOnEntry'];
            this.showPage = parsedContent['showPage'];
            this.entryPage = parsedContent['entryPage'];
            this.projectTitle = parsedContent['projectTitle'];
            */
            this.title = parsedContent['title'];
            this.accessType = parsedContent['accessType'];
            this.accessURL = parsedContent['accessURL'];
            this.key = parsedContent['key'];
            this.secret = parsedContent['secret'];
        }else{
            this.title = "Entry:";
            this.accessType = "internal";
            this.accessURL = "http://dgpath.com/project";
            this.key="";
            this.secret="";

            /*
            this.directAccess = "false";
            this.loginRequired = "true";
            this.accessLti = "false";
            this.ltiUrl = "";
            this.ltiKey = "";
            this.ltiSecret = "";
            this.stopOnEntry = "false";
            this.showPage = "false";
            this.entryPage = "";
            this.projectTitle = "";
            var newEntryContent = new EntryDoor(this.directAccess, this.loginRequired, this.accessLti, this.ltiUrl, this.ltiKey, this.ltiSecret, this.stopOnEntry, this.showPage, this.entryPage, this.projectTitle);
            this.content = JSON.stringify(newEntryContent);
        */
        }
    }
//    this.contentEntry = function(x,y,n){ showEdEntryScreen(this,x,y,n)};
      this.contentEntry = function(x,y,popName,saveContext){
          $("#saveContext").val(saveContext);
          $("#reLoadContext").val($("#subContext").val());
          showEntryDoor(this,x,y,"entry")};
    this.contentUpdate = function(l){ updateEntryDoor(l)};
//    this.contentEdit = function(thisComponent,layer, connections){ editEdContent(this,this,layer, connections)};
    this.contentEdit = function(thisComponent,layer, connections, popName, saveContext){
        $("#saveContext").val(saveContext);
        $("#reLoadContext").val($("#subContext").val());
        editEntryDoor(thisComponent, connections)};
    this.getPathOptions = function(componentId, contextId, connectionId){
        return [];
    }

    this.libraryEdit = function(thisComponent){
        setupEdit(thisCompopnent,"popup");
    }


    var setupEdit = function(thisComponent, popName){
        $("#"+popName).html(entryDoorHTML());
        $("#cancel").on("click", function(){
            setupThisProject(thisComponent.context);
            $("#"+popName).html("");
            $("#"+popName).hide();
        });
        $("#save").on("click", function(){
            $("#"+popName).hide();
            updateEntryDoor();
        });
        $("#contextLabel").html("Entrance to:");
        if(typeof thisComponent.projectTitle=="undefined"){
            $("#contextName").html(thisComponent.title);
        }else{
            $("#contextName").html(thisComponent.projectTitle);
        }
        $("#accessLabel").html("Access:");
        $("#internalAccessLabel").html("Access only from other components in this project");
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
        $("#urlLabel").html("Access URL :");

        $("#ltiKeyLabel").html("LTI Key:");
        $("#ltiSecretLabel").html("LTI Secret:");
        $("#componentX").val(thisComponent.x);
        $("#componentY").val(thisComponent.y);
        $("#componentId").val(thisComponent.id);
        $("#subContext").val(thisComponent.context);
        $("#componentType").val(thisComponent.type);
        $("#ltiKey").val(thisComponent.key);
        $("#ltiSecret").val(thisComponent.secret);
        $("#urlValue").html(thisComponent.accessURL);
        if(thisComponent.accessType=='internal'){
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
        }else if(thisComponent.accessType=='external'){
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
        }else if(thisComponent.accessType=='both'){
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
        $("#"+popName).show();
    }

        var showEntryDoor = function(t,x,y,mode){
        $('#popup').html(getEntryDoorHtml(x, y, t.id, mode));
        $("#contextLabel").html("Entrance to:");
        if(typeof t.projectTitle=="undefined"){
            $("#contextName").html(t.title);
        }else{
            $("#contextName").html(t.projectTitle);
        }
        $("#accessLabel").html("Access:");
        $("#internalAccessLabel").html("Access only from other components in this project");
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
        $("#urlLabel").html("Access URL :");

        $("#ltiKeyLabel").html("LTI Key:");
        $("#ltiSecretLabel").html("LTI Secret:");
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
            $("#componentX").val(t.x);
            $("#componentY").val(t.y);
            $("#componentId").val(t.id);
            $("#subContext").val(t.context);
            $("#ltiKey").val(t.key);
            $("#ltiSecret").val(t.secret);
            $("#urlValue").html(t.accessURL);
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


    }

    var editEntryDoor = function(thisComponent, connections){
        setupEdit(thisComponent,"popup");
        $("#pathSelectDiv").html(getPathSelectHtml());
        setPathSelect(connections);
        $("#pathSelectDropDown").on('change', function(){
            editPath(thisComponent.id, thisComponent.context);
        });
    }

    var entryDoorHTML = function(){
        var strVar="";
        strVar += "    <div id=\"componentEdit\" class=\"doorComponent\">";
        strVar += "        <table>";
        strVar += "            <tr>";
        strVar += "                <td width=\"100%\" colspan=\"4\">";
        strVar += "                    <span class=\"hdr3\" id=\"contextLabel\"><\/span><span class=\"hdr4\" id=\"contextName\"><\/span>";
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
        strVar += "        <div class=\"docSubmit\" id=\"addEntrySubmit\">";
        strVar += "            <input type=\"submit\" value=\"Save \" id=\"save\" \/>";
        strVar += "            <input type=\"submit\" value=\"Cancel\" id=\"cancel\"\/>";
        strVar += "        <\/div>";
        strVar += "        <div id = \"pathSelectDiv\">";
        strVar += "        <\/div>";
        strVar += "    <input id=\"componentX\" name=\"componentX\" hidden=\"true\"  \/>";
        strVar += "    <input id=\"componentY\" name=\"componentY\" hidden=\"true\" \/>";
        strVar += "    <input id=\"componentType\" name=\"componentType\" hidden=\"true\" value=\"doc\" \/>";
        strVar += "    <input id=\"componentId\" name=\"componentId\" hidden=\"true\" hidden=\"true\" \/>";
        strVar += "    <input id=\"componentContent\" name=\"componentContent\" hidden=\"true\" \/>";
        strVar += "    <input id=\"debug\" name=\"debug\" hidden=\"true\" \/>";
        strVar += "";
        return strVar;
    }




    var getEntryDoorHtml = function(x,y,layerName,mode){
        var strVar="";
        strVar += "    <div id=\"componentEdit\" class=\"doorComponent\">";
        strVar += "        <table>";
        strVar += "            <tr>";
        strVar += "                <td width=\"100%\" colspan=\"4\">";
        strVar += "                    <span class=\"hdr3\" id=\"contextLabel\"><\/span><span class=\"hdr4\" id=\"contextName\"><\/span>";
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
        strVar += "             <input type=\"submit\" value=\"Update\" onclick=\"updateExistingComponent("+layerName+",'entry_door'); return false;\" \/>";
        strVar += "             <input type=\"submit\" value=\"Cancel\" onclick=\"cancelEntry(); return false;\" \/>";
        strVar += "         <\/div>";
        strVar += "         <div class=\"docSubmit\" id=\"pathSelect\">";
        strVar += "         <\/div>";
        strVar += "    <\/div>";
        strVar += "    <input type=\"hidden\" id=\"accessType\" name=\"accessType\" \/>";
        strVar += "    <input id=\"componentX\" name=\"componentX\" hidden=\"true\" value=\""+x+"\" \/>";
        strVar += "    <input id=\"componentY\" name=\"componentY\" hidden=\"true\" value=\""+y+"\"\/>";
        strVar += "    <input id=\"componentType\" name=\"componentType\" hidden=\"true\" value=\"entry_door\" \/>";
        strVar += "    <input id=\"componentId\" name=\"componentId\" hidden=\"true\" hidden=\"true\" value=\""+layerName+"\"\/>";
        strVar += "    <input id=\"componentContent\" name=\"componentContent\" hidden=\"true\" \/>";
        strVar += "    <input id=\"componentTitle\" name=\"componentTitle\" hidden=\"true\" \/>";
        strVar += "    <input id=\"debug\" name=\"debug\" hidden=\"true\" \/>";
        strVar += "<\/body>";
        strVar += "";
        return strVar;
    }

    var updateEntryDoor = function(componentId){
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
        var thisEntryDoor = new EntryDoor($("#contextName").html(), accessType, $("#urlValue").html(), thisLtiKey, thisLtiSecret);
        var jsonEntryDoor = JSON.stringify(thisEntryDoor);
        myData = {content: jsonEntryDoor, id: componentId };
        updateComponent($("#componentX").val(), $("#componentY").val(), $("#componentType").val(), "Entrance", jsonEntryDoor, $("#componentContext").val(), $("#componentId").val(), $("#saveContext").val());

    }

    this.entry = function(thisComponent){
        var returnEntryDoorUserEvents = function(){
            var thisUserEventsArray = [];
            thisUserEventsArray.push(new userEvent(thisComponent.id, "", entryDoorEntered, thisComponent.elementId));
            return thisUserEventsArray;
        }
        return returnEntryDoorUserEvents;
    }





}

entry_door.prototype = new component();

function showEdEntryScreen(t,x,y,n){
    $('#popup').html(getEdUpdateHTML(x, y, t.id));
//    $('#popup').html(getEdEntryHTML(t.layerName,x,y,n));
    $("#doorEdit").show();
    $("#contextTitle").append(t.title);
    $("#cTitle").val(t.title);
    $("#basiclti").attr('checked', true);
    $("#accessviaurl").attr('checked', true);
    $("#stopentercb").attr('checked', true);
    $("#ltisecretlabel").css( "color", "blue" );
    $("#basicltisecret").prop('disabled', false);
    $("#ltikeylabel").css( "color", "blue" );
    $("#basicltikey").prop('disabled', false);
    $("#basicltikey").val('');
    $("#basicltisecret").val('');
    $("#loginrequiredlabel").css( "color", "blue" );
    $("#loginrequired").attr("disabled", false);
    $("#docComponentId").val(t.id);
    $("#componentTitle").val(t.title);
    $("#projectTitle").append(t.projectTitle);
    $("#pathSelectDropDown").hide();
    var newProjectStackLabels = $("#projectContextStackLabels").val()+"<a onclick=\"gotoContext("+$("#componentContext").val()+")\" >"+ t.projectTitle+"</a>";
    var newProjectStack = $("#projectContextStack").val()+$("#componentContext").val();
    $("#projectContextStackLabels").val(newProjectStackLabels);
    $("#projectContextStack").val(newProjectStack);
    var ltiTarget = LTI_ENTRANCE+"?componentId="+ t.id;
    $("#ltiurl").append(ltiTarget);
    ed = CKEDITOR.replace("ctxIntro",
        {
            height:"100", width:"800",
            toolbar :
                [
                    { name: 'basicstyles', items : [ 'Bold','Italic','Strike','-','RemoveFormat' ] },
                    { name: 'clipboard', items : [ 'Cut','Copy','Paste','PasteText','PasteFromWord','-','Undo','Redo' ] },
                    { name: 'insert', items : [ 'Image','Flash','HorizontalRule','Smiley','SpecialChar','PageBreak' ] },
                    { name: 'tools', items : [ 'Maximize','-','About' ] }
                ]
        });
}
function getEtyExits(thisComponent,l){
    return [];
}

function showEdUpdateScreen(t,l){
    $('#popup').html(getEdUpdateHTML(l.eventX, l.eventY, l.name));
    setPathSelect(connections);
    ed = CKEDITOR.replace("ctxIntro",
        {
            height:"100", width:"800",
            toolbar :
                [
                    { name: 'basicstyles', items : [ 'Bold','Italic','Strike','-','RemoveFormat' ] },
                    { name: 'clipboard', items : [ 'Cut','Copy','Paste','PasteText','PasteFromWord','-','Undo','Redo' ] },
                    { name: 'insert', items : [ 'Image','Flash','HorizontalRule','Smiley','SpecialChar','PageBreak' ] },
                    { name: 'tools', items : [ 'Maximize','-','About' ] }
                ]
        });
}

function editEdContent(t,thisComponent,l, connections){


    thisComponentContent = jQuery.parseJSON(thisComponent['content']);

    spage=false;
    ckactive=false;
    adir=false;
    alti=false;
    projectTitle = thisComponent['projectName'];
    componentTitle = thisComponent['title'];
    directAccess = thisComponentContent.directAccess;
    loginRequired = thisComponentContent.loginRequired;
    accessLti = thisComponentContent.accessLti;
    ltiUrl = thisComponent['ltiUrl'];
    ltiKey = thisComponentContent.ltiKey;
    ltiSecret = thisComponentContent.ltiSecret;
    stopOnEntry = thisComponentContent.stopOnEntry;
    showPage = thisComponentContent.showPage;
    entryPage = thisComponentContent.entryPage;
//    t.contentUpdate(l);
    showEdUpdateScreen(t,l)
    $("#projectTitle").append(projectTitle);
    $("#cTitle").val(projectTitle);
    var ltiTarget = LTI_ENTRANCE+"?componentId="+ thisComponent.id;
    $("#ltiurl").append(ltiTarget);
    if(!accessLti=='true'){
        $("#basiclti").attr('checked', false);
        $("#ltiurl").hide();
        $("#ltikeylabel").css( "color", "#bbbbbb" );
        $("#urllabel").css( "color", "#bbbbbb" );
        $("#basicltikey").prop('disabled', true);
        $("#ltisecretlabel").css( "color", "#bbbbbb" );
        $("#basicltisecret").prop('disabled', true);
    }else{
        $("#basiclti").attr('checked', true);
        $("#ltiurl").show();
        $("#ltikeylabel").css( "color", "blue" );
        $("#urllabel").css( "color", "blue" );
        $("#basicltikey").prop('disabled', false);
        $("#ltisecretlabel").css( "color", "blue" );
        $("#basicltisecret").prop('disabled', false);
        $("#basicltikey").val(ltiKey);
        $("#basicltisecret").val(ltiSecret);
    }
    if(directAccess=='true'){
        $("#accessviaurl").attr('checked', true);
        $("#loginrequiredlabel").css( "color", "blue" );
        $("#loginrequired").attr("disabled", false);
        if(loginRequired=='true'){
            $("#loginrequired").attr('checked', true);
        }else{
            $("#loginrequired").attr('checked', false);
        }
    }else{
        $("#accessviaurl").attr('checked', false);
        $("#loginrequiredlabel").css( "color", "#bbbbbb" );
        $("#loginrequired").attr("disabled", true);


    }
    $("#showentryscreen").attr('checked', true);
    var thisCkInstance = findCkInstanceByName("ctxIntro");
    if(thisCkInstance!=null){
        thisCkInstance.setData(entryPage);
    }
    $("#shopagelabel").css( "color", "blue" );
    $("#docComponentId").val(l.name);
    $("#componentTitle").val(componentTitle);
/*
    thisCkInstance = findCkInstanceByName("ctxIntro");
    if (typeof entryPage != 'undefined') {
        thisCkInstance.setData(entryPage);
    }else{
        thisCkInstance.setData("");
    }
*/
    setPathSelect(connections);
    $('#popup').show();
}


function configureNewEntryDoor(title, doorId){


    $("#doorEdit").show();
    $("#contextTitle").append(title);
    $("#cTitle").val(title);
    $("#basiclti").attr('checked', false);
    $("#accessviaurl").attr('checked', false);
    $("#stopentercb").attr('checked', false);
    $("#docComponentId").val(doorId);
    var ltiTarget = LTI_ENTRANCE+"?componentId="+ doorId;
    $("#ltiurl").append(ltiTarget);
    $("#ltiurl").hide();
    ed = CKEDITOR.replace("ctxIntro",
        {
            height:"100", width:"800",
            readOnly: true,
            toolbar :
                [
                    { name: 'basicstyles', items : [ 'Bold','Italic','Strike','-','RemoveFormat' ] },
                    { name: 'clipboard', items : [ 'Cut','Copy','Paste','PasteText','PasteFromWord','-','Undo','Redo' ] },
                    { name: 'insert', items : [ 'Image','Flash','HorizontalRule','Smiley','SpecialChar','PageBreak' ] },
                    { name: 'tools', items : [ 'Maximize','-','About' ] }
                ]
        });


}

function getEdEntryHTML(layerName,x,y,n){
    var strVar="";
    strVar += "    <div id=\"componentEnter\" class=\"doorComponent\">";
    strVar += "        <table border=\"0\" width= \"90%\">";
    strVar += "            <tr>";
    strVar += "                <td width=\"35%\"><span class=\"hdr3\">Entrance to context:<\/span><\/td><td width=\"15%\"><span id=\"projectTitle\" class=\"hdr4\"><\/span><\/td><td width=\"25%\"><\/td><td width=\"25%\"><\/td>";
    strVar += "            <\/tr>";
    strVar += "            <tr>";
    strVar += "                <td><span id=\"acessviaurllabel\" class=\"hdr3\">Access Directly via Url?<\/span><\/td><td><input type=\"checkbox\" value=\"true\"  id=\"accessviaurl\" onclick=\"activDaccess();\"\/><\/td><td><span id=\"loginrequiredlabel\" class=\"hdr5\">Login required ?<\/span><\/td><td><input type=\"checkbox\" value=\"true\"  id=\"loginrequired\"\/><\/td>";
    strVar += "            <\/tr>";
    strVar += "            <tr>";
    strVar += "                <td><span id=\"basicltilabel\" class=\"hdr3\">Access via Basic LTI ?<\/span><\/td><td><input type=\"checkbox\" value=\"true\" checked=\"\" onclick=\"activLti();\"  id=\"basiclti\"\/><\/td><td colspan=\"0\"><span id=\"urllabel\" class=\"hdr3\">URL:<\/span><span id=\"ltiurl\"  class=\"hdr6\"><\/span><\/td>";
    strVar += "            <\/tr>";
    strVar += "            <tr>";
    strVar += "                <td><span id=\"ltikeylabel\" class=\"hdr5\">Basic-LTI Key<\/span><\/td><td><input  size=\"20\"  id=\"basicltikey\" \/><\/td><td align=\"right\"><span id=\"ltisecretlabel\" class=\"hdr5\">Secret<\/span><\/td><td><input  size=\"20\" type=\"password\" id=\"basicltisecret\"  \/><\/td>";
    strVar += "            <\/tr>";
    strVar += "            <tr>";
    strVar += "                <td><span class=\"hdr3\">Stop upon entering ?<\/span><\/td><td align=\"left\"><input type=\"checkbox\" value=\"Y\" onclick=\"shoPage();\" id=\"stopentercb\"\/><\/td><td align=\"right\"><span class=\"hdr5\" id=\"shopagelabel\">Show page ?:<\/span><\/td><td align=\"left\"><input type=\"checkbox\" value=\"Y\"  id=\"showentryscreen\" onclick=\"activCk();\" \/><\/td>";
    strVar += "            <\/tr>";
    strVar += "";
    strVar += "        <\/table>";
    strVar += "";
    strVar += "";
    strVar += "";
    strVar += "";
    strVar += "";
    strVar += "        <textarea class=\"ckeditor\" cols=\"30\" id=\"ctxIntro\" name=\"ctxIntro\" rows=\"10\">";
    strVar += "        <\/textarea>";
    strVar += "        <div class=\"docSubmit\" id=\"ctxSubmit\">";
    strVar += "            <input type=\"submit\" value=\"Save this context configuration\"  onclick=\"updateEntryConfig(); return false;\"\/>";
    strVar += "            <input type=\"submit\" value=\"Cancel\"  onclick=\"cancelEntry(); return false;\"\/>";
    strVar += "        <\/div>";
    strVar += "       <input id=\"cTitle\" name=\"cTitle\" hidden=\"true\"\/>";
    strVar += "";
    strVar += "    <\/div>";
    strVar += "";

    return strVar;
}

function getEdUpdateHTML(x,y,layerName){
    var thisComponentContext = $("#componentContext").val();
    var strVar="";
    strVar += "    <div id=\"componentEdit\" class=\"doorComponent\">";
    strVar += "        <table border=\"0\" width= \"90%\">";
    strVar += "            <tr>";
    strVar += "                <td width=\"35%\"><span class=\"hdr3\">Entrance to Project:<\/span><\/td><td width=\"15%\"><span id=\"projectTitle\" class=\"hdr4\"><\/span><\/td><td width=\"25%\"><\/td><td width=\"25%\"><\/td>";
    strVar += "            <\/tr>";
    strVar += "            <tr>";
    strVar += "                <td><span id=\"acessviaurllabel\" class=\"hdr3\">Access Directly via Url?<\/span><\/td><td><input type=\"checkbox\" value=\"true\"  id=\"accessviaurl\" onclick=\"activDaccess();\"\/><\/td><td><span id=\"loginrequiredlabel\" class=\"hdr5\">Login required ?<\/span><\/td><td><input type=\"checkbox\" value=\"true\"  id=\"loginrequired\"\/><\/td>";
    strVar += "            <\/tr>";
    strVar += "            <tr>";
    strVar += "                <td><span id=\"basicltilabel\" class=\"hdr3\">Access via Basic LTI ?<\/span><\/td><td><input type=\"checkbox\" value=\"true\" checked=\"\" onclick=\"activLti();\"  id=\"basiclti\"\/><\/td><td colspan=\"0\"><span id=\"urllabel\" class=\"hdr3\">URL:<\/span><span id=\"ltiurl\"  class=\"hdr6\"><\/span><\/td>";
    strVar += "            <\/tr>";
    strVar += "            <tr>";
    strVar += "                <td><span id=\"ltikeylabel\" class=\"hdr5\">Basic-LTI Key<\/span><\/td><td><input  size=\"20\"  id=\"basicltikey\" disabled=\"disabled\"\/><\/td><td align=\"right\"><span id=\"ltisecretlabel\" class=\"hdr5\">Secret<\/span><\/td><td><input  size=\"20\" type=\"password\" id=\"basicltisecret\" disabled=\"disabled\" \/><\/td>";
    strVar += "            <\/tr>";
    strVar += "            <tr>";
    strVar += "                <td><span class=\"hdr3\">Show page upon enter ?<\/span><\/td><td align=\"left\"><input type=\"checkbox\" value=\"Y\" onclick=\"shoPage();\" id=\"stopentercb\"\/<\/td>";
    strVar += "            <\/tr>";
    strVar += "";
    strVar += "        <\/table>";
    strVar += "";
    strVar += "";
    strVar += "";
    strVar += "";
    strVar += "";
    strVar += "        <textarea class=\"ckeditor\" cols=\"30\" id=\"ctxIntro\" name=\"ctxIntro\" rows=\"10\">";
    strVar += "        <\/textarea>";
    strVar += "        <div class=\"docSubmit\" id=\"ctxSubmit\">";
    strVar += "            <input type=\"submit\" value=\"Save this context configuration\"  onclick=\"updateEntryConfig(); return false;\"\/>";
    strVar += "            <input type=\"submit\" value=\"Cancel\"  onclick=\"cancelEntry(); return false;\"\/>";
    strVar += "         <select name=\"pathSelectDropDown\" id = \"pathSelectDropDown\" onchange=\" editPath("+layerName+","+thisComponentContext+");\">";
    strVar += "             <option value=\"\">Select A Path To Edit<\/option>";
    strVar += "         <\/select>";

    strVar += "        <\/div>";
    strVar += "       <input id=\"cTitle\" name=\"cTitle\" hidden=\"true\"\/>";
    strVar += "";
    strVar += "    <\/div>";
    strVar += "    <input id=\"componentX\" name=\"componentX\" hidden=\"true\" value=\""+x+"\" \/>";
    strVar += "    <input id=\"componentY\" name=\"componentY\" hidden=\"true\" value=\""+y+"\"\/>";
    strVar += "    <input id=\"componentType\" name=\"componentType\" hidden=\"true\" value=\"entry_door\" \/>";
    strVar += "    <input id=\"componentId\" name=\"componentId\" hidden=\"true\" hidden=\"true\" value=\""+layerName+"\"\/>";
    strVar += "    <input id=\"componentContent\" name=\"componentContent\" hidden=\"true\" \/>";
    strVar += "    <input id=\"componentTitle\" name=\"componentTitle\" hidden=\"true\" \/>";
    strVar += "    <input id=\"debug\" name=\"debug\" hidden=\"true\" \/>";

    strVar += "";

    return strVar;
}

function saveEntryDoor(){
    ckInstance = findCkInstanceByName("docContent");
    componentContent = ckInstance.getData();
    elementId = generateUUID();
    insertComponent($("#componentX").val(), $("#componentY").val(), $("#componentType").val(), $("#componentTitle").val(), componentContent, $("#saveContext").val(),"false", elementId, $("#reLoadContext").val());

}


function updateEntryConfig(){

//    var componentTitle = $("#cTitle").val();
    var directAccess = Boolean($("#accessviaurl").val());
    var loginRequired = Boolean($("#loginrequired").val());
    var accessLti = Boolean($("#basiclti").val());
    var ltiUrl;
    var ltiKey;
    var ltiSecret;
    if(accessLti){
        ltiUrl = LTI_ENTRANCE+"?componentId="+ $("#docComponentId").val();
        ltiKey = $("#basicltikey").val();
        ltiSecret = $("#basicltisecret").val();
    }else{
        ltiUrl = "";
        ltiKey = "";
        ltiSecret = "";
    }
    var stopOnEntry = Boolean($("#stopentercb").val());
    var showEntryPage = Boolean($("#showentryscreen").val());
    var entryPage;

    ckInstance = findCkInstanceByName("ctxIntro");
    entryPage = ckInstance.getData();

    var thisEntryDoor = new EntryDoor( directAccess, loginRequired, accessLti, ltiUrl, ltiKey, ltiSecret, stopOnEntry, showEntryPage, entryPage, projectTitle);
    var jsonEntryDoor = JSON.stringify(thisEntryDoor);
    myData = {content: jsonEntryDoor, id: $("#docComponentId").val() };
    updateComponent($("#componentX").val(), $("#componentY").val(), $("#componentType").val(), "Entrance", jsonEntryDoor, $("#componentContext").val(), $("#componentId").val(), $("#reLoadContext").val() );
}
/*
var updateEntryDoor = function(){
    var thisEntryDoor = new EntryDoor($("#contextName").html(),$("#selectAccess").val(), $("#urlValue").html, $("#litKey").val(), $("#ltiSecret").val());
    var jsonEntryDoor = JSON.stringify(thisEntryDoor);
    updateComponent($("#componentX").val(), $("#componentY").val(), $("#componentType").val(), "Entrance", jsonEntryDoor, $("#componentContext").val(), $("#componentId").val() );

}
*/



/*
function EntryDoor(_directAccess, _loginRequired, _accessLti, _ltiUrl, _ltiKey, _ltiSecret, _stopOnEntry, _showPage, _entryPage, _projectTitle){
    this.directAccess = _directAccess.toString();
    this.loginRequired = _loginRequired.toString();
    this.accessLti = _accessLti.toString();
    this.ltiUrl = _ltiUrl;
    this.ltiKey = _ltiKey;
    this.ltiSecret = _ltiSecret;
    this.stopOnEntry = _stopOnEntry.toString();
    this.showPage = _showPage.toString();
    this.entryPage = _entryPage;
    this.projectTitle = _projectTitle;
}
*/

function EntryDoor(_title, _accessType, _accessURL, _key, _secret){
    this.title = _title;
    this.accessType = _accessType;
    this.accessURL = _accessURL;
    this.key = _key;
    this.secret = _secret;
}



toolIcons.push("entry_door");


