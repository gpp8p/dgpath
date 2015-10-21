/**
 * Created with JetBrains PhpStorm.
 * User: georgepipkin
 * Date: 4/15/13
 * Time: 8:37 PM
 * To change this template use File | Settings | File Templates.
 */

var componentNumber = 0;
//var debug=XDEBUG_SESSION_START=12386;
// var urlBase = "http://localhost/~georgepipkin/lpath/";
//-----------------------------------toolbar stuff ------------------------
function drawToolbar(){
    tbWidth = (toolIcons.length * tbIncrement)+10;
    $("canvas").drawRect({
        strokeStyle: "#36a",
        fillStyle: "#ccc",
        layer: true,
        name: "toolbar",
        group: "control",
        strokeWidth: 3,
        x: tbX+(tbWidth/2)+10, y: tbY+(tbHeight/2),
        width: tbWidth,
        height: tbHeight,
        index: 0,
        cornerRadius: 10
    });
    iconXpos = tbX+18+(componentWidth/2);
    for (thisIcon in toolIcons){
        makeToolBar(toolIcons[thisIcon], iconXpos, tbY+(componentHeight/2)+8);
        iconXpos += tbIncrement;
    }
    $("canvas").drawRect({
        strokeStyle: "#36a",
        fillStyle: "#ccc",
        layer: true,
        name: "controlBar",
        group: "control",
        strokeWidth: 3,
        x: cwidth-130, y: tbY+(tbHeight/2),
        width: 120,
        height: 60,
        index: 0,
        cornerRadius: 10
    });






    controlIcons.push("scroll");
    controlFunctions.push(scrollAdjust);
    iconXpos = cwidth-150;
    thisIcon=0;
    makePathSelect(controlIcons[thisIcon], iconXpos, tbY+(componentHeight/2)+8);
    thisIcon=1;
    iconXpos += 50;
    makeScroll(controlIcons[thisIcon], iconXpos, tbY+(componentHeight/2)+8);

 /*
    for (thisIcon=0; thisIcon<controlIcons.length; thisIcon++){
        makeControlBar(controlIcons[thisIcon], iconXpos, tbY+(componentHeight/2)+8), controlFunctions[thisIcon];
        iconXpos += 50;
    }
*/


}

function makePathSelect(icon, xLoc, yLoc) {
    layerName = icon;
    iconName = "images/"+icon+".png";
    $("canvas").drawImage({
        layer: true,
        name: layerName,
        draggable: false,
        mouseup: function(layer){
            pathClick(layer);

        },
        source: iconName,
        shadowColor: "#666",
        shadowBlur: 5,
        shadowX: -5, shadowY: 5,
        x: xLoc, y: yLoc,
        bringToFront: true
    });

}

function makeScroll(icon, xLoc, yLoc) {
    layerName = icon;
    iconName = "images/"+icon+".png";
    $("canvas").drawImage({
        layer: true,
        name: layerName,
        draggable: false,
        mouseup: function(layer){
            scrollAdjust(layer);
        },
        source: iconName,
        shadowColor: "#666",
        shadowBlur: 5,
        shadowX: -5, shadowY: 5,
        x: xLoc, y: yLoc,
        bringToFront: true
    });

}

function makeContextBar1(contextInfo){
    var contextHtml = "<div class=\"hdr4\">";
    for(i=0;i<contextInfo.length;i++){
        var thisContextInfo = contextInfo[i];
        contextHtml += "\/<span class=\"ctxlink\" id=\"ctx-"+i+"\">"+thisContextInfo.title+"<\/span>";
    }
    contextHtml = "</div>";
    return contextHtml;
}

function makeContextBar(){
    $("#contextBar").html(getContextLabel());

}

function getContextLabel(){
    var strVar="";
    strVar += "            <div class=\"hdr4\">";
    strVar += "                 Context Now:";
    strVar += "<span class=\"hdr7\">"+$("#projectContextStackLabels").val()+"<\/span>";
    strVar += "            <\/div>";
    strVar += "";
    return strVar;
}


function makeContextLine(contextInfo){
    var contextReturn = "<span id=\"ctxTop\" class=\"ctxTopInfo ctxInfo\">My Courses:&nbsp;&nbsp;&nbsp;</span> <span class=\"ctxInfoBold\">\/</span>";
    for (i=contextInfo.length-1;i>=0;i--){
        thisContextInfo = contextInfo[i];
        contextReturn += "<span id=\"ctx"+thisContextInfo.contextId+"\" class=\"ctxInfo ctxLevel\">"+thisContextInfo.contextTitle+"</span><span class=\"ctxInfoBold\">\/</span>";
    }
    return contextReturn;
}


function replaceIcon(ic){
    iconXpos = cwidth-575;
    for (thisIcon in toolIcons){
        if(ic==toolIcons[thisIcon]){
            makeToolBar(toolIcons[thisIcon], iconXpos, 90);
        }
        iconXpos += 50;
    }
}

function makePathIcon(){
    iconXpos = cwidth-145;
    iconYpos = 90;
    iconName = "images/path_icon.png";
    layerName ="path_button";
    $("canvas").drawImage({
        layer: true,
        name: layerName,
        draggable: false,
        data: thisNewComponent,
        mouseup: function(layer){
            pathClick(layer);
        },

        source: iconName,
        shadowColor: "#666",
        shadowBlur: 5,
        shadowX: -5, shadowY: 5,
        x: iconXpos, y: iconYpos,
        bringToFront: true
    });
}


function makeToolBar(icon, xLoc, yLoc) {
    layerName = icon+"_layer_"+componentNumber;
    componentNumber++;
    iconName = "images/"+icon+".png";
    newComponentEval = "thisComp= new "+icon+"();";
//    thisComp = new doc();
    thisNewComponent = eval(newComponentEval);
    $("canvas").drawImage({
        layer: true,
        name: layerName,
        draggable: true,
        data: thisNewComponent,
        dragstop: function(layer){
            layer.data.handleMup(layer, icon);
        },
//        dblclick: function(layer){
//            layer.data.contentUpdate(layer);
//        },
        mouseup: function(layer){
            layer.data.handleMup(layer);
        },

        source: iconName,
        shadowColor: "#666",
        shadowBlur: 5,
        shadowX: -5, shadowY: 5,
        x: xLoc, y: yLoc,
        bringToFront: true
    });

}

var scrollAdjust;
scrollAdjust = function(layer){
    $("#studioDiv").toggleClass("scrollOff");
}

//----------------------------project load save ------------------------------------

function gotoContext(contextId){
//    $("#projectContextStackLabels").val('');
//    $("#projectContextStack").val('');
    setupThisProject(contextId);

}


function setupThisProject(contextId){
    inContextNow = contextId;
    reloadAllComponents(contextId);


}

function reloadAllComponents(contextId, dragActive){
    console.log("reloadAllComponents");
    var myData = {contextId:contextId};
    $("#componentContext").val(contextId);
    var thisTransaction = urlBase+fetch_components_and_events+"?"+debug;

    $.ajax({
        type: "POST",
        url: thisTransaction,
        data: myData,
        success: function(msg) {
            currentComponentsAndContext = JSON.parse(msg);
            currentComponents = currentComponentsAndContext[0];
            removeAllComponents();
            drawToolbar();
            drawAllComponents(currentComponents, dragActive);
            $("#componentContext").val(contextId);
            selectProject(contextId);
            $("#contextLine").html(makeContextLine(currentComponentsAndContext[1]));
            contexts = currentComponentsAndContext[1];
            for (i=0;i<contexts.length;i++){
                thisCtx = contexts[i];
                $("#ctx"+thisCtx.contextId).on("click", function(){
                   gotoContext(this.id.substring(3));
                });
            }
            $("#ctxTop").on("click", function(){
                selectCourse($("#thisUserEid").val());
            });

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


function selectProject(contextId){
    var myData = {contextId:contextId};
    var thisTransaction = urlBase+get_this_project+"?"+debug;

    $.ajax({
        type: "POST",
        url: thisTransaction,
        data: myData,
        success: function(msg) {
            thisProject = eval(msg);
            $("#currentProjectId").val(thisProject[0]);
            $("#subContext").val(contextId);
            if($("#projectContextStackLabels").val()==""){
                var newProjectStackLabels = $("#projectContextStackLabels").val()+"<a onclick=\"gotoContext("+contextId+")\" >"+thisProject[1]+"</a>";
                var newProjectStack = $("#projectContextStack").val()+contextId;
                $("#projectContextStackLabels").val(newProjectStackLabels);
                $("#projectContextStack").val(newProjectStack);
            }else{
                computeNewProjectStack(contextId,thisProject[1]);
            }

            $("canvas").drawLayers();
            $('#popup').html('');
//            makeContextBar();
            $("#tabHeader").show();
            $("#studioTabContent").html($.t("tabs.studio"));
            $("#previewTabContent").html($.t("tabs.preview"));
            $("#dashboardTabContent").html($.t("tabs.dashboard"));
            $("#libraryTabContent").html($.t("tabs.library"));

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

function computeNewProjectStack(contextId, newLabel){
    var currentStackIds = $("#projectContextStack").val().split("/");
    var currentStackLabels = $("#projectContextStackLabels").val().split("|");
    var newStackLabels = "";
    var newContextStack = "";
    if(currentStackIds.indexOf(contextId.toString())>=0){
        $("#projectContextStack").val('');
        $("#projectContextStackLabels").val('');
        i=0;
        while(currentStackIds[i]!=contextId&& i<currentStackIds.length){
            newStackLabels += currentStackLabels[i]+"|";
            newContextStack += currentStackIds[i]+"/";
            i++;
        }
        newStackLabels += currentStackLabels[i]
        newContextStack += currentStackIds[i];

    }else{
        if(!currentStackIds[0]==""){
            newStackLabels = $("#projectContextStackLabels").val()+"|"+"<a onclick=\"gotoContext("+contextId+")\" >"+newLabel+"</a>";
            newContextStack = $("#projectContextStack").val()+"/"+contextId;
        }else{
            newStackLabels = $("#projectContextStackLabels").val()+"<a onclick=\"gotoContext("+contextId+")\" >"+newLabel+"</a>";
            newContextStack = $("#projectContextStack").val()+"/"+contextId;
        }
    }
    $("#projectContextStackLabels").val(newStackLabels);
    $("#projectContextStack").val(newContextStack)
}

function drawAllComponents(allComponents, dragActive){
    console.log("drawAllComponents");
    $('canvas').clearCanvas();
    $.each(allComponents, function(comp) {
        var thisComponent = allComponents[comp];
        var dgName = 'dg_'+thisComponent.id;
        srcRef = "images/"+thisComponent['type']+".png";
        console.log("this component - "+srcRef);
        if(dragActive == true | dragActive==null){
            console.log("drawAllComponents - dragActive is true");
            $("canvas").drawImage({
                layer: true,
                name: thisComponent.id,
                draggable: true,
                dragstart: function(layer) { startDrag(layer);},
                dragstop: function(layer) { endComponentDrag(layer);},
                groups: [dgName],
                dragGroups: [dgName],
                source: srcRef,
                shadowColor: "#666",
                shadowBlur: 5,
                shadowX: -5, shadowY: 5,
    //            mouseup: function(layer) { return;},
    //            dblclick: function(layer) { editExistingComponent(layer);},
                x: parseInt(thisComponent['x']), y: parseInt(thisComponent['y']),
                index: 1,
                bringToFront: true
            });
        }else{
            console.log("drawAllComponents - dragActive is false");
            $("canvas").drawImage({
                layer: true,
                name: thisComponent.id,
                group: "component",
                dragstart: null,
                dragstop: null,
                draggable: false,
                source: srcRef,
                shadowColor: "#666",
                shadowBlur: 5,
                shadowX: -5, shadowY: 5,
                mouseup: function(layer) { wasClicked(layer);},
                x: parseInt(thisComponent['x']), y: parseInt(thisComponent['y']),
                index: 1,
                bringToFront: true
            });

        }
        if(this.title!=null){
            $("canvas").drawText({
                fillStyle: "#9cf",
                layer: true,
                draggable: true,
                groups: [dgName],
                dragGroups: [dgName],
                index: 2,
                strokeStyle: "#25a",
                strokeWidth: 1,
                x: parseInt(thisComponent['x']), y: parseInt(thisComponent['y'])+40,
                font: "8pt Verdana, sans-serif",
                text: this.title,
                bringToFront: true
            });
        }
        thisComponentConnections = thisComponent['connections'];
        $.each(thisComponentConnections, function(con){
            thisConnection = thisComponentConnections[con];
            startComponent = findComponent(thisConnection['start_id'], allComponents);
            endComponent = findComponent(thisConnection['end_id'], allComponents);
            goAhead = thisConnection.goAhead;
            drawArrow(parseInt(startComponent.x), parseInt(startComponent.y), parseInt(endComponent.x), parseInt(endComponent.y), goAhead);
        });
    });
//    if(!dragActive) drawPathStartPrompt();
    $("#tabHeader").show();
}

function startDrag(layer){
    console.log("startDrag");
/*
    if(eatNextClick){
        eatNextClick=false;
        return;
    }
    if(! layer.event.shiftKey){
        layer.disableDrag = true;
        layer.event.stopPropagation();
        editExistingComponent(layer);
    }
*/
}

function endComponentDrag(layer){
    console.log("endDrag");
    if(! layer.event.shiftKey){
        layer.disableDrag = true;
        layer.event.stopPropagation();
        editExistingComponent(layer);
    }else{
        relocateComponent(layer);
    }
}

function relocateComponent(layer){
//    componentToEdit = findComponent(layer.name, currentComponents);
    console.log("reloacteComponent");
    var s = parseInt($("#clickStatus").val());
//    if(s>0) return;
    console.log("relocating now....");
    var thisTransaction = urlBase+update_component_position+"?"+debug;
    var newX = layer.eventX;
    var newY = layer.eventY;
    var myData = {componentId: layer.name, xpos: newX, ypos: newY};
    $.ajax({
        type: "POST",
        url: thisTransaction,
        data: myData,
        success: function(msg) {
            if(msg==="ok"){
                var thisContextId = $("#componentContext").val();
                reloadAllComponents(thisContextId);
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

function deleteComponent(componentId, componentTitle, forceDelete){

    var thisTransaction = urlBase+delete_context+"?"+debug;
    var myData;
    var componentTitle = componentTitle;
    var componentId = componentId;
    if(forceDelete == "forceDelete"){
        myData = {componentId: componentId, forceDelete: "forceDelete"}
    }else{
        myData = {componentId: componentId};
    }
    $.ajax({
        type: "POST",
        url: thisTransaction,
        componentId:componentId,
        componentTitle:componentTitle,
        data: myData,
        success: function(msg) {
            if(msg==="userEventsPresent"){
                userEventsPresentConfirmDelete(this.componentId);
            }else if(msg=="confirmDelete") {
                $("#alertPopup").html(alertPopupHtml("You really want to delete: " + this.componentTitle + " ?"));
                $("#alertPopup").show();
                $("#componentId").val(this.componentId);
                $("#confirm").on("click", function () {
                    var thisId = $("#componentId").val();
                    $("#alertPopup").hide();
                    forceDeleteComponent(componentId, componentTitle);
                });
                $("#noconfirm").on("click", function () {
                    $("#alertPopup").hide();
                    reloadAllComponents($("#reLoadContext").val());
                });
            }else if(msg=="subContextDeleted"){
                $("#popup").hide();
                $("#popup").html("");
                reloadAllComponents($("#reLoadContext").val());
            }else{
                componentsToBeDeleted = JSON.parse(msg);
                $("#popup").html("");
                $("#popup").html(getDeleteList());
                $("#subTitle").html(this.componentTitle);
                $("#deleteComponentId").val(this.componentId);
                $("#deleteComponentTitle").val(this.componentTitle);
                addCandidateDeletionsToList(componentsToBeDeleted);
                $("#cancelDelete").on("click", function(){
                    $("#popup").hide();
                    $("#popup").html("");
                    reloadAllComponents($("#reLoadContext").val());
                });
                $("#deleteComponents").on("click", function(){
                   deleteComponent($("#deleteComponentId").val(), $("#deleteComponentTitle").val(), "forceDelete");
                });

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

function addCandidateDeletionsToList(componentsToBeDeleted){
    for(c=0;c<componentsToBeDeleted.length;c++){
        thisComponent = componentsToBeDeleted[c];
        if(thisComponent.type!="subcontext"){
            var thisListElement = "<li>"+thisComponent.title+"</li>";
            $("#componentsToBeDeleted").append(thisListElement);
        }else{
            var thisListElement = "<li>"+thisComponent.title+"</li>";
            $("#componentsToBeDeleted").append(thisListElement);
            addCandidateDeletionsToList(thisComponent.subContextElements);
        }
    }
}

function getDeleteList(){
    var strVar="";
    strVar += "    <div id=\"componentEdit\" class=\"deleteContextList\">";
    strVar += "<div id=\"subTitleArea\" >";
    strVar += "<span id=\"subTitle\" ></span> has several sub-components.";
    strVar += "</div>";
    strVar += "These sub-context components will be removed:";
    strVar += "<div id = \"componentsToBeDeleted\">";
    strVar += "<\/div>";
    strVar += "<br/>";
    strVar += "<input type=\"button\" value=\"Delete Components\" id=\"deleteComponents\" \/>";
    strVar += "<input type=\"button\" value=\"Cancel\" id=\"cancelDelete\" \/>";
    strVar += "<input type=\"hidden\"  id=\"deleteComponentId\" \/>";
    strVar += "<input type=\"hidden\"  id=\"deleteComponentTitle\" \/>";
    strVar += "    <\/div>";
    strVar += "";
    return strVar;
}

function forceDeleteComponent(componentId, componentTitle){
    var thisTransaction = urlBase+delete_context+"?"+debug;
    var myData = {componentId: componentId, forceDelete: "forceDelete"};
    $.ajax({
        type: "POST",
        url: thisTransaction,
        componentId:componentId,
        componentTitle:componentTitle,
        data: myData,
        success: function(msg) {
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

function mock_insertComponent(x, y, type, title, content, ctx, evts, showSub, elementId, reloadContext){
    console.log('x=',x,'/ny=',y,'/ntitle=', title,'/ntype=',type,'/ncontent=',content,'/nctx=',ctx,'/nevts=',evts,'/nshowSub=',showSub,'/nelementId=',elementId,'/nreloadContext=',reloadContext);
    return 0;
}

function insertComponent(x, y, type, title, content, ctx, evts, showSub, elementId, reloadContext){

    var sevts = JSON.stringify(evts);
    myData = { xpos:x, ypos:y, type:type, content: content, title: title, context: ctx, events: sevts, showSub: showSub, elementId: elementId, reloadContext:reloadContext};
    var thisTransaction = urlBase+insert_component+"?"+debug;
    $.ajax({
        type: "POST",
        url: thisTransaction,
        data: myData,
        success: function(msg) {
            var componentInserted = JSON.parse(msg);
            var reloadThisContext = componentInserted[0];
            var currentSaveContext = parseInt($("#saveContext").val());
            if(reloadThisContext == currentSaveContext) {
                loadContextComponents(reloadThisContext);
            }else{
                var callbackLibraryArea = new libraryArea();
                callbackLibraryArea.addNewComponentTo($("#libraryLocation").val(), componentInserted[0],componentInserted[1], componentInserted[2], componentInserted[3]);
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
    return;
}

var getPathSelectHtml = function(){

    var strVar = "";
    strVar += "         <table border=\"0\" width=\"100%\"><tr><td align=\"center\">";
    strVar += "         <select name=\"pathSelectDropDown\" id = \"pathSelectDropDown\">";
    strVar += "             <option value=\"\">Select A Path To Edit<\/option>";
    strVar += "         <\/select>";
    strVar += "         </td></tr></table>"
    return strVar;
}




var cloneThis = function(pn, cloneObj, direction){
    var thisTransaction = urlBase + get_user_collections + "?" + debug;
    var popName = pn;
    var popHeight = 50;
    var objectType = cloneObj.icon;
    var objectId = cloneObj.id;
    var objectTitle = cloneObj.title;
    var subContextId = cloneObj.subcontext;
    var cloneDirection = direction;

    var getCollectionsScreen = function(){
        var strVar="";
        strVar += "<div id=\"collectionSelect\">";
        strVar += "	<div id=\"collectionSelectPrompt\"><\/div>";
        strVar += "	<table id=\"collectionSelectTable\" border=\"0\" width=\"100%\">";
        strVar += "	<\/table>";
        strVar += "	<input type=\"button\" id=\"collectionSelectCancel\" \/>";
        strVar += "<\/div>";
        return strVar;
    };

    var getCollectionLine = function(thisLineData){

        var strVar="";
        var cellId = "collection_"+thisLineData[1];
        var cellContent = thisLineData[0];
        strVar += "<tr><td class=\"collectionSelectCell\" id=\""+cellId+"\">"+cellContent+"<\/td><\/tr>";
        return strVar;

    };

    var cancelGetCollection = function(){
        $("#"+popName).html("");
        $("#"+popName).hide();
    };

    var showThisCollection = function(collectionId, collectionTitle, thisPopName){
        var thisTransaction = urlBase+get_context_titles+"?"+debug;
        var isSelectClick = "N";
        var popName = thisPopName;
        var myData = {elementId: collectionId, collectionTitle: collectionTitle, selClick: isSelectClick, openCollection: true};
        $.ajax({
            type: "POST",
            url: thisTransaction,
            data: myData,
            success: function(msg) {
                var thisLibraryArea = new libraryArea();
                var collectionInfo = JSON.parse(msg);
                var thisCollectionId = "cl"+collectionInfo[0];
                var collectionTree = collectionInfo[1];
                var collectionTitle = collectionInfo[2];
                var selectClick = collectionInfo[3];
                titleLine = "<tr><td><div id = \"cl"+thisCollectionId+"\" class=\"collectionTopCss\">"+collectionTitle+"<\/div></td></tr>";
                $("#collectionSelectTable").append(titleLine);
                traverseContext(thisCollectionId, collectionTree, "cl"+thisCollectionId, selectClick);

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

    var getThisParentId;
    getThisParentId = function(sourceElement){
        var idElements = sourceElement.split("_");
        var idElementsLength = idElements.length;
        idElementsLength = idElementsLength-1;
        var parentId = ""
        for(l=0;l<idElementsLength;l++){
            if(l<idElementsLength-1){
                parentId = parentId+idElements[l]+"_";
            }else{
                parentId = parentId+idElements[l];
            }
        }
        return parentId;
    }

    var getConfirmCopy = function(popName, copySource, copyTarget, insertLocationX, insertLocationY, description, event){

        var getConfirmCopyHtml = function(){
            var strVar="";

            strVar += "<div id=\"newContextName\" class=\"ruSureCss\"><span id=\"newContextNameLabel\"><\/span><span><input id=\"newContextNameValue\" type=\"text\" size=\"40\" \/><\/span>";
            strVar += "<br/><span id=\"contextDescriptionLabel\"><\/span>";
            strVar += "<textarea class=\"ckeditor\" cols=\"40\" id=\"subcontextDescription\" name=\"subcontextDescription\" rows=\"20\">";
            strVar += "<\/textarea>";
            strVar += "<div><input type=\"button\" id=\"cloneYes\" \/><input type=\"button\" id=\"cloneNo\" \/></div></div>";
            return strVar;
        }

        var cancelCopy = function(){
            $("#"+popName).html("");
            $("#"+popName).hide();

        }

        var locX = insertLocationX;
        var locY = insertLocationY;
        var thisCopySource = copySource;
        var thisCopyTarget = copyTarget;
        var thisDescription = description;
        var thisCopyHtml = getConfirmCopyHtml();
        $("#"+popName).hide();
        $("#"+popName).html("");
        $("#"+popName).html(thisCopyHtml);
        $("#"+popName).css("height", "350px");
        $("#"+popName).css("width", "700px");
        $("#cloneYes").prop('value', $.t("libraryControlBar.cloneYes"));
        $("#cloneNo").prop('value', $.t("libraryControlBar.cloneCancel"));
        $("#newContextNameLabel").html($.t("libraryControlBar.newContextName"));
        $("#cloneYes").prop('disabled', true);
        $("#newContextNameValue").on('keydown', function(){
            $("#cloneYes").prop('disabled', false);
        });
        $("#cloneNo").on('click', function(){
            cancelCopy();
        });
        $("#cloneYes").on('click', function() {
            ckInstance = findCkInstanceByName("subcontextDescription");
            var contextDescription = ckInstance.getData();
            var myData = {copyTarget: thisCopyTarget, copySource: thisCopySource, componentX: locX, componentY: locY, description: contextDescription};
            this
            transaction = urlBase + copy_context_from + "?" + debug;
            e.stopPropagation();
            $.ajax({
                type: "POST",
                url: thisTransaction,
                data: myData,
                success: function (msg) {
                    var copyResults = JSON.parse(msg);

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
        });
        $("#"+popName).show();
        ed = CKEDITOR.replace("subcontextDescription",
            {
                height:"150", width:"650",
                enterMode : CKEDITOR.ENTER_BR,
                shiftEnterMode: CKEDITOR.ENTER_P
            });
        ckInstance = findCkInstanceByName("subcontextDescription");
        ckInstance.setData(thisDescription);

/*
        var myData = {componentId:thisId};
        e.stopPropagation();
        $.ajax({
            type: "POST",
            url: thisTransaction,
            data: myData,
            success: function(msg) {
                var collectionInfo = JSON.parse(msg);

            },
            error: function(err) {
                alert(err.toString());
                if (err.status == 200) {
                    ParseResult(err);
                }
                else { alert('Error:' + err.responseText + '  Status: ' + err.status); }
            }
        });
*/








    }

    var getConfirmClone = function(popName, objectTitle, ObjectId, ObjectType, selectedTitle, targetFolder, event){
        var thisObjectTitle = objectTitle;
        var thisSelectedTitle = selectedTitle;
        var thisTargetFolder = targetFolder;


        var getConfirmCloneHtml = function(){
            var strVar="";
            strVar += "<div id=\"areYouSureCloneId\" class=\"ruSureCss\"><span id=\"areYouSureClonePrompt1Id\"><\/span><span id=\"areYouSureClonePrompt2Id\"><\/span><span id=\"areYouSureClonePrompt3Id\"><\/span><span id=\"areYouSureClonePrompt4Id\"><\/span><\/div>";
            strVar += "<div id=\"newContextName\" class=\"ruSureCss\"><span id=\"newContextNameLabel\"><\/span><span><input id=\"newContextNameValue\" type=\"text\" size=\"40\" \/><\/span>";
            strVar += "<br/><span id=\"contextDescriptionLabel\"><\/span>";
            strVar += "<textarea class=\"ckeditor\" cols=\"40\" id=\"subcontextDescription\" name=\"subcontextDescription\" rows=\"20\">";
            strVar += "<\/textarea>";
            strVar += "<div><input type=\"button\" id=\"cloneYes\" \/><input type=\"button\" id=\"cloneNo\" \/></div></div>";
            return strVar;
        }

        var cancelClone = function(){
            $("#"+popName).html("");
            $("#"+popName).hide();

        }

        $("#"+popName).html(getConfirmCloneHtml());
        $("#"+popName).css("height", "350px");
        $("#"+popName).css("width", "700px");
        $("#areYouSureClonePrompt1Id").html($.t("libraryControlBar.ruSure"));
        $("#areYouSureClonePrompt2Id").html( objectTitle);
        $("#areYouSureClonePrompt3Id").html("&nbsp;"+$.t("libraryControlBar.ruSureTo"));
        $("#areYouSureClonePrompt4Id").html(thisSelectedTitle + " ?");
        $("#contextDescriptionLabel").html($.t("libraryControlBar.descriptionLabel"));
        $("#cloneYes").prop('value', $.t("libraryControlBar.cloneYes"));
        $("#cloneNo").prop('value', $.t("libraryControlBar.cloneCancel"));
        $("#newContextNameLabel").html($.t("libraryControlBar.newContextName"));
        $("#cloneYes").prop('disabled', true);
        $("#newContextNameValue").on('keydown', function(){
            $("#cloneYes").prop('disabled', false);
        });
        $("#cloneNo").on('click', function(){
            cancelClone();
        });
        $("#cloneYes").on('click', function(){
            var thisTransaction = urlBase+clone_context+"?"+debug;
            var thisNameContextName = $("#newContextNameValue").val();
            var ckInstance = findCkInstanceByName("subcontextDescription");
            var thisSubContextDescription = ckInstance.getData();
            var myData = {subcontext:subContextId, target: thisTargetFolder, newContextName: thisNameContextName, description: thisSubContextDescription};
            $.ajax({
                type: "POST",
                url: thisTransaction,
                data: myData,
                success: function(msg) {
                    var parsedResult = JSON.parse(msg);
                    alert("transaction returned successfully!");
                },
                error: function(err) {
                    alert(err.toString());
                    if (err.status == 200) {
                        ParseResult(err);
                    }
                    else { alert('Error:' + err.responseText + '  Status: ' + err.status); }
                }
            });

        });
        $("#"+popName).show();
        ed = CKEDITOR.replace("subcontextDescription",
            {
                height:"150", width:"650",
                enterMode : CKEDITOR.ENTER_BR,
                shiftEnterMode: CKEDITOR.ENTER_P
            });






    }


    var traverseContext;
    traverseContext = function (thisCollectionId, contextComponents, attachTo, sClick) {
//    var subElements = "<ul class=\"subElementList\">";
        var subElements = "";
        var seIds = [];
        for (i = 0; i < contextComponents.length; i++) {
            thisContextComponent = contextComponents[i];
            var folderCss = "collectionFolderCss";
            var subContextCss = "collectionSubContextCss"

            var elementId;
            var contextId;
            if(thisContextComponent.type=='folder' | thisContextComponent.type=='subcontext'){
                elementId = thisCollectionId + "_fl" + thisContextComponent.id+"-"+thisContextComponent.subcontext;
                contextId = thisContextComponent.subcontext;
            }else{
                elementId = thisCollectionId + "_fl" + thisContextComponent.id+"-"+thisContextComponent.context;
                contextId = thisContextComponent.context;
            }
            var selectId = "select_"+elementId;
            switch (thisContextComponent.type) {
                case "subcontext":
                    subElements = subElements+"<div id=\""+elementId+"\"  class=\""+subContextCss+"\">"+thisContextComponent.title+"  <span class=\"selectLinkCss\"><a id=\""+selectId+"\"></a></span></div>";
                    seIds.push(elementId+","+contextId+","+thisContextComponent.title+","+"subcontext");

//                        subElements = subElements + "<div id=\"" + elementId + "\"  class=\"" + liclass + "\">" + thisContextComponent.title + "</div>";
                    break;
                case "folder":
                    subElements = subElements+"<div id=\""+elementId+"\"  class=\""+folderCss+"\">"+thisContextComponent.title+"  <span class=\"selectLinkCss\"><a id=\""+selectId+"\"></a></span></div>";
                    seIds.push(elementId+","+contextId+","+thisContextComponent.title+","+"folder");

//                        subElements = subElements + getFolderLineHTML(elementId, contextId, thisContextComponent.title, liclass, thisContextComponent.description);
                    break;
                default:
//                    subElements = subElements + "<div id=\"" + elementId + "\" onclick=\"openComponent('" + elementId + "',event);return false;\" class=\"" + liclass + "\">" + thisContextComponent.title + "</div>";
//                        subElements = subElements + getComponentLineHTML(elementId, contextId, thisContextComponent.title, liclass, "");
                    break;
            }
        }
        var thisDivHtml = $("#" + attachTo).html();
        $("#" + attachTo).append(subElements);
        popHeight = popHeight + (25*seIds.length);
        popHeightCss = popHeight +"px";
        popWidthCss = '450px';
        $("#" + popName).css('height', popHeightCss);
        $("#" + popName).css('width', popWidthCss);
        $.each(seIds, function(key, value){
            var thisFolderIds = value.split(',');
            $("#"+thisFolderIds[0]).on('click', function(event){
                openSubContext(thisFolderIds[0], thisFolderIds[1], this.attributes.id.nodeValue, event);
            });
            var selectId = "select_"+thisFolderIds[0];
            var targetFolder = thisFolderIds[0];
            if(cloneDirection==0) {
                $("#" + selectId).html($.t("libraryControlBar.selectClick"));
                $("#" + selectId).on('click', function (event) {
                    event.stopPropagation();
                    getConfirmClone(popName, objectTitle, objectId, objectType, thisFolderIds[2], targetFolder, event);
                });
            }else{
                if(thisFolderIds[3]=="subcontext"){
                    $("#" + selectId).html($.t("libraryControlBar.selectClick"));
                    $("#" + selectId).on('click', function (event) {
                        event.stopPropagation();
                        var thisCopyTarget = $("#saveContext").val();
                        var thisCopySource = thisFolderIds[1];
                        copyFromLibrary(popName, thisCopySource, thisCopyTarget,$("#componentX").val(), $("#componentY").val(), event);
                    });
                }
            }
        });
    };

    var copyFromLibrary = function(popName, copySource, copyTarget, insertLocationX, insertLocationY, event){

        var thisTransaction = urlBase+load_context_component+"?"+debug;
        var copySourceId = copySource;

        var thisPopName = popName;
        var thisCopySource = copySource;
        var thisCopyTarget = copyTarget;
        var thisInsertLocationX = insertLocationX;
        var thisInsertLocationY = insertLocationY;
        var myData = {contextId: copySourceId};
        $.ajax({
            type: "POST",
            url: thisTransaction,
            data: myData,
            success: function(msg) {
                var thisComponent = msg;
                var componentContent = JSON.parse(thisComponent.content);
                var thisComponentDescription = componentContent.description;
                getConfirmCopy(thisPopName,thisCopySource,thisCopyTarget, thisInsertLocationX, thisInsertLocationY,thisComponentDescription);
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

    var openSubContext = function(elementId, thisContextId, tId, e){
        var thisTransaction = urlBase+get_context_titles+"?"+debug;
        var thisFolderId = tId;
        var isSelectClick = "N";
        if(e.metaKey){
            isSelectClick = "Y";
        }
        var myData = {contextId:thisContextId, elementId:elementId, collectionTitle:"", selClick: isSelectClick, openCollection: false};
        e.stopPropagation();
        $.ajax({
            type: "POST",
            url: thisTransaction,
            data: myData,
            success: function(msg) {
                var collectionInfo = JSON.parse(msg);
                var thisCollectionId = collectionInfo[0];
                var collectionTree = collectionInfo[1];
                var collectionTitle = collectionInfo[2];
                var selectClick = collectionInfo[3];
//                    var parentId = getThisParentId(thisCollectionId);
                var childComponents = $("#"+thisFolderId).children();
                if(childComponents.length>1){
                    if(selectClick=="N"){
                        for(c=0;c<childComponents.length;c++){
                            thisChildComponent = childComponents[c];
                            $("#"+thisChildComponent.id).remove();
                            popHeight = popHeight - 20;
                        }
                        $("#" + popName).css('height', popHeight+'px');
                        $("#"+thisCollectionId).removeClass("selectedItem");
                    }else{
                        $("#"+thisCollectionId).addClass("selectedItem");
                    }
                }else{
                    traverseContext(thisCollectionId, collectionTree, thisFolderId, selectClick);
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


    $.ajax({
        type: "POST",
        url: thisTransaction,
        success: function (msg) {
            var collectionsResult = JSON.parse(msg);
            var dialogHeight = 40;
            $("#"+popName).html(getCollectionsScreen());
            $("#"+popName).addClass("collectionsPickerCss");
            $("#collectionSelectCancel").prop('value',$.t("libraryControlBar.cancelCollectionSelect"));
            $("#collectionSelectCancel").on('click', function(){
                cancelGetCollection();
            });
            $.each(collectionsResult, function(index, item){
                dialogHeight += 15;
                var thisItem = item;
                $("#collectionSelectTable").append(getCollectionLine(thisItem));
                $("#collection_"+thisItem[1]).on('click', function(){
                    $("#"+popName).html("");
                    $("#"+popName).html(getCollectionsScreen());
                    $("#collectionSelectCancel").prop('value',$.t("libraryControlBar.cancelCollectionSelect"));
                    $("#collectionSelectCancel").on('click', function(){
                        cancelGetCollection();
                    });
                    showThisCollection(item[1],item[0], popName);
                });
            });
            dh = dialogHeight+"px";
            $("#"+popName).height(dh);
            $("#"+popName).show();
            console.log('subcontext query successful');
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

}

function loadContextComponents(contextId){
    myData = { context: contextId};
    var thisTransaction = urlBase+load_components_for_context+"?"+debug;
    $.ajax({
        type: "POST",
        url: thisTransaction,
        data: myData,
        success: function(msg) {
            currentComponentsAndContext = JSON.parse(msg);
            currentComponents = currentComponentsAndContext[0];
            removeAllComponents();

            $("#componentEdit").hide();
            $('#popup').hide();
            drawAllComponents(currentComponents);
            drawToolbar();
            $("canvas").drawLayers();
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

function saveNewComponent(layerName, componentType){
    newComp = "thisComp = new "+componentType+"()";
    eval(newComp);
    thisComp.createComponent(layerName);
}

function updateExistingComponent(layerName, componentType){
    newComp = "thisComp = new "+componentType+"()";
    eval(newComp);
    thisComp.contentUpdate(layerName);

}


//-----------------------------------------new project-----------------------------------------------
function createNewProject(){


    var newProjectName = $("#pName").val();
    var useEid = $("#thisUserEid").val();
    var cwidth = getCanvasWidth('myCanvas');
    var cheight = getCanvasHeight('myCanvas');
    var myData = {ptitle: newProjectName, ownerContext: 2, width: cwidth, height: cheight, thisUserEid: $("#thisUserEid").val()};
    var thisTransaction = urlBase+create_new_project+"?"+debug;
    $("#projectContextStackLabels").val('');
    $("#projectContextStack").val('');

    $.ajax({
        type: "POST",
        url: thisTransaction,
        data: myData,
        success: function(msg) {
            entryDoor = eval(msg);
            pid = entryDoor['context'];
            eDoorId = entryDoor['id'];
            $("#componentContext").val(pid);
            $("#saveContext").val(pid);
            $("#componentId").val(eDoorId);
            newEntryDoor = new entry_door();
            newEntryDoor.context = entryDoor['context'];
            newEntryDoor.id = entryDoor['id'];
            newEntryDoor.title = entryDoor['title'];
            newEntryDoor.type = 'entry_door';
            newEntryDoor.projectTitle = newProjectName;
            computeNewProjectStack(newEntryDoor.context, newProjectName);
            newEntryDoor.contentEntry(50,250, "popup", $("#saveContext").val());
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

function loadCreatedProject(projectId){
    var myData = {projectId: projectId};
    $.ajax({
        type: "POST",
        url: urlBase+"lib/loadProject.php"+"?"+debug,
        data: myData,
        success: function(msg) {
            currentComponents = eval(msg);
            removeAllComponents();
            $("#directoryDiv").hide();
            drawAllComponents(currentComponents);
            drawToolbar();
            $("#docComponentProject").val(projectId.toString());
            $("canvas").drawLayers();
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

var selectCourse = function(userEid){
    selectStudioTab();
    thisChooser = new chooser(userEid);
    thisChooser.entry();
}

var gotoThisCourse = function(courseId){
    $("#thisCourseId").val(courseId);
    $("#popup").hide();
    thisContentArea = new contentArea();
    thisContentArea.entry();
}

//-----------------------------tab selection-----------------------------------------------

var selectStudioTab = function(){
    $("#studioTab").removeClass("studioTabClassInactive");
    $("#studioTab").addClass("studioTabClassActive");
    $("#previewTab").removeClass("previewTabClassActive");
    $("#previewTab").addClass("previewTabClassInactive");
    $("#dashboardTab").removeClass("dashboardTabClassActive");
    $("#dashboardTab").addClass("dashboardTabClassInactive");
    $("#libraryTab").removeClass("libraryTabClassActive");
    $("#libraryTab").addClass("libraryTabClassInactive");
    $("#libraryContextLine").hide();
    $("#contextLine").show();
    $("#studioDiv").show();
    $("#dashboardDiv").hide();
    $("#libraryDiv").hide();
    $("#previewDiv").hide();

}

var selectPreviewTab = function(){
    $("#studioTab").removeClass("studioTabClassActive");
    $("#studioTab").addClass("studioTabClassInactive");
    $("#previewTab").removeClass("previewTabClassInactive");
    $("#previewTab").addClass("previewTabClassActive");
    $("#dashboardTab").removeClass("dashboardTabClassActive");
    $("#dashboardTab").addClass("dashboardTabClassInactive");
    $("#libraryTab").removeClass("libraryTabClassActive");
    $("#libraryTab").addClass("libraryTabClassInactive");
    var heightCss = cheight+"px";
    $("#previewDiv").css("height", heightCss);
    $("#studioDiv").hide();
    $("#dashboardDiv").hide();
    $("#libraryDiv").hide();
    previewThisCourse($("#componentContext").val());
    $("#previewDiv").show();
}

var selectDashboardTab = function(){
    $("#studioTab").removeClass("studioTabClassActive");
    $("#studioTab").addClass("studioTabClassInactive");
    $("#previewTab").removeClass("previewTabClassActive");
    $("#previewTab").addClass("previewTabClassInactive");
    $("#dashboardTab").removeClass("dashboardTabClassInactive");
    $("#dashboardTab").addClass("dashboardTabClassActive");
    $("#libraryTab").removeClass("libraryTabClassActive");
    $("#libraryTab").addClass("libraryTabClassInactive");
    $("#studioDiv").hide();
    $("#dashboardDiv").show();
    $("#libraryDiv").hide();
    $("#previewDiv").hide();
}
/*
var selectLibraryTab = function(){

    var thisTransaction = urlBase+get_user_courses+"?"+debug;
    $.ajax({
        type: "POST",
        url: thisTransaction,

        success: function(msg) {
            populateNewChooser(msg);
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

*/
var selectLibraryTab = function(){
    var thisLibraryArea = new libraryArea();
    $("#studioTab").removeClass("studioTabClassActive");
    $("#studioTab").addClass("studioTabClassInactive");
    $("#previewTab").removeClass("previewTabClassActive");
    $("#previewTab").addClass("previewTabClassInactive");
    $("#dashboardTab").removeClass("dashboardTabClassActive");
    $("#dashboardTab").addClass("dashboardTabClassInactive");
    $("#libraryTab").removeClass("libraryTabClassInactive");
    $("#libraryTab").addClass("libraryTabClassActive");
    $("#studioDiv").hide();
    $("#dashboardDiv").hide();
    $("#libraryMapArea").hide();
    $("#libraryDiv").show();
    $("#previewDiv").hide();
    $("#libraryContextLine").html(thisLibraryArea.makeCollectionsContextLine(""));
    $("#ctxTop").on('click', function(){
        showCollections();
    });
    $("#libraryContextLine").show();
    $("#contextLine").hide();
    $("#libPopup").hide();
    thisLibraryArea.entry();

}

//-----------------------------path setup  ------------------------------------------------
function wasClicked(layer){
    if(toolListener==undefined) return;
    toolListener(layer);
}
/*




function wasClicked(layer){
    var s = parseInt($("#clickStatus").val());
    switch(s){
        case 0:
            break;
        case 1:
            $("#clickStatus").val("2");
            drawPathEndPrompt();
            $("#newPathStart").val(layer.name);
            break;
        case 2:
            startComponent = findComponent($("#newPathStart").val(), currentComponents);
            endComponent = findComponent(layer.name, currentComponents);
            var thisTransaction = urlBase+insert_this_connection+"?"+debug;
            myData = {startId:startComponent.id, endId:endComponent.id };
            $.ajax({
                type: "POST",
                url: thisTransaction,
                data: myData,
                success: function(msg) {
                    thisId = parseInt(msg);
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
                    thisConnection.setup(startComponentId, thisContextId, thisId);
                },
                error: function(err) {
                    alert(err.toString());
                    if (err.status == 200) {
                        ParseResult(err);
                    }
                    else { alert('Error:' + err.responseText + '  Status: ' + err.status); }
                }

            });
            break;

    }

}
*/

function pathClick(layer){
    console.log("pathClick");
    var listenerToActivate = "ActiveListener_"+layer.name+"()";
    eval(listenerToActivate);

}






//-----------------------------setup edit existing component-------------------------------
function editExistingComponent(layer){
    console.log("editExistingComponent");
    componentToEdit = findComponent(layer.name, currentComponents);
    var thisTransaction = urlBase+load_this_component+"?"+debug;
    var myData = {componentId: layer.name};
    $.ajax({
        type: "POST",
        url: thisTransaction,
        data: myData,
        success: function(msg) {
            component  = eval(msg);
            $("#reLoadContext").val(component.context);
            getComponentConnectionsForEdit(component, layer);
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

function getComponentConnectionsForEdit(component, layer){

    var thisTransaction = urlBase+load_component_connections+"?"+debug;
    var componentId = component['id'];
    var myData = {componentId: componentId};

    $.ajax({
        type: "POST",
        url: thisTransaction,
        data: myData,
        success: function(msg) {
            componentConnections = eval(msg);
            newComp = "thisComp = new "+component.type+"(component)";
            eval(newComp);
            thisComp.contentEdit(thisComp, layer, componentConnections, "popup", $("#subContext").val());
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

function setPathSelect(connections){
    var selectOptions = "";
    for(s=0;s<connections.length;s++){
        thisConn = connections[s];
        selectOptions += "<option value=\""+thisConn['connectionId']+"\">"+thisConn['title']+"<\/option>";
    }
    $("#pathSelectDropDown").append(selectOptions);
}

function mock_updateComponent(x, y, type, title, content, ctx, id, reloadContext){
    console.log('x=',x,'/ny=',y,'/ntitle=', title,'/ntype=',type,'/ncontent=',content,'/nctx=',ctx,'/nid=',id,'/nreloadContext=',reloadContext);
    return 0;
}

function updateComponent(x, y, type, title, content, ctx, id, reloadContext){
    var thisTransaction = urlBase+update_this_component+"?"+debug;
    myData = { xpos:x, ypos:y, componentType:type, content: content, title: title, context: ctx, componentId: id, reloadContext:reloadContext };
    $.ajax({
        type: "POST",
        ctx:reloadContext,
        url: thisTransaction,
        data: myData,
        success: function(msg) {
            var currentSaveContext = parseInt($("#saveContext").val());
            if(msg === "no change"){
                alert("Nothing was changed");
                setupThisProject(this.ctx);
            }
            var reloadThisContext = eval(msg);
            $("#componentEdit").hide();
            if(reloadThisContext == currentSaveContext) {
//                loadContextComponents(reloadThisContext);
                setupThisProject(reloadThisContext);
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
    return;
}



function cancelMc(){
    $("#mcComponentEdit").hide();
}
function cancelEv(){
    $("#componentEventsEdit").hide();
    var thisContextId = $("#componentContext").val();
    reloadAllComponents(thisContextId, true);
}
function cancelTf(){
    $("#tfComponentEdit").hide();
}


var previewThisCourse = function(contextId){
//    $("#thisCourseId").val(courseId);
    $("#popup").hide();
//    thisNavButton = new navButton();
//    thisNavButton.entry();
    thisContentArea = new contentArea();
    thisContentArea.contextId = contextId;
    thisContentArea.selectedComponentId = $("#selectedComponentId").val();

    thisContentArea.entry();
}


//---------------------------------------utility functions-----------------------------------------

function findComponent(layerName, currentComponentArray){
    returnComponent = null;
    for (thisComponent in currentComponentArray) {
        if(currentComponentArray[thisComponent].layerName==layerName || currentComponentArray[thisComponent].id==layerName){
            returnComponent =  currentComponentArray[thisComponent];
        }
    }
    return returnComponent;
}


function changeAction(urlBase, urlAction,  dbg) {
    if(debug!= null){
        document.docAction.action = urlBase +urlAction +"?"+dbg;
        var elem = document.getElementById("debug");
        elem.value = dbg;
    }else{
        document.docAction.action = urlBase +urlAction;
    }

}

function removeAllComponents(){
    $('canvas').clearCanvas();
    $("canvas").removeLayers();
}

function getCanvasHeight(cname){
    var canvas = document.getElementById( cname );
    var ctx = canvas.getContext( '2d' );
    return canvas.height;
}

function getCanvasWidth(cname){
    var canvas = document.getElementById( cname );
    var ctx = canvas.getContext( '2d' );
    return canvas.width;

}
function findCkInstance(n){
    for(t in CKEDITOR.instances){
        thisInstance = CKEDITOR.instances[t];
        if(thisInstance.name =="mcAnsCKEditor"+n) return thisInstance;
    }
    return null;
}

function findCkInstanceByName(name){
    for(t in CKEDITOR.instances){
        thisInstance = CKEDITOR.instances[t];
        if(thisInstance.name ==name) return thisInstance;
    }
    return null;
}

function cancelEntry(){

    $('#popup').hide();
    eatNextClick=true;
    var thisContextId = $("#componentContext").val();
    reloadAllComponents(thisContextId, true);
}

function generateUUID(){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x7|0x8)).toString(16);
    });
    return uuid;
}

function alertPopupHtml(alertText){
    var strVar="";
    strVar += "    <div id=\"alertPopupText\" class=\"alertPopText\">";
    strVar += alertText;
    strVar += "    <\/div>";
    strVar += "    <div class=\"docSubmit\" id=\"addDocSubmit\">";
    strVar += "            <input id=\"confirm\" type=\"submit\" value=\"Go Ahead\"  \/>";
    strVar += "            <input id=\"noconfirm\" type=\"submit\" value=\"Cancel\" \/>";
    strVar += "    <\/div>";
    strVar += "    <input id=\"componentId\" name=\"componentId\" hidden=\"true\" hidden=\"true\" \/>";
    return strVar;


}









