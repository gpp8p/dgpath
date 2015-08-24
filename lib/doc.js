/**
 * Created with JetBrains WebStorm.
 * User: georgepipkin
 * Date: 5/4/13
 * Time: 7:56 AM
 * To change this template use File | Settings | File Templates.
 */

function doc(component){
    if (typeof component == 'undefined'){
        this.x = 0;
        this.y = 0;
        this.icon = "doc";
        this.active = false;
        this.layerName = "";
    }else{
        this.x = component.x;
        this.y = component.y;
        this.icon="doc";
        this.content = component.content;
        this.title = component.title;
        this.context = component.context;
        this.id = component.id;
        this.type = component.type;
    }
    this.contentEntry = function(x,y,n,popName,saveContext){
        $("#saveContext").val(saveContext);
        $("#reLoadContext").val($("#subContext").val());
        documentEntry(x,y,popName)};
//    this.contentUpdate = function(l){ showDocUpdateScreen(this,l)};
    this.contentEdit = function(thisComponent,layer, connections, popName, saveContext){
        $("#saveContext").val(saveContext);
        $("#reLoadContext").val($("#subContext").val());
        editDocContent(this,thisComponent, layer, connections)};
    this.getPathOptions = function(componentId, contextId, connectionId){
        return [];
    }

    this.libraryEdit = function(thisComponent){
        setupEdit(thisComponent,"libPopup");
    }

    var editDocContent = function(t,thisComponent,l, connections, popName, saveContext){
        setupEdit(thisComponent,"popup");
        $("#pathSelectDiv").html(getPathSelectHtml());
        setPathSelect(connections);
        $("#pathSelectDropDown").on('change', function(){
            editPath(thisComponent.id, thisComponent.context);
        });
    }


    var setupEdit = function(thisComponent, popName){
        $("#"+popName).html(getDocumentHtml());
        $("#cloneDocumentComponent").show();
        $("#cloneDocumentComponent").prop('value', $.t("libraryControlBar.cloneComponent"));
        $("#cloneDocumentComponent").on('click', function(){
            cloneThis("popup3", thisComponent);
        });

        $("#cancel").on("click", function(){
            setupThisProject(thisComponent.context);
            $("#"+popName).html("");
            $("#"+popName).hide();
        });
        $("#save").on("click", function(){
            $("#"+popName).hide();
            updateDocument();
        });
        $("#delete").on("click", function(){
            $("#"+popName).hide();
            deleteComponent($("#componentId").val(), $("#componentTitle").val());
        });


        $("#componentTitle").val(thisComponent.title);
        $("#componentX").val(thisComponent.x);
        $("#componentY").val(thisComponent.y);
        $("#componentType").val(thisComponent.type);
        $("#componentId").val(thisComponent.id);
        $("#componentContext").val(thisComponent.context);
        $("#"+popName).show();
        ed = CKEDITOR.replace("docContent",
            {
                height:"200", width:"800"
            });
        ckInstance = findCkInstanceByName("docContent");
        ckInstance.setData(thisComponent.content);

    }


    this.entry = function(thisComponent){
        $("#contentArea").append(getDocHtml(thisComponent.content));
        var returnDocUserEvents = function(){
            var thisUserEventsArray = [];
            thisUserEventsArray.push(new userEvent(thisComponent.id, "", componentViewed, thisComponent.elementId));
            return thisUserEventsArray;
        }
        return returnDocUserEvents;

    }



    var getDocHtml = function(content){
        var strVar = "";
        strVar += "<div class=\"docdiv\" \>";
        strVar += content;
        strVar += "<\div>";
        return strVar;
    }

    var getDocumentHtml = function (){
        var strVar="";
        strVar += "    <div id=\"componentEdit\" class=\"docComponent\">";
        strVar += "        <div class=\"hdr1\">";
        strVar += "            Learning Component:";
        strVar += "            <div class=\"hdr2\">";
        strVar += "                <input id=\"componentTitle\" name=\"componentTitle\" size=\"40\" placeholder=\"Enter component name here....\">";
        strVar += "            <\/div>";
        strVar += "        <\/div>";
        strVar += "        <textarea class=\"ckeditor\" cols=\"40\" id=\"docContent\" name=\"docContent\" rows=\"20\">";
        strVar += "        <\/textarea>";
        strVar += "        <div class=\"docSubmit\" id=\"addDocSubmit\">";
        strVar += "            <input id = \"save\" type=\"submit\" value=\"Save\" \/>";
        strVar += "            <input id = \"delete\" type=\"submit\" value=\"Delete This Component\"\/>";
        strVar += "            <input id = \"cancel\" type=\"submit\" value=\"Cancel\"\/>";
        strVar += "            <input id = \"cloneDocumentComponent\" type=\"submit\" \/>";
        strVar += "        <\/div>";
        strVar += "        <div id = \"pathSelectDiv\">";
        strVar += "        <\/div>";
        strVar += "    <\/div>";
        strVar += "    <input id=\"componentX\" name=\"componentX\" hidden=\"true\"  \/>";
        strVar += "    <input id=\"componentY\" name=\"componentY\" hidden=\"true\" \/>";
        strVar += "    <input id=\"componentType\" name=\"componentType\" hidden=\"true\" value=\"doc\" \/>";
        strVar += "    <input id=\"componentId\" name=\"componentId\" hidden=\"true\" hidden=\"true\" \/>";
        strVar += "    <input id=\"componentContent\" name=\"componentContent\" hidden=\"true\" \/>";
        strVar += "    <input id=\"debug\" name=\"debug\" hidden=\"true\" \/>";

        return strVar;
    }

    var documentEntry = function(x,y, popName){
        $("#"+popName).html(getDocumentHtml());
        $("#cloneDocumentComponent").hide();
        $("#"+popName).show();
        $("#delete").attr("disabled","disabled");
        $("#cancel").on("click", function(){
            $("#"+popName).html("");
            $("#"+popName).hide();
            eatNextClick=true;
            var thisContextId = $("#componentContext").val();
            reloadAllComponents(thisContextId, true);
        });
        $("#save").on("click", function(){
            $("#"+popName).hide();
            saveDocument();
        });
        $("#componentX").val(x);
        $("#componentY").val(y);
        $("#componentType").val("doc");

        ed = CKEDITOR.replace("docContent",
            {
                height:"200", width:"800",
                filebrowserBrowseUrl : 'lib/filebrowser.html',
                filebrowserUploadUrl : '/lib/upload.php'

            });
    }

    return this;
}

doc.prototype = new component();

function getDocExits(thisComponent, l){
    return [];
}



function showDocEntryScreen(t,x,y,n){
    $('#popup').html(getDocEntryHTML(t.layerName,x,y,n));
    $('#popup').show();

    ed = CKEDITOR.replace("docContent",
        {
            height:"200", width:"800",
            filebrowserBrowseUrl : 'lib/filebrowser.html',
            filebrowserUploadUrl : '/lib/upload.php'

        });
}

function showDocUpdateScreen(l){
    $('#popup').html(getDocUpdateHTML(l.eventX, l.eventY, l.name));
    ed = CKEDITOR.replace("docContent",
        {
            height:"200", width:"800"
        });

}


function getDocEntryHTML(layerName,x,y,n){
    var strVar="";
    strVar += "    <div id=\"componentEdit\" class=\"docComponent\">";
    strVar += "        <div class=\"hdr1\">";
    strVar += "            Learning Component:";
    strVar += "            <div class=\"hdr2\">";
    strVar += "                <input id=\"componentTitle\" name=\"componentTitle\" size=\"40\" placeholder=\"Enter component name here....\">";
    strVar += "            <\/div>";
    strVar += "        <\/div>";
    strVar += "        <textarea class=\"ckeditor\" cols=\"40\" id=\"docContent\" name=\"docContent\" rows=\"20\">";
    strVar += "        <\/textarea>";
    strVar += "        <div class=\"docSubmit\" id=\"addDocSubmit\">";
    strVar += "            <input type=\"submit\" value=\"Add this Document\"  onclick=\"saveDocument(); return false;\"\/>";
    strVar += "            <input type=\"submit\" value=\"Cancel\"  onclick=\"cancelEntry(); return false;\"\/>";
    strVar += "        <\/div>";
    strVar += "    <\/div>";
    strVar += "    <input id=\"componentX\" name=\"componentX\" hidden=\"true\" value=\""+x+"\" \/>";
    strVar += "    <input id=\"componentY\" name=\"componentY\" hidden=\"true\" value=\""+y+"\"\/>";
    strVar += "    <input id=\"componentType\" name=\"componentType\" hidden=\"true\" value=\"doc\" \/>";
    strVar += "    <input id=\"componentId\" name=\"componentId\" hidden=\"true\" hidden=\"true\" value=\""+n+"\"\/>";
    strVar += "    <input id=\"componentContent\" name=\"componentContent\" hidden=\"true\" \/>";
    strVar += "    <input id=\"debug\" name=\"debug\" hidden=\"true\" \/>";

    strVar += "";
    return strVar;
}

function getDocUpdateHTML(x,y,layerName){
    var thisComponentContext = $("#componentContext").val();
    var strVar="";
    strVar += "    <div id=\"componentEdit\" class=\"docComponent\">";
    strVar += "        <div class=\"hdr1\">";
    strVar += "            Learning Document:";
    strVar += "            <div class=\"hdr2\">";
    strVar += "                <input id=\"componentTitle\" name=\"componentTitle\" size=\"40\" placeholder=\"Enter component name here....\">";
    strVar += "            <\/div>";
    strVar += "        <\/div>";
    strVar += "        <textarea class=\"ckeditor\" cols=\"40\" id=\"docContent\" name=\"docContent\" rows=\"20\">";
    strVar += "        <\/textarea>";
    strVar += "        <div class=\"docSubmit\" id=\"updateDocSubmit\">";
    strVar += "            <input type=\"submit\" value=\"Update This Document\"  onclick=\"updateDocument(); return false;\"\/>";
    strVar += "            <input type=\"submit\" value=\"Cancel\"  onclick=\"cancelEntry(); return false;\"\/>";
    strVar += "         <select name=\"pathSelectDropDown\" id = \"pathSelectDropDown\" onchange=\" editPath("+layerName+","+thisComponentContext+");\">";
    strVar += "             <option value=\"\">Select A Path To Edit<\/option>";
    strVar += "         <\/select>";
    strVar += "        <\/div>";
    strVar += "    <\/div>";
    strVar += "    <input id=\"componentX\" name=\"componentX\" hidden=\"true\" value=\""+x+"\" \/>";
    strVar += "    <input id=\"componentY\" name=\"componentY\" hidden=\"true\" value=\""+y+"\"\/>";
    strVar += "    <input id=\"componentType\" name=\"componentType\" hidden=\"true\" value=\"doc\" \/>";
    strVar += "    <input id=\"componentId\" name=\"componentId\" hidden=\"true\" hidden=\"true\" value=\""+layerName+"\"\/>";
    strVar += "    <input id=\"componentContent\" name=\"componentContent\" hidden=\"true\" \/>";
    strVar += "    <input id=\"debug\" name=\"debug\" hidden=\"true\" \/>";
    strVar += "";
    return strVar;
}



function saveDocument(){
    ckInstance = findCkInstanceByName("docContent");
    elementId = generateUUID();
    componentContent = ckInstance.getData();
    insertComponent($("#componentX").val(), $("#componentY").val(), $("#componentType").val(), $("#componentTitle").val(), componentContent, $("#saveContext").val(), getDocumentEvents(elementId),"false", elementId, $("#reLoadContext").val());

}



function updateDocument(){
    ckInstance = findCkInstanceByName("docContent");
    componentContent = ckInstance.getData();
    updateComponent($("#componentX").val(), $("#componentY").val(), $("#componentType").val(), $("#componentTitle").val(), componentContent, $("#componentContext").val(), $("#componentId").val(), $("#reLoadContext").val() );
}

function getDocumentEvents(elementId){
    theseEvents = Array();
    theseEvents.push(new dgEvent('Component viewed by user',false, componentViewed,'', elementId));
    return theseEvents;
}






toolIcons.push("doc");

