/**
 * Created by georgepipkin on 11/2/14.
 */


function libraryArea(){

    this.entry = function(){
        $("#libraryControlArea").html(getLibraryControlHtml());
        $("#cbNewCollection").on('click', function(){
            newCollection();
        });
        if($("#libraryList").children().length >0){

        }else{
            showCollections();
        }
    }

    this.makeCollectionsContextLine = function(thisCollectionTitle){
        return collectionsContextLine(thisCollectionTitle);
    }

    this.addNewComponentTo = function(elementId, contextId, componentId, title, type){
        var liclass = "liCss ";
        switch (type) {
            case "doc":
                liclass = liclass + "docIcon";
                break;
            case "entry_door":
                liclass = liclass + "doorInIcon";
                break;
            case "exit_door":
                liclass = liclass + "exitDoorIcon";
                break;
            case "truefalse":
                liclass = liclass + "truefalseIcon";
                break;
            case "subcontext":
                liclass = liclass + "subcontextIconPlus";
                break;
            case "multichoice":
                liclass = liclass + "multichoiceIcon";
                break;
            case "fib":
                liclass = liclass + "fibIcon";
                break;
        }
        var newComponentId  = elementId + "_fl" + componentId+"-"+contextId;
        var newComponentLine = getComponentLineHTML(newComponentId, contextId, title, liclass, "");
        var attachPoint = getThisParentId(elementId);
        $("#"+attachPoint).append(newComponentLine);
    }


    var newCollection = function(){
        var thisNewCollection = new collection();
        thisNewCollection.contentEntry();
    }
    var getLibraryControlHtml = function(){

        var strVar="";
        var newCollection = $.t("libraryControlBar.newCollection");
        var pasteComponent = $.t("libraryControlBar.pasteComponent");
        strVar += "<table border=\"0\" class=\"libraryControlTable\">";
        strVar += "	<tr>";
        strVar += "		<td id=\"cbNewCollection\" class = \"libraryControlBarCss\">"+newCollection+"<\/td>";
        strVar += "		<td id=\"cbPasteComponent\" class = \"libraryControlBarCss\">"+pasteComponent+"<\/td>";
        strVar += "	<\/tr>";
        strVar += "<\/table>";
        return strVar;
    }

    var showCollections;
    showCollections = function () {
        var thisTransaction = urlBase + get_user_collections + "?" + debug;
        $.ajax({
            type: "POST",
            url: thisTransaction,
            success: function (msg) {
                var collectionTitles = JSON.parse(msg);
                $("#libraryList").html("");
//                $("#libraryList").append("<ul class=\"ulCss\" >");
                for (i = 0; i < collectionTitles.length; i++) {
                    var thisCollection = collectionTitles[i];
                    var thisCollectionId = thisCollection[1];
                    $("#libraryList").append(getCollectionLine(thisCollection));
                    $("#cl" + thisCollection[1] + "_openCollection").on('click', function () {
                        openCollection(this.id.substring(2), this.innerHTML, arguments[0]);
                    });
                    $("#cl" + thisCollection[1] + "_addFolder").on('click', function () {
                        addFolderToCollection(thisCollectionId);
                    });
                    $("#cl" + thisCollection[1] + "_copyCollection").on('click', function () {
                        copyCollection(thisCollectionId, this.innerHTML, arguments[0]);
                    });
                    $("#cl" + thisCollection[1] + "_pasteItem").on('click', function () {
                        pasteToCollection(thisCollectionId, this.innerHTML, arguments[0]);
                    });
                    $("#cl" + thisCollection[1] + "_deleteCollection").on('click', function () {
                        deleteCollection(thisCollectionId, this.innerHTML, arguments[0]);
                    });

                }
//                $("#libraryList").append("</ul>");
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
    };


    var addFolderToCollection = function(collectionId, collectionTitle, thisEvent){
        var thisFolder = new folder();
        thisFolder.collectionId = collectionId;
        thisFolder.contentEntry();
        thisEvent.stopPropagation();
    }

    var copyCollection = function(collectionId, collectionTitle, thisEvent){

    }

    var pasteToCollection = function(collectionId, collectionTitle, thisEvent){

    }

    var deleteCollection = function(collectionId, collectionTitle, thisEvent){

    }
    //  note: not right.  No table herer - shouldn't this be a UL ?

    var getCollectionLine= function(collectionLineData){
        var strVar="";
        var thisId = "cl"+collectionLineData[1];
        var addFolderLabel = $.t("libraryControlBar.addFolderLabel");
        var copyCollectionLabel = $.t("libraryControlBar.copyCollectionLabel");
        var pasteIntoCollection = $.t("libraryControlBar.pasteIntoCollection");
        var deleteCollection = $.t("libraryControlBar.deleteCollection");
        var openCollectionLabel = $.t("libraryControlBar.openCollectionLabel");
        var titleLine = "<table border = \"0\" width=\"100%\">";
        titleLine += "<tr><td class=\"collectionDescription collectionTitle\" width=\"20%\">"+collectionLineData[0]+"</td><td width=\"50%\" class=\"collectionDescription\">"+collectionLineData[2]+"</td></td width=\"30%\"><td class=\"collectionDescription\" align=\"right\">";
        titleLine += "<span id=\""+thisId+"_openCollection\" class=\"libraryControlBarCss\">"+openCollectionLabel+"</span><span id=\""+thisId+"_addFolder\" class=\"libraryControlBarCss\">"+addFolderLabel+"</span><span id=\""+thisId+"_copyCollection\" class=\"libraryControlBarCss\">"+copyCollectionLabel+"</span><span id=\""+thisId+"_pasteItem\" class=\"libraryControlBarCss\">"+pasteIntoCollection+"</span><span id=\""+thisId+"_deleteCollection\" class=\"libraryControlBarCss\">"+deleteCollection+"</span></td></tr>";
        titleLine += "</table>";
        strVar += "<div id = \"cl"+collectionLineData[1]+"\" class=\"liCss\">"+titleLine+"<\/div>";
        return strVar;
    }

    var openCollection = function(collectionId, collectionTitle, e){
        var thisTransaction = urlBase+get_context_titles+"?"+debug;
        var isSelectClick = "N";
        if(e.metaKey){
            isSelectClick = "Y";
        }
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
                titleLine = "<div id = \"cl"+thisCollectionId+"\" class=\"liCss\">"+collectionTitle+"<\/div>";
                $("#libraryContextLine").html(thisLibraryArea.makeCollectionsContextLine(collectionTitle));
                $("#libraryCtxTop").on('click', function(){
                    var thisLibraryArea = new libraryArea();
                    $("#libraryContextLine").html(thisLibraryArea.makeCollectionsContextLine(""));
                    showCollections();
                });
//                titleLine = "<div id = \""+thisCollectionId+"\" class=\"contextTopCss\"><\/div>";
                $("#libraryList").html(titleLine);


/*
                $("#cl"+thisCollectionId).on('click', function(){
                    $(this).html("");
                    $("#libraryList").html("");
                    showCollections();
                });
*/
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





    var traverseContext;
    traverseContext = function (thisCollectionId, contextComponents, attachTo, sClick) {
//    var subElements = "<ul class=\"subElementList\">";
        var subElements = "";
        for (i = 0; i < contextComponents.length; i++) {
            thisContextComponent = contextComponents[i];
            var liclass = "liCss ";
            switch (thisContextComponent.type) {
                case "doc":
                    liclass = liclass + "docIcon";
                    break;
                case "entry_door":
                    liclass = liclass + "doorInIcon";
                    break;
                case "exit_door":
                    liclass = liclass + "exitDoorIcon";
                    break;
                case "truefalse":
                    liclass = liclass + "truefalseIcon";
                    break;
                case "subcontext":
                    liclass = liclass + "subcontextIconPlus";
                    break;
                case "multichoice":
                    liclass = liclass + "multichoiceIcon";
                    break;
                case "fib":
                    liclass = liclass + "fibIcon";
                    break;
                case "folder":
                    liclass = liclass + "folderIcon";
                    break;

            }
            var elementId;
            var contextId;
            if(thisContextComponent.type=='folder' | thisContextComponent.type=='subcontext'){
                elementId = thisCollectionId + "_fl" + thisContextComponent.id+"-"+thisContextComponent.subcontext;
                contextId = thisContextComponent.subcontext;
            }else{
                elementId = thisCollectionId + "_fl" + thisContextComponent.id+"-"+thisContextComponent.context;
                contextId = thisContextComponent.context;
            }
            switch (thisContextComponent.type) {
                case "subcontext":
                    subElements = subElements + "<div id=\"" + elementId + "\" onclick=\"openSubContext('" + elementId + "','" + contextId + "',event);return false;\" class=\"" + liclass + "\">" + thisContextComponent.title + "</div>";
                    break;
                case "folder":
//                    subElements = subElements+"<div id=\""+elementId+"\" onclick=\"openFolder('"+elementId+"','"+contextId+"',event);return false;\" class=\""+liclass+"\">"+thisContextComponent.title+"</div>";
                    subElements = subElements + getFolderLineHTML(elementId, contextId, thisContextComponent.title, liclass, thisContextComponent.description);
                    break;
                default:
//                    subElements = subElements + "<div id=\"" + elementId + "\" onclick=\"openComponent('" + elementId + "',event);return false;\" class=\"" + liclass + "\">" + thisContextComponent.title + "</div>";
                    subElements = subElements + getComponentLineHTML(elementId, contextId, thisContextComponent.title, liclass, "");
                    break;
            }
        }
        var thisDivHtml = $("#" + attachTo).html();
        $("#" + attachTo).append(subElements);
        if (sClick == "Y") {
            $(".selectedItem").removeClass("selectedItem");
            $("#" + attachTo).addClass("selectedItem");
        }
        for (i = 0; i < contextComponents.length; i++) {
            thisContextComponent = contextComponents[i];
            var elementId;
            var contextId;
            if(thisContextComponent.type=='folder' | thisContextComponent.type=='subcontext'){
                elementId = thisCollectionId + "_fl" + thisContextComponent.id+"-"+thisContextComponent.subcontext;
                contextId = thisContextComponent.subcontext;
            }else{
                elementId = thisCollectionId + "_fl" + thisContextComponent.id+"-"+thisContextComponent.context;
                contextId = thisContextComponent.context;
            }
//            var thisId = "fl"+thisContextComponent.id+"-"+contextId;
            switch (thisContextComponent.type) {
                case "subcontext":

                    break;
                case "folder":
                    $("#"+elementId+"_openFolder").on('click', function(event){
                        var sourceElementId = event.target.attributes.id.value;
                        var thisContextId = getThisContextId(sourceElementId);
                        openSubContext(sourceElementId, thisContextId, event);
                    });
                    $("#"+elementId+"_addComponent").on('change', function(event){
                        var sourceElementId = event.target.attributes.id.value;
                        var optionSelected = $("#"+sourceElementId).val();
                        switch(optionSelected){
                            case "doc":
                                addToFolder(sourceElementId, event);
                                break;
                            case "fib":
                                addToFolder(sourceElementId, event);
                                break;
                            case "truefalse":
                                addToFolder(sourceElementId, event);
                                break;
                            case "multichoice":
                                addToFolder(sourceElementId, event);
                                break;
                            case "folder":
                                addToFolder(sourceElementId, event);
                                break;
                            case "paste":
                                showClipboardContents(event);
                                break;
                            default:
                                break;
                        }
                    });
                    break;
                default:
                    $("#"+elementId+"_openComponent").on('click', function(event){
                        var sourceElementId = event.target.attributes.id.value;
                        var thisComponentId = getThisComponentId(sourceElementId);
                        openComponent(sourceElementId, thisComponentId, event);

                    });

                    break;
            }

        }
    };


    var getFolderLineHTML = function(elementId, contextId, title, liclass, description){
//        var thisEidComponents = elementId.split("_");
//        var thisEid = thisEidComponents[0].substring(2);
        var thisId = elementId;
        var thisAddSelect = "<select id=\""+thisId+"_addComponent\">";
        thisAddSelect += "<option value=\"0\">Do something with this folder</option>";
        thisAddSelect += "<option value=\"doc\">Add Document</option>";
        thisAddSelect += "<option value=\"truefalse\">Add True-False</option>";
        thisAddSelect += "<option value=\"multichoice\">Add Multiple Choice</option>";
        thisAddSelect += "<option value=\"fib\">Add Fill-In Blank</option>";
        thisAddSelect += "<option value=\"folder\">Add Folder</option>";
        thisAddSelect += "<option value=\"copy\">Copy This Folder</option>";
        thisAddSelect += "<option value=\"paste\">Paste Into This Folder</option>";
        thisAddSelect += "<option value=\"edit\">Edit This Folder's Meta-Data</option>";
        thisAddSelect += "<option value=\"delete\">DeleteThis Folder</option>";
        thisAddSelect += "</select>";


        var addToFolderLabel = $.t("libraryControlBar.addToFolderLabel");
        var copyFolderLabel = $.t("libraryControlBar.copyFolderLabel");
        var pasteIntoFolder = $.t("libraryControlBar.pasteIntoFolder");
        var deleteFolder = $.t("libraryControlBar.deleteFolder");
        var openFolderLabel = $.t("libraryControlBar.openFolderLabel");

        var strVar = "<div id=\""+thisId+"\" class=\"libTop\">";
        strVar += "<table border = \"0\" class=\"libTable\" width=\"100%\">";
        strVar += "<tr><td class=\"collectionDescription collectionTitle\" width=\"20%\"><span id = \""+thisId+"_openFolder\" class = \""+liclass+"\">"+title+"</span></td><td width=\"35%\" class=\"collectionDescription\">"+description+"</td></td width=\"45%\"><td class=\"collectionDescription\" align=\"right\">";
 //       strVar += "<span id=\""+thisId+"_openFolder\" class=\"libraryControlBarCss\">"+openFolderLabel+"</span><span id=\""+thisId+"_copyFolder\" class=\"libraryControlBarCss\">"+copyFolderLabel+"</span><span id=\""+thisId+"_pasteIntoFolder\" class=\"libraryControlBarCss\">"+pasteIntoFolder+"</span><span id=\""+thisId+"_deleteFolder\" class=\"libraryControlBarCss\">"+deleteFolder+"</span><span id=\""+thisId+"_addToFolder\" >"+thisAddSelect+"</span></td></tr>";
        strVar += "<span id=\""+thisId+"_addToFolder\" class=\"selectEvt\" >"+thisAddSelect+"</span></td></tr>";
        strVar += "</table>";
        strVar += "</div>";
        return strVar;
    }

    var getComponentLineHTML;
    getComponentLineHTML = function(elementId, contextId, title, liclass, description){
        var thisId = elementId;
        var thisComponentSelect = "<select id=\""+thisId+"_componentActionSelect\">";
        thisComponentSelect += "<option value=\"0\">Do something with this component</option>";
        thisComponentSelect += "<option value=\"copy\">Copy This Component</option>";
        thisComponentSelect += "<option value=\"edit\">Edit This Component</option>";
        thisComponentSelect += "<option value=\"delete\">Delete This Component</option>";
        thisComponentSelect += "</select>";


        var strVar = "<div id=\""+thisId+"\" class=\"libTop\">";
        strVar += "<table border = \"0\" class=\"libTable\" width=\"100%\">";
        strVar += "<tr><td class=\"collectionDescription collectionTitle\" width=\"20%\"><span id = \""+thisId+"_openComponent\" class = \""+liclass+"\">"+title+"</span></td><td width=\"35%\" class=\"collectionDescription\">"+description+"</td></td width=\"45%\"><td class=\"collectionDescription\" align=\"right\">";
        strVar += "<span id=\""+thisId+"_componentAction\" class=\"selectEvt\" >"+thisComponentSelect+"</span></td></tr>";
        strVar += "</table>";
        strVar += "</div>";
        return strVar;

    }

    var addToFolder;
    addToFolder = function(elementId, e){
        var componentToAdd = $("#"+elementId).val();
        $("#"+elementId).val("0");
 //       var newComp = "thisLibraryComponent = new "+componentToAdd+"(thisComponent)";
        var newComp = "thisLibraryComponent = new "+componentToAdd+"()";
        eval(newComp);
        thisLibraryComponent.context = getThisContextId(elementId);
        $("#libraryLocation").val(elementId);
        thisLibraryComponent.contentEntry(0,0,0,"libPopup",thisLibraryComponent.context);


    }


    var collectionsContextLine= function(thisCollectionTitle){
        var collectionTitleReturn = "<span id=\"libraryCtxTop\" class=\"collectionTop ctxInfo\">My Collections&nbsp;&nbsp;&nbsp;</span> <span class=\"ctxInfo\">:"+thisCollectionTitle+"</span>";
        return collectionTitleReturn;

    }

    var openSubContext = function(elementId, thisContextId,e){
        var thisTransaction = urlBase+get_context_titles+"?"+debug;
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
                var parentId = getThisParentId(thisCollectionId);
                var childComponents = $("#"+parentId).children();
                if(childComponents.length>1){
                    if(selectClick=="N"){
                        for(c=0;c<childComponents.length;c++){
                            thisChildComponent = childComponents[c];
                            $("#"+thisChildComponent.id).remove();
                        }
 //                       $("#"+thisCollectionId).removeClass("subcontextIconMinus");
 //                       $("#"+thisCollectionId).addClass("subcontextIconPlus");
                        $("#"+thisCollectionId).removeClass("selectedItem");
                    }else{
                        $("#"+thisCollectionId).addClass("selectedItem");
                    }
                }else{
//                    $("#"+thisCollectionId).addClass("subcontextIconMinus");
//                    $("#"+thisCollectionId).removeClass("subcontextIconPlus");

                    traverseContext(thisCollectionId, collectionTree, parentId, selectClick);
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

    var getThisContextId;
    getThisContextId = function(sourceElement){
        var sourceElementComponents = sourceElement.split("_");
        var sourceElementComponentsLength = sourceElementComponents.length;
        var thisId = sourceElementComponents[sourceElementComponentsLength-2];
        var idComponents = thisId.split("-");
        return idComponents[1];
    }

    var getThisComponentId;
    getThisComponentId = function(sourceElement){
        var sourceElementComponents = sourceElement.split("_");
        var sourceElementComponentsLength = sourceElementComponents.length;
        var thisId = sourceElementComponents[sourceElementComponentsLength-2];
        var idComponents = thisId.split("-");
        var componentId = idComponents[0];
        return componentId.substring(2);
    }

    var getThisCollectionId;
    getThisCollectionId = function(sourceElement){
        var sourceElementComponents = sourceElement.split("_");
        var thisCollectionElement = sourceElementComponents[0];
        return thisCollectionElement.substring(2);
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

    var showClipboardContents;
    showClipboardContents = function(e){
        e.stopPropagation();
        var thisTransaction = urlBase+clone_context+"?"+debug;
        var myData = {clipboard:$("#clipboard").val()};
        $.ajax({
            type: "POST",
            url: thisTransaction,
            data: myData,
            success: function(msg) {
                var thisContextMap = JSON.parse(msg);
                alert("success!");
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



    }






var openComponent = function(elementId, componentId, e){
    if(e.metaKey){
        if($("#"+elementId).hasClass("selectedItem")){
            $("#"+elementId).removeClass("selectedItem");
        }else{
            $("#"+elementId).addClass("selectedItem");
        }
    }else{
        var thisTransaction = urlBase+load_this_component+"?"+debug;
//        elementPieces = elementId.split("-");
//        thisId = elementPieces[elementPieces.length-1];
        var myData = {componentId: componentId};
        $.ajax({
            type: "POST",
            url: thisTransaction,
            data: myData,
            success: function(msg) {
                thisComponent = msg;
                var newComp = "thisLibraryComponent = new "+thisComponent.type+"(thisComponent)";
                eval(newComp);
                thisLibraryComponent.libraryEdit(thisLibraryComponent);
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
    e.stopPropagation();
}



