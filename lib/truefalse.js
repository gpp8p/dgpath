/**
 * Created by georgepipkin on 3/27/14.
 */

function truefalse(loadedComponent){
    if(typeof loadedComponent=="undefined"){
        this.x = 0;
        this.y = 0;
        this.icon = "truefalse";
        this.active = false;
        this.layerName = "";
    }else{
        this.x = loadedComponent.x;
        this.y = loadedComponent.y;
        this.title = loadedComponent.title;
        this.icon = "truefalse";
        this.context = loadedComponent.context;
        this.id = loadedComponent.id;
        this.type = loadedComponent.type;
        thisContent = loadedComponent.content;
        res = thisContent.replace("\n","\\n");
        parsedContent = jQuery.parseJSON(res);
        this.question = parsedContent['question'];
        this.answer = parsedContent['answer'];
    }
    this.contentEntry = function(x,y,n,popName,saveContext){
        $("#saveContext").val(saveContext);
        $("#reLoadContext").val($("#subContext").val());
        showTFEntryScreen(x,y, popName)};
        $("#delete").attr("disabled","disabled");


    this.contentUpdate = function(l){ updateTf(this,l)};
    this.contentEdit = function(thisComponent,layer, connections, popName, saveContext){
        $("#saveContext").val(saveContext);
        $("#reLoadContext").val($("#subContext").val());
        editTFContent(this,thisComponent, layer, connections)};

    this.getPathOptions = function(componentId, contextId, connectionId){
        return [];
    };
    this.createComponent = function(layerName){
        ckInstance = findCkInstanceByName("tfContent");
        var qu = ckInstance.getData();
        var ans = $("#correctAnswer").val();
        var content = {question:qu, answer:ans};
        packedContent = JSON.stringify(content);
        correctAnswerSpec = ans;
        correctAnswerLabel = ans;
        thisElementId = generateUUID();
        insertComponent($("#componentX").val(), $("#componentY").val(), "truefalse", $("#componentTitle").val(), packedContent, $("#saveContext").val(), getComponentEvents(correctAnswerSpec, correctAnswerLabel, thisElementId),"false", thisElementId, $("#reLoadContext").val());
    };
    this.getUserView = function(componentId){

    }




    var showTFEntryScreen = function(x,y,popName){
        $("#"+popName).html(getTfHTML());
        $("#"+popName).show();
        $("#cancel").on("click", function(){
            $("#"+popName).html("");
            $("#"+popName).hide();
            eatNextClick=true;
            var thisContextId = $("#componentContext").val();
            reloadAllComponents(thisContextId, true);
        });
        $("#save").on("click", function(){
            $("#"+popName).hide();
            saveTf();
            eatNextClick=true;
            var thisContextId = $("#componentContext").val();
            reloadAllComponents(thisContextId, true);
        });
        $("#tfTrue").on("click", function(){
            $("#correctAnswer").val('true');
        });
        $("#tfFalse").on("click", function(){
            $("#correctAnswer").val('false');
        });
        $("#componentX").val(x);
        $("#componentY").val(y);
        $("#componentType").val("truefalse");
        ed = CKEDITOR.replace("tfContent",
            {
                height:"200", width:"800",
                filebrowserBrowseUrl : 'lib/filebrowser.html',
                filebrowserUploadUrl : '/lib/upload.php'

            });
    }
/*
    var editTFContent = function(t,thisComponent, layer, connections){
        $('#popup').html(getTFEntryHTML(t.layerName, t.x, t.y,layer.name,'edit'));
        setPathSelect(connections);
        $('#popup').show();
        ed = CKEDITOR.replace("tfContent",
            {
                height:"200", width:"800",
                filebrowserBrowseUrl : 'lib/filebrowser.html',
                filebrowserUploadUrl : '/lib/upload.php'

            });
        ed.setData(t.question);
        $("#componentTitle").val(t.title);
        tfId = layer.name+".correct";
        if(t.answer=='true'){
            $('input[name="' + tfId+ '"][value=true]').prop('checked', true);
            $("#correctAnswer").val('true');
        }else{
            $('input[name="' + tfId+ '"][value=false]').prop('checked', true);
            $("#correctAnswer").val('false');
        }

    }
*/
    var editTFContent = function(t,thisComponent,l, connections){
        setupEdit(thisComponent,"popup");
        $("#pathSelectDiv").html(getPathSelectHtml());
        setPathSelect(connections);
        $("#pathSelectDropDown").on('change', function(){
            editPath(thisComponent.id, thisComponent.context);
        });
    }

    this.libraryEdit = function(thisComponent){
        setupEdit(thisComponent,"libPopup");
    }

    var setupEdit = function(thisComponent, popName){
        $("#"+popName).html(getTfHTML());
        $("#cancel").on("click", function(){
            setupThisProject(thisComponent.context);
            $("#"+popName).html("");
            $("#"+popName).hide();
        });
        $("#save").on("click", function(){
            $("#"+popName).hide();
            updateTf("","");
        });
        $("#delete").on("click", function(){
            $("#"+popName).hide();
            deleteComponent($("#componentId").val(), $("#componentTitle").val());
        });
        if(thisComponent.answer=="true"){
            $('input[name="tfRadio"][value=true]').prop('checked', true);
            $("#correctAnswer").val('true');
        }else{
            $('input[name="tfRadio"][value=false]').prop('checked', true);
            $("#correctAnswer").val('true');
        }
        $("#tfTrue").on("click", function(){
            $("#correctAnswer").val('true');
        });
        $("#tfFalse").on("click", function(){
            $("#correctAnswer").val('false');
        });
        $("#componentTitle").val(thisComponent.title);
        $("#componentX").val(thisComponent.x);
        $("#componentY").val(thisComponent.y);
        $("#componentType").val(thisComponent.type);
        $("#componentId").val(thisComponent.id);
        $("#componentContext").val(thisComponent.context);
        $("#"+popName).show();
        ed = CKEDITOR.replace("tfContent",
            {
                height:"200", width:"800"
            });
        ckInstance = findCkInstanceByName("tfContent");
        ckInstance.setData(thisComponent.question);

    }

    var updateTf = function(t,l){
        ckInstance = findCkInstanceByName("tfContent");
        var qu = ckInstance.getData();
        var ans = $("#correctAnswer").val();
        var content = {question:qu, answer:ans};
        packedContent = JSON.stringify(content);
        $('#popup').hide();
        updateComponent($("#componentX").val(), $("#componentY").val(), $("#componentType").val(), $("#componentTitle").val(), packedContent, $("#componentContext").val(), $("#componentId").val(), $("#reLoadContext").val() );
    };

    var saveTf = function(){
        ckInstance = findCkInstanceByName("tfContent");
        var qu = ckInstance.getData();
        var ans = $("#correctAnswer").val();
        var content = {question:qu, answer:ans};
        packedContent = JSON.stringify(content);
        correctAnswerSpec = ans;
        correctAnswerLabel = ans;
        thisElementId = generateUUID();
        insertComponent($("#componentX").val(), $("#componentY").val(), "truefalse", $("#componentTitle").val(), packedContent, $("#saveContext").val(), getComponentEvents(correctAnswerSpec, correctAnswerLabel, thisElementId),"false", thisElementId, $("#reLoadContext").val());
    }

    var getTfHTML = function(){
        var strVar="";
        strVar += "    <div id=\"tfComponentEdit\" class=\"tfComponent\">";
        strVar += "        <div class=\"hdr8\">";
        strVar += "            True/False Question:";
        strVar += "                <input id=\"componentTitle\" class=\"inpStyle\" name=\"componentTitle\" size=\"40\" placeholder=\"Enter component name here....\">";
        strVar += "        <\/div>";
        strVar += "        <textarea class=\"ckeditor\" cols=\"40\" id=\"tfContent\" name=\"tfContent\" rows=\"20\">";
        strVar += "        <\/textarea>";
        strVar += "        <table border=\"0\" width= \"90%\">";
        strVar += "            <tr>";
        strVar += "                <td width=\"40%\" align=\"right\"><span class=\"hdr3\">Correct Answer:<\/span><\/td><td width=\"30%\"><span class=\"hdr9\">True - <input type=\"radio\" name=\"tfRadio\" id=\"tfTrue\" value=\"true\" /></span><\/td><td width=\"30%\"><span class=\"hdr10\">False -<input type=\"radio\"  name=\"tfRadio\" id=\"tfFalse\" value=\"false\" /></span><\/td>";
        strVar += "            <\/tr>";
        strVar += "        <\/table>";
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
        strVar += "    <input id=\"componentContent\" name=\"componentContent\" hidden=\"true\" \/>";
        strVar += "    <input id=\"correctAnswer\" name=\"correctAnswer\" hidden=\"true\" \/>";
        strVar += "    <input id=\"debug\" name=\"debug\" hidden=\"true\" \/>";
        return strVar;
    }



    var getTFEntryHTML = function(layerName,x,y,n,mode){
        var savejs = "saveNewComponent('"+n+"', 'truefalse');";
        var updatejs = "updateExistingComponent('"+n+"', 'truefalse');";
        var removejs = "removeComponent('"+n+"', 'truefalse');";
        var tfId = n+".correct";
        var correctClick = "onClick=$(\"#correctAnswer\").val(\"true\"); ";
        var incorrectClick = "onClick=$(\"#correctAnswer\").val(\"false\"); ";
        var strVar="";
        strVar += "    <div id=\"tfComponentEdit\" class=\"tfComponent\">";
        strVar += "        <div class=\"hdr8\">";
        strVar += "            True/False Question:";
        strVar += "                <input id=\"componentTitle\" class=\"inpStyle\" name=\"componentTitle\" size=\"40\" placeholder=\"Enter component name here....\">";
        strVar += "        <\/div>";
        strVar += "        <textarea class=\"ckeditor\" cols=\"40\" id=\"tfContent\" name=\"tfContent\" rows=\"20\">";
        strVar += "        <\/textarea>";
        strVar += "        <table border=\"0\" width= \"90%\">";
        strVar += "            <tr>";
        strVar += "                <td width=\"40%\" align=\"right\"><span class=\"hdr3\">Correct Answer:<\/span><\/td><td width=\"30%\"><span class=\"hdr9\">True - <input type=\"radio\" name=\""+tfId+"\" id=\""+tfId+"\" "+correctClick+"value=\"true\" /></span><\/td><td width=\"30%\"><span class=\"hdr10\">False -<input type=\"radio\" "+incorrectClick+" name=\""+tfId+"\" id=\""+tfId+"\" value=\"false\" /></span><\/td>";
        strVar += "            <\/tr>";
        strVar += "        <\/table>";
        if(mode=='entry'){
            strVar += "        <div class=\"docSubmit\" id=\"addTFSubmit\">";
            strVar += "            <input type=\"submit\" value=\"Add this T/F Question\"  onclick=\""+savejs+" return false;\"\/>";
            strVar += "            <input type=\"submit\" value=\"Cancel\"  onclick=\"cancelEntry(); return false;\"\/>";
            strVar += "        <\/div>";
        }else{
            var thisComponentContext = $("#componentContext").val();
            strVar += "        <div class=\"docSubmit\" id=\"addTFSubmit\">";
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
        strVar += "    <input id=\"componentType\" name=\"componentType\" hidden=\"true\" value=\"truefalse\" \/>";
        strVar += "    <input id=\"componentId\" name=\"componentId\" hidden=\"true\" hidden=\"true\" value=\""+n+"\"\/>";
        strVar += "    <input id=\"componentContent\" name=\"componentContent\" hidden=\"true\" \/>";
        strVar += "    <input id=\"correctAnswer\" name=\"correctAnswer\" hidden=\"true\" \/>";
        strVar += "    <input id=\"debug\" name=\"debug\" hidden=\"true\" \/>";

        strVar += "";
        return strVar;
    }



    var getComponentEvents = function(correctAnswerSpec, correctAnswerLabel, elementId){
        theseEvents = Array();
        theseEvents.push(new dgEvent('Component viewed by user',false, componentViewed,'', elementId));
        theseEvents.push(new dgEvent('True answer selected',false,tfTrueSelected,'', elementId));
        theseEvents.push(new dgEvent('False answer selected',false,tfFalseSelected,'', elementId));
        theseEvents.push(new dgEvent('True-False was answered',false,tfClicked,'', elementId));
        theseEvents.push(new dgEvent('Answer ('+correctAnswerLabel+') selected',false,tfAnswer,correctAnswerSpec, elementId));
        return theseEvents;
    }

    var getUserViewHTML = function(componentId, title, content){
        var trueClick = "onClick=$(\"#C"+componentId+"\").val(\"true\"); ";
        var falseClick = "onClick=$(\"#C"+componentId+"\").val(\"false\"); ";
        var parsedContent = JSON.parse(content);

        var strVar="";
        strVar += "    <div id=\"tfComponentEdit\" class=\"tfView\">";
        strVar += "        <div class=\"tfViewTitle\">";
        strVar += "             "+title;
        strVar += "        <\/div>";
        strVar += "        <div class=\"tfViewQuestion\">";
        strVar += "             "+parsedContent['question'];
        strVar += "        <\/div>";
        strVar += "        <table border=\"0\" width= \"90%\">";
        strVar += "            <tr>";
        strVar += "                <td width=\"40%\" align=\"right\"><span class=\"hdr3\">Your Answer:<\/span><\/td><td width=\"30%\"><span class=\"hdr9\">True - <input type=\"radio\" name=\""+tfId+"\" id=\""+tfId+"\" "+trueClick+"value=\"true\" /></span><\/td><td width=\"30%\"><span class=\"hdr10\">False -<input type=\"radio\" "+falseClick+" name=\""+tfId+"\" id=\""+tfId+"\" value=\"false\" /></span><\/td>";
        strVar += "            <\/tr>";
        strVar += "        <\/table>";
        strVar += "    <\/div>";
        strVar += "    <input id=\"C"+componentId+"\" name=\"C"+componentId+"\" hidden=\"true\" \/>";

    }

    this.entry = function(thisComponent){
        var filteredContent = thisComponent.content.replace("\n", "\\n");
        var contentComponents = JSON.parse(filteredContent);
        $("#contentArea").append(getTrueFalseHtml(contentComponents.question,thisComponent.id));
        $("#tftrue"+thisComponent.id).bind("click", function(){ $("#tfval"+thisComponent.id).val("true"); });
        $("#tffalse"+thisComponent.id).bind("click", function(){ $("#tfval"+thisComponent.id).val("false"); });
        var returnDocUserEvents = function(){
            var thisUserEventsArray = [];
            thisUserEventsArray.push(new userEvent(thisComponent.id, "", componentViewed, thisComponent.elementId));
            var valueEntered = $("#tfval"+thisComponent.id).val();
            if(valueEntered =="not_entered"){
                thisUserEventsArray.push(new userEvent(thisComponent.id, "1", tfClicked, thisComponent.elementId));
            }else{
                thisUserEventsArray.push(new userEvent(thisComponent.id, "0", tfClicked, thisComponent.elementId));
            }
            thisUserEventsArray.push(new userEvent(thisComponent.id, $("#tfval"+thisComponent.id).val(), tfAnswer, thisComponent.elementId));
            return thisUserEventsArray;
        }
        return returnDocUserEvents;
    }

    var getTrueFalseHtml = function(question, id){
        var strVar = "";
        strVar += "<div class=\"tfdiv\"";
        strVar += question;
        strVar += "<table border = \"0\">";
        strVar += "	<tr>";
        strVar += "		<td>True - <\/td><td><input type=\"radio\" id=\"tftrue"+id+"\" name=\"tf"+id+"\" value = \"true\" \/><\/td>";
        strVar += "	<\/tr>";
        strVar += "	<tr>";
        strVar += "		<td>False - <\/td><td><input type=\"radio\" id=\"tffalse"+id+"\" name=\"tf"+id+"\" value = \"true\" \/><\/td>";
        strVar += "	<\/tr>";
        strVar += "<\/table>";
        strVar += "<\div>";
        strVar += "<input type = \"hidden\" id=\"tfval"+id+"\"  value = \"not_entered\" \/>";
        return strVar;
    }








}

truefalse.prototype = new component();
toolIcons.push("truefalse");
