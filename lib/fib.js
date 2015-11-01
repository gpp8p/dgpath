/**
 * Created by georgepipkin on 6/18/14.
 */

function fib(loadedComponent){

    if(typeof loadedComponent=="undefined"){
        this.x = 0;
        this.y = 0;
        this.icon = "fib";
        this.active = false;
        this.layerName = "";
    }else{
        this.x = loadedComponent.x;
        this.y = loadedComponent.y;
        this.title = loadedComponent.title;
        this.icon = "fib";
        thisContent = loadedComponent.content;
        this.content = thisContent;
        this.type = loadedComponent.type;
        this.context = loadedComponent.context;
        this.id = loadedComponent.id;
        this.elementId = loadedComponent.elementId;
        $("#elementId").val(this.elementId);
 //       res = thisContent.replace("\n","\\n");
 //       res = res.replace("{","\\{");
 //       res = res.replace("}","\\}");
 //       parsedContent = jQuery.parseJSON(res);
    }
    this.contentEntry = function(x,y,n,popName,saveContext){
        $("#saveContext").val(saveContext);
        $("#reLoadContext").val($("#subContext").val());
        showFibEntryScreen(this,x,y,n, "entry")};

    this.contentUpdate = function(l){ $("componentId").val(l); updateFib(this,l)};
    this.contentEdit = function(thisComponent,layer, connections, popName, saveContext){
        $("#saveContext").val(saveContext);
        $("#reLoadContext").val($("#subContext").val());
        editFibContent(thisComponent, connections)};
    this.getPathOptions = function(componentId, contextId, connectionId){
        return [];
    };
    this.createComponent = function(layerName){
        ckInstance = findCkInstanceByName("fibContent");
        var qu = ckInstance.getData();
        var newComponentElementId = generateUUID();
        thisComponent.elementId = newComponentElementId;
        processedFib = getComponentEvents(qu,newComponentElementId);
        insertComponent($("#componentX").val(), $("#componentY").val(), "fib", $("#componentTitle").val(), processedFib[0], $("#saveContext").val(), processedFib[1],"false", newComponentElementId, $("#reLoadContext").val());

    };
    this.getUserView = function(componentId){

    }
    var showFibEntryScreen = function(t,x,y,n){
        $('#popup').html(getFibEntryHTML(t.layerName,x,y,n,'entry'));
        $('#popup').show();
        ed = CKEDITOR.replace("fibContent",
            {
                height:"200", width:"800",
                filebrowserBrowseUrl : 'lib/filebrowser.html',
                filebrowserUploadUrl : '/lib/upload.php'

            });
    }
    this.libraryEdit = function(thisComponent){
        setupEdit(thisComponent, "libPopup");
    }

    var editFibContent = function(thisComponent,connections){
        setupEdit(thisComponent,"popup");
        $("#pathSelectDiv").html(getPathSelectHtml());
        setPathSelect(connections);
        $("#pathSelectDropDown").on('change', function(){
            editPath(thisComponent.id, thisComponent.context);
        });
    }

    var setupEdit = function(thisComponent, popName){
        $("#"+popName).html(fibHTML());
        $("#elementId").val(thisComponent.elementId);
        $("#cancel").on("click", function(){
            setupThisProject(thisComponent.context);
            $("#"+popName).html("");
            $("#"+popName).hide();
        });
        $("#save").on("click", function(){
            $("#"+popName).hide();
            updateFib("","");
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
        ed = CKEDITOR.replace("fibContent",
            {
                height:"200", width:"800"
            });

        loadFibContent(thisComponent.id);
    }

    var fibHTML = function(){
        var strVar="";
        strVar += "    <div id=\"componentEdit\" class=\"docComponent\">";
        strVar += "        <div class=\"hdr1\">";
        strVar += "            Fill In The Blank:";
        strVar += "            <div class=\"hdr2\">";
        strVar += "                <input id=\"componentTitle\" name=\"componentTitle\" size=\"40\" placeholder=\"Enter component name here....\">";
        strVar += "            <\/div>";
        strVar += "        <\/div>";
        strVar += "        <textarea class=\"ckeditor\" cols=\"40\" id=\"fibContent\" name=\"fibContent\" rows=\"20\">";
        strVar += "        <\/textarea>";
        strVar += "        <div class=\"docSubmit\" id=\"addTFSubmit\">";
        strVar += "            <input type=\"submit\" value=\"Save \" id=\"save\" \/>";
        strVar += "            <input id = \"delete\" type=\"submit\" value=\"Delete This Component\"\/>";
        strVar += "            <input type=\"submit\" value=\"Cancel\" id=\"cancel\"\/>";
        strVar += "        <\/div>";
        strVar += "        <div id = \"pathSelectDiv\">";
        strVar += "        <\/div>";
        strVar += "    <input id=\"componentX\" name=\"componentX\" hidden=\"true\"  \/>";
        strVar += "    <input id=\"componentY\" name=\"componentY\" hidden=\"true\" \/>";
        strVar += "    <input id=\"componentType\" name=\"componentType\" hidden=\"true\" value=\"truefalse\" \/>";
        strVar += "    <input id=\"componentId\" name=\"componentId\" hidden=\"true\" hidden=\"true\" \/>";
        strVar += "    <input id=\"elementId\" name=\"elementId\" hidden=\"true\" hidden=\"true\" \/>";
        strVar += "    <input id=\"componentContent\" name=\"componentContent\" hidden=\"true\" \/>";
        strVar += "    <input id=\"correctAnswer\" name=\"correctAnswer\" hidden=\"true\" \/>";
        strVar += "    <input id=\"debug\" name=\"debug\" hidden=\"true\" \/>";
        return strVar;
    }




    var getFibEntryHTML= function(layerName,x,y,n, mode){
        var savejs = "saveNewComponent('"+n+"', 'fib');";
        var updatejs = "updateExistingComponent('"+n+"', 'fib');";
        var removejs = "removeComponent('"+n+"', 'fib');";

        var strVar="";
        strVar += "    <div id=\"componentEdit\" class=\"docComponent\">";
        strVar += "        <div class=\"hdr1\">";
        strVar += "            Fill In The Blank:";
        strVar += "            <div class=\"hdr2\">";
        strVar += "                <input id=\"componentTitle\" name=\"componentTitle\" size=\"40\" placeholder=\"Enter component name here....\">";
        strVar += "            <\/div>";
        strVar += "        <\/div>";
        strVar += "        <textarea class=\"ckeditor\" cols=\"40\" id=\"fibContent\" name=\"fibContent\" rows=\"20\">";
        strVar += "        <\/textarea>";
        if(mode=='entry'){
            strVar += "        <div class=\"docSubmit\" id=\"addFibSubmit\">";
            strVar += "            <input type=\"submit\" value=\"Add this fill-in-the-blanks Question\"  onclick=\""+savejs+" return false;\"\/>";
            strVar += "            <input type=\"submit\" value=\"Cancel\"  onclick=\"cancelEntry(); return false;\"\/>";
            strVar += "        <\/div>";
        }else{
            var thisComponentContext = $("#componentContext").val();
            strVar += "        <div class=\"docSubmit\" id=\"addFibSubmit\">";
            strVar += "            <input type=\"submit\" value=\"Save Changes\"  onclick=\""+updatejs+" return false;\"\/>";
            strVar += "            <input type=\"submit\" value=\"Remove\"  onclick=\""+removejs+" return false;\"\/>";
            strVar += "            <input type=\"submit\" value=\"Cancel\"  onclick=\"cancelEntry(); return false;\"\/>";
            strVar += "             <select name=\"pathSelectDropDown\" id = \"pathSelectDropDown\" onchange=\" editPath("+n+","+thisComponentContext+");\">";
            strVar += "                 <option value=\"\">Select A Path To Edit<\/option>";
            strVar += "             <\/select>";
            strVar += "        <\/div>";
        }
        strVar += "    <\/div>";
        strVar += "    <input id=\"componentX\" name=\"componentX\" hidden=\"true\" value=\""+x+"\" \/>";
        strVar += "    <input id=\"componentY\" name=\"componentY\" hidden=\"true\" value=\""+y+"\"\/>";
        strVar += "    <input id=\"componentType\" name=\"componentType\" hidden=\"true\" value=\"fib\" \/>";
        strVar += "    <input id=\"componentId\" name=\"componentId\" hidden=\"true\" hidden=\"true\" value=\""+n+"\"\/>";
        strVar += "    <input id=\"componentContent\" name=\"componentContent\" hidden=\"true\" \/>";
        strVar += "    <input id=\"debug\" name=\"debug\" hidden=\"true\" \/>";

        strVar += "";
        return strVar;
    }
    var getComponentEvents = function(content, compElementId){
        theseEvents = Array();
        var componentElementId = compElementId;
        theseEvents.push(new dgEvent('Component viewed by user',false, componentViewed,'', componentElementId));
        fibChunks = new Array();
        fibContent = "";
        fibChunks = content.split("}");
        for(i=0;i<fibChunks.length;i++){
            thisFibChunk = fibChunks[i];
            thisFibStart = thisFibChunk.indexOf("{");
            if(thisFibStart>0){
                elementId = generateUUID();
                fibContent = fibContent + thisFibChunk.substr(0,thisFibStart);
                fibContent = fibContent + "{"+elementId+"}";
                fibAnswer = thisFibChunk.substr(thisFibStart+1);
                theseEvents.push(new dgEvent('Correct answer fib:'+fibAnswer,false, correctFibAnswer,fibAnswer, elementId));
                theseEvents.push(new dgEvent('Fib answered:',false, fibAnswered,'', elementId));
            }else{
                fibContent = fibContent + thisFibChunk;
            }
        }
        processedFibReturn = Array();
        processedFibReturn.push(fibContent);
        processedFibReturn.push(theseEvents);

        return processedFibReturn;
    }



    var loadFibContent = function(thisId){
        myData = {componentId: thisId};
        var thisTransaction = urlBase+load_fib_elements+"?"+debug;
        $.ajax({
            type: "POST",
            url: thisTransaction,
            data: myData,
            success: function(msg) {
                fibContent = "";
                thisFibComponent = JSON.parse(msg);
                fibChunks = thisFibComponent.content.split("}");
                for(i=0;i<fibChunks.length;i++){
                    thisFibChunk = fibChunks[i];
                    thisFibStart = thisFibChunk.indexOf("{");
                    if(thisFibStart>0){
                        thisFibElementId = thisFibChunk.substr(thisFibStart+1);
                        fibContent = fibContent + thisFibChunk.substr(0,thisFibStart);
                        fibContent = fibContent + "{"+thisFibComponent.fibElements[thisFibElementId]+"}";
                    }else{
                        fibContent = fibContent + thisFibChunk;
                    }
                }
                ckInstance = findCkInstanceByName("fibContent");
                ckInstance.setData(fibContent);
                $("#componentTitle").val(thisFibComponent.title);
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
    var updateFib = function(t,l){
        ckInstance = findCkInstanceByName("fibContent");
        if(ckInstance.checkDirty()){
            newFibContent = ckInstance.getData();
            newFibElements = getComponentEvents(newFibContent,$("#elementId").val());
            myData = { xpos:$("#componentX").val(), ypos:$("#componentY").val(), componentType:"fib", content: newFibElements[0], title: $("#componentTitle").val(), context: $("#componentContext").val(), componentId: $("#componentId").val(), events:newFibElements[1] };
            var thisTransaction = urlBase+update_components_and_events+"?"+debug;
            $.ajax({
                type: "POST",
                url: thisTransaction,
                data: myData,
                success: function(msg) {
                    currentComponentsAndContext = JSON.parse(msg);
                    currentComponents = currentComponentsAndContext[0];
                    removeAllComponents();
                    ckInstance = findCkInstanceByName("fibContent");
                    ckInstance.destroy();
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

        }else{
            $('#popup').html("");
            $('#popup').hide();
        }
    }

    this.entry = function(thisComponent){
        fibChunks = new Array();
        fibContent = "";
        fibChunks = thisComponent.content.split("}");
        for(i=0;i<fibChunks.length;i++){
            thisFibChunk = fibChunks[i];
            thisFibStart = thisFibChunk.indexOf("{");
            if(thisFibStart>0){
                fibContent = fibContent + thisFibChunk.substr(0,thisFibStart);
                fibKey = thisFibChunk.substr(thisFibStart+1);
//                fibContent = fibContent + "<input type=\"text\" size=\"15\" maxlength =\"50\" id=\"fib"+thisComponent.id+"."+i+"\" onkeyup=\"handleKeyUp("+thisComponent.id+","+i+", this);\"  />";
                fibContent = fibContent + "<input type=\"text\" size=\"15\" maxlength =\"50\" id=\"fib"+thisComponent.id+"-"+i+"\"   />";
                fibContent = fibContent + "<input type=\"hidden\" size=\"15\" maxlength =\"50\" id=\"fibval"+thisComponent.id+"-"+i+"\" />";
                fibContent = fibContent + "<input type=\"hidden\" size=\"15\" maxlength =\"50\" id=\"fibkey"+thisComponent.id+"-"+i+"\" value = \""+fibKey+"\" />";
                fibContent = fibContent + "<input type=\"hidden\" size=\"15\" maxlength =\"50\" id=\"fibentered"+thisComponent.id+"-"+i+"\" value = \"1\" />";
            }
        }
        $("#contentArea").append(getFibHtml(fibContent));
        for(i=0;i<fibChunks.length;i++){
            var tFib = "#fib"+thisComponent.id+"-"+i;
            $("#fib"+thisComponent.id+"-"+i).on("keyup input paste", function() {
                var fieldId = this.id;
                fieldId = fieldId.replace("fib", "fibval");
                enteredId = this.id;
                enteredId = enteredId.replace("fib", "fibentered");
                $("#"+fieldId).val($(this).val());
                $("#"+enteredId).val("0");
            });
        }
        var returnFibUserEvents = function(){
            var thisUserEventsArray = [];
            thisUserEventsArray.push(new userEvent(thisComponent.id, "", componentViewed,thisComponent.elementId));
            thisUserEventsArray.push(getFibResults(fibChunks.length-1, thisComponent.id));
            return thisUserEventsArray;
        }
        return returnFibUserEvents;

    }

    var getFibHtml = function(content){
        var strVar = "";
        strVar += "<div class=\"docdiv\"";
        strVar += content;
        strVar += "<\div>";
        return strVar;
    }

    var getFibResults = function(fibCount, fibId){
        var userResponseArray = Array();
        for(f=0;f<fibCount;f++){
            var thisResponse = $("#fibval"+fibId+"-"+f).val();
            thisElementId = $("#fibkey"+fibId+"-"+f).val();
            thisResponded = $("#fibentered"+fibId+"-"+f).val();
            userResponseArray.push(new userEvent(fibId, thisResponse, fibResponse, thisElementId));
            userResponseArray.push(new userEvent(fibId, thisResponded, fibAnswered, thisElementId));
        }
        return userResponseArray;
    }



}

fib.prototype = new component();

var handleKeyUp = function(componentId, fibid, t){
    $("#fibval"+thisComponent.id+"."+i).append(this.Event.key);
}

toolIcons.push("fib");