/**
 * Created by georgepipkin on 10/9/14.
 */


function multichoice(loadedComponent){

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
        this.icon = "multichoice";
        thisContent = loadedComponent.content;
        this.content = thisContent;
        this.context = loadedComponent.context;
        this.id = loadedComponent.id;
        this.type = loadedComponent.type;
        this.elementId = loadedComponent.elementId;
    }

    this.contentEntry = function(x,y,n,popName,saveContext){
        $("#saveContext").val(saveContext);
        $("#reLoadContext").val($("#subContext").val());
        showMcEntryScreen(this,x,y,n, "entry")};


    this.contentUpdate = function(l){ updateMc(this,l)};
    this.contentEdit = function(thisComponent,layer, connections, popName, saveContext){
        $("#saveContext").val(saveContext);
        $("#reLoadContext").val($("#subContext").val());
        editMcContent(thisComponent, connections)};

    this.getPathOptions = function(componentId, contextId, connectionId){
        return [];
    };
    this.createComponent = function(layerName){
        showMcEntryScreen(this,x,y,n, "entry");
    };
    this.getUserView = function(componentId){

    };
    this.libraryEdit = function(thisComponent){
        setupEdit(thisComponent, "libPopup")
    }

    var editMcContent = function(thisComponent, connections){

        setupEdit(thisComponent,"popup");
        $("#pathSelectDiv").html(getPathSelectHtml());
        $("#elementId").val(thisComponent.elementId);
        setPathSelect(connections);
        $("#pathSelectDropDown").on('change', function(){
            editPath(thisComponent.id, thisComponent.context);
        });
    }


    var setupEdit = function(thisComponent, popName){
        $("#"+popName).html(mcHTML());
        $("#componentId").val(thisComponent.id);
        $("#componentX").val(thisComponent.x);
        $("#componentY").val(thisComponent.y);
        $('#saveAllMcItemsButton').on('click', function(){
            $("#"+popName).hide();
            updateExistingComponent($("#componentId").val(), 'multichoice');
        });
        $('#addMcItemButton').on("click", function(){
            addMcItem();
        });
        $('#cancelMcEntry').on("click", function(){
            setupThisProject(thisComponent.context);
            $("#"+popName).html("");
            $("#"+popName).hide();
        });
        $("#delete").on("click", function(){
            $("#"+popName).hide();
            deleteComponent($("#componentId").val(), $("#componentTitle").val());
        });
        ed = CKEDITOR.replace("mcQuestion",
            {
                height:"200", width:"800",
                enterMode : CKEDITOR.ENTER_BR,
                shiftEnterMode: CKEDITOR.ENTER_P,
                filebrowserBrowseUrl : 'lib/filebrowser.html',
                filebrowserUploadUrl : '/lib/upload.php'

            });
        $("#"+popName).show();
        loadMcContent(thisComponent.id);
    }

        var showMcEntryScreen = function(t,x,y,n){
        $('#popup').html(getMcEntryHTML(t.layerName,x,y,n,'entry'));
        $('#popup').show();
        $("#delete").attr("disabled","disabled");
        $('#saveAllMcItemsButton').on("click", function(){
            saveAllItems();
        });
        $('#addMcItemButton').on("click", function(){
            addMcItem();
        });
        $('#cancelMcEntry').on("click", function(){
            cancelEntry();
        });
        $('#answerEntryPopup').hide();
        ed = CKEDITOR.replace("mcQuestion",
            {
                height:"100", width:"800",
                enterMode : CKEDITOR.ENTER_BR,
                shiftEnterMode: CKEDITOR.ENTER_P,
                filebrowserBrowseUrl : 'lib/filebrowser.html',
                filebrowserUploadUrl : '/lib/upload.php'

            });
        $('#answerList').sortable();

    }

    var mcHTML = function(){
        var strVar="";
        strVar += "    <div id=\"componentEdit\" class=\"mcComponent\">";
        strVar += "        <div class=\"hdr8\">";
        strVar += "             Multiple Choice Question:";
        strVar += "             <input id=\"componentTitle\" name=\"componentTitle\" size=\"40\" placeholder=\"Enter component name here....\">";
        strVar += "        <\/div>";
        strVar += "        <div class=\"hdr11\">";
        strVar += "        Question:";
        strVar += "        <\/div>";
        strVar += "        <textarea class=\"ckeditor\" cols=\"40\" id=\"mcQuestion\" name=\"mcQuestion\" rows=\"10\">";
        strVar += "        <\/textarea>";

        strVar += "    <div id=\"controlBar\" class=\"ctlBar\" >";
        strVar += "    <input type=\"button\" id=\"addMcItemButton\" value=\"Add Answer\" \/>";
        strVar += "    <input type=\"button\" id=\"saveAllMcItemsButton\" value=\"Save Everything\" \/>";
        strVar += "    <input id = \"delete\" type=\"submit\" value=\"Delete This Component\"\/>";
        strVar += "    <input type=\"submit\" id=\"cancelMcEntry\" value=\"Cancel\"  \/>";
        strVar += "    <span id = \"pathSelectDiv\">";
        strVar += "    <\/span>";
        strVar += "    <\/div>";
        strVar += "    <div class=\"hdr11\">";
        strVar += "        Answers:";
        strVar += "    <\/div>";
        strVar += "    <div id=\"answerList\">";
        strVar += "    <\/div>";
        strVar += "    <input id=\"componentX\" name=\"componentX\" hidden=\"true\"  \/>";
        strVar += "    <input id=\"componentY\" name=\"componentY\" hidden=\"true\" \/>";
        strVar += "    <input id=\"componentType\" name=\"componentType\" hidden=\"true\" value=\"doc\" \/>";
        strVar += "    <input id=\"componentId\" name=\"componentId\" hidden=\"true\" hidden=\"true\" \/>";
        strVar += "    <input id=\"componentContent\" name=\"componentContent\" hidden=\"true\" \/>";
        strVar += "    <input id=\"elementId\" name=\"elementId\" hidden=\"true\" \/>";
        strVar += "    <input id=\"debug\" name=\"debug\" hidden=\"true\" \/>";
        return strVar;
    }



    var getMcEntryHTML = function(t,x,y,n,mode){

        var strVar="";
        strVar += "    <div id=\"componentEdit\" class=\"mcComponent\">";
        strVar += "        <div class=\"hdr8\">";
        strVar += "             Multiple Choice Question:";
        strVar += "             <input id=\"componentTitle\" name=\"componentTitle\" size=\"40\" placeholder=\"Enter component name here....\">";
        strVar += "        <\/div>";
        strVar += "        <div class=\"hdr11\">";
        strVar += "        Question:";
        strVar += "        <\/div>";
        strVar += "        <textarea class=\"ckeditor\" cols=\"40\" id=\"mcQuestion\" name=\"mcQuestion\" rows=\"10\">";
        strVar += "        <\/textarea>";

        strVar += "    <div id=\"controlBar\" class=\"ctlBar\" >";
        strVar += "    <input type=\"button\" id=\"addMcItemButton\" value=\"Add Answer\" \/>";
        strVar += "    <input type=\"button\" id=\"saveAllMcItemsButton\" value=\"Save Everything\" \/>";
        strVar += "    <input type=\"submit\" id=\"cancelMcEntry\" value=\"Cancel\"  \/>";
        strVar += "    <\/div>";
        strVar += "    <div class=\"hdr11\">";
        strVar += "        Answers:";
        strVar += "    <\/div>";
        strVar += "    <div id=\"answerList\">";
        strVar += "    <\/div>";
        if(mode=='edit'){
            var thisComponentContext = $("#componentContext").val();
            strVar += "        <div class=\"docSubmit\" id=\"addMcSubmit\">";
            strVar += "             <select name=\"pathSelectDropDown\" id = \"pathSelectDropDown\" onchange=\" editPath("+n+","+thisComponentContext+");\">";
            strVar += "                 <option value=\"\">Select A Path To Edit<\/option>";
            strVar += "             <\/select>";
            strVar += "        <\/div>";
        }
        strVar += "    <input id=\"componentX\" name=\"componentX\" hidden=\"true\" value=\""+x+"\" \/>";
        strVar += "    <input id=\"componentY\" name=\"componentY\" hidden=\"true\" value=\""+y+"\"\/>";
        strVar += "    <input id=\"componentType\" name=\"componentType\" hidden=\"true\" value=\"multichoice\" \/>";
        strVar += "    <input id=\"componentId\" name=\"componentId\" hidden=\"true\" hidden=\"true\" value=\""+n+"\"\/>";
        strVar += "    <input id=\"componentContent\" name=\"componentContent\" hidden=\"true\" \/>";
        strVar += "    <input id=\"elementId\" name=\"elementId\" hidden=\"true\" \/>";
        strVar += "    <input id=\"debug\" name=\"debug\" hidden=\"true\" \/>";
        strVar += "";
        return strVar;


    }

    var saveAllItems = function(){
        var answers = [];
        $("#answerList div").each(function(){
                var thisId = this.id;
                thisId = thisId.substring(2);
                selectedAnswer=$("#"+thisId).html();
                var isCorrect;
                if($("#ca-"+thisId).prop("checked")){
                    isCorrect="1";
                }else{
                    isCorrect="0";
                }
                var thisAnswer = [];
                thisAnswer[0]=isCorrect;
                thisAnswer[1]=selectedAnswer;
                thisAnswer[2]=thisId;
                answers.push(thisAnswer);
        });
        ckInstance = findCkInstanceByName("mcQuestion");
        var thisQuestion = ckInstance.getData();
        var results = [];
        results.push(thisQuestion);
        results.push(answers);
        elementId = generateUUID();
        var componentEvents = getComponentEvents(results,elementId);
        var resultsJson = JSON.stringify(results);

        insertComponent($("#componentX").val(), $("#componentY").val(), "multichoice", $("#componentTitle").val(), resultsJson, $("#saveContext").val(), componentEvents,"false", elementId, $("#reLoadContext").val());


    }

    var getComponentEvents = function(content, mcElementId){
        theseEvents = Array();
//        elementId = generateUUID();
        theseEvents.push(new dgEvent('Component viewed by user',false, componentViewed,'', mcElementId));
        theseEvents.push(new dgEvent('Multiple choice clicked',false, mcClicked, "",mcElementId));
        var theseAnswers = content[1];
        for (i = 0; i < theseAnswers.length; i++) {
            var thisAnswer = theseAnswers[i];
            var thisAnswerContent = thisAnswer[1].substring(0,35);
//            var thisAnswerContent = i.toString()+") chosen - "+thisAnswer[1].substring(0,25);
            theseEvents.push(new dgEvent(thisAnswerContent,false, mcAnswerX, thisAnswer[2],mcElementId));
            if(thisAnswer[0]=='1'){
//                var correctAnswerContent = "Correct answer ("+ i.toString()+") chosen";
                var correctAnswerContent = thisAnswer[1].substring(0,25);
                theseEvents.push(new dgEvent(correctAnswerContent,false, mcCorrect, thisAnswer[2],mcElementId));
            }
        }
        return theseEvents;
    }





    var loadMcContent = function(componentId){
        myData = {componentId: componentId};
        var thisTransaction = urlBase+load_this_component+"?"+debug;
        $.ajax({
            type: "POST",
            url: thisTransaction,
            data: myData,
            success: function(msg) {
                mcContent = JSON.parse(msg.content);
                ckInstance = findCkInstanceByName("mcQuestion");
                ckInstance.setData(mcContent[0]);
                $("#componentTitle").val(msg.title);
                $('#answerList').sortable();
                var answers = mcContent[1];
                for (i = 0; i < answers.length; i++) {
                    var thisAnswer = answers[i];
                    var answerDiv = getAnswerHTML(thisAnswer[1], thisAnswer[2]);
                    $("#answerList").append(answerDiv);
                    if(thisAnswer[0]=="1"){
                        $("#ca-"+thisAnswer[2]).prop("checked", true);
                    }
                }
                $("#elementId").val(msg.elementId);


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

    var updateMc = function(t,l){
        var answers = [];
        $("#answerList div").each(function(){
            var thisId = this.id;
            thisId = thisId.substring(2);
            selectedAnswer=$("#"+thisId).html();
            var isCorrect;
            if($("#ca-"+thisId).prop("checked")){
                isCorrect="1";
            }else{
                isCorrect="0";
            }
            var thisAnswer = [];
            thisAnswer[0]=isCorrect;
            thisAnswer[1]=selectedAnswer;
            thisAnswer[2]=thisId;
            answers.push(thisAnswer);
        });
        ckInstance = findCkInstanceByName("mcQuestion");
        var thisQuestion = ckInstance.getData();
        var results = [];
        results.push(thisQuestion);
        results.push(answers);
        var resultsJson = JSON.stringify(results);
        var componentEvents = getComponentEvents(results, $("#elementId").val());
        myData = { xpos:$("#componentX").val(), ypos:$("#componentY").val(), componentType:"multichoice", content: resultsJson, title: $("#componentTitle").val(), context: $("#componentContext").val(), componentId: $("#componentId").val(), events:componentEvents };
        var thisTransaction = urlBase+update_components_and_events+"?"+debug;

        $.ajax({
            type: "POST",
            url: thisTransaction,
            data: myData,
            success: function(msg) {
                currentComponentsAndContext = JSON.parse(msg);
                currentComponents = currentComponentsAndContext[0];
                removeAllComponents();

                $('#popup').hide();
                alert("You will need to re-enter all navigation rules for this component");
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

    this.entry = function(thisComponent){

        mcContent = JSON.parse(thisComponent.content)
        $("#contentArea").append("<div>"+mcContent[0]+"</div>");
        var mcAnswers = mcContent[1];
        for(i=0;i<mcAnswers.length;i++){
            var thisMcAnswer = mcAnswers[i];
            $("#contentArea").append("<div>");
            var thisMcName = "mc"+thisComponent.id;
            var thisOptionId = "mc-"+thisMcAnswer[2];
            $("#contentArea").append(getAnswerHtmlEntry(thisMcAnswer[1], thisOptionId, thisMcName));
            $("#"+thisOptionId).on("click", function(){
                $("#mcval"+thisComponent.id).val(this.id.substring(3));
            });
            $("#contentArea").append("</div>");

        }
        var userEntry= "<input type = \"hidden\" id=\"mcval"+thisComponent.id+"\"  value = \"not_entered\" \/>";
        $("#contentArea").append(userEntry);

        var returnMcUserEvents = function(){
            var thisUserEventsArray = [];
            thisUserEventsArray.push(new userEvent(thisComponent.id, "", componentViewed,thisComponent.elementId));
            var valueEntered = $("#mcval"+thisComponent.id).val();
            if(valueEntered =="not_entered"){
                thisUserEventsArray.push(new userEvent(thisComponent.id, "1", mcClicked, thisComponent.elementId));
            }else{
                thisUserEventsArray.push(new userEvent(thisComponent.id, "0", mcClicked, thisComponent.elementId));
            }
            thisUserEventsArray.push(new userEvent(thisComponent.id, $("#mcval"+thisComponent.id).val(), mcAnswerX, thisComponent.elementId));
            return thisUserEventsArray;
        }
        return returnMcUserEvents;
    }


    var getAnswerHtmlEntry = function(thisAnswerText, thisAnswerNumber, thisAnswerName){
        strVar3 ="";
        strVar3 += "<div >"
        strVar3 += "<table>";
        strVar3 += "<tr>";
        strVar3 += "<td width=\"15%\">";
        strVar3 += "<input type=\"radio\" name = \""+thisAnswerName+"\" id=\""+thisAnswerNumber+"\">";
        strVar3 += "</td>";
        strVar3 += "<td  width=\"85%\">";
        strVar3 += thisAnswerText;
        strVar3 += "</td>";
        strVar3 += "</tr>";
        strVar3 += "</table>";
        strVar3 += "</div>";
        return strVar3;
    }






}

function addMcItem(){

    strVar2 ="";
    strVar2 += "        <div class=\"mcAnswer\">";

    strVar2 += "            <div class=\"hdr11\">";
    strVar2 += "                Please enter this answer:";
    strVar2 += "            </div>";
    strVar2 += "            <textarea class=\"ckeditor\" cols=\"40\" id=\"mcAnswer\" name=\"mcAnswer\" rows=\"10\">";
    strVar2 += "            <\/textarea>";
    strVar2 += "            <div class=\"mcAnswerCmd\">";
    strVar2 += "                <input type=\"button\" id=\"changeMcItemButton\" value=\"Ok\" \/>";
    strVar2 += "                <input type=\"button\" id=\"saveThisMcItemButton\" value=\"Add This Answer\" onclick=\"addThisMcItem\(\);return false;\"\/>";
    strVar2 += "                <input type=\"button\" id=\"removeMcItemButton\" value=\"Remove This Answer\" \/>";
    strVar2 += "                <input type=\"button\" id=\"cancelMcItemButton\" value=\"Cancel\" onclick=\"cancelMcItem\(\);return false;\"\/>";
    strVar2 += "            </div>";
    strVar2 += "        </div>";


    $("#popup2").html(strVar2);
    $("#popup2").css('position', 'absolute');
    $("#popup2").css('top', '0px');
    $("#changeMcItemButton").hide();
    $("#saveThisMcItemButton").show();
    $("#popup2").show();
    ed2 = CKEDITOR.replace("mcAnswer",
        {
            height:"100", width:"600",
            enterMode : CKEDITOR.ENTER_BR,
            shiftEnterMode: CKEDITOR.ENTER_P,
            filebrowserBrowseUrl : 'lib/filebrowser.html',
            filebrowserUploadUrl : '/lib/upload.php'

        });

}

function cancelMcItem(){
    $("#popup2").hide();
}

function addThisMcItem(){
    ckInstance = findCkInstanceByName("mcAnswer");
    var thisAnswerText = ckInstance.getData();
    var answerCount = $("#answerList div").children().length;
    $("#popup2").hide();
    var answerDiv = getAnswerHTML(thisAnswerText, generateUUID());
    $("#answerList").append(answerDiv);


}


function editMcAnswer(answerId){
    var selectedAnswerId;
    var selectedAnswer;
    answerFound = false;
    $("#answerList div").each(function(){
        if(this.id=="a-"+answerId){
            selectedAnswer=$("#"+answerId).html();
            answerFound=true;
        }
    });
    if(answerFound){
        $("#a-"+answerId).removeClass("listItem");
        $("#a-"+answerId).addClass("listItemFreeze");
        addMcItem();
        ckInstance = findCkInstanceByName("mcAnswer");
        ckInstance.setData(selectedAnswer);
        $("#changeMcItemButton").show();
        $("#changeMcItemButton").on("click", function(){
            ckInstance = findCkInstanceByName("mcAnswer");
            var updatedAnswer = ckInstance.getData();
            $("#"+answerId).html(updatedAnswer);
            $("#popup2").hide();
            $("#a-"+answerId).removeClass("listItemFreeze");
            $("#a-"+answerId).addClass("listItem");

        });
        $("#saveThisMcItemButton").hide();

    }else{
        alert("error with mc item");
    }

}

function getAnswerHTML(thisAnswerText, thisAnswerNumber){
    strVar3 ="";
    strVar3 += "<div id = \"a-"+thisAnswerNumber+"\" class=\"listItem\" >"
    strVar3 += "<table>";
    strVar3 += "<tr>";
    strVar3 += "<td width=\"15%\">";
    strVar3 += "<input type=\"radio\" name = \"mcAnswer\" id=\"ca-"+thisAnswerNumber+"\">";
    strVar3 += "</td>";
    strVar3 += "<td onclick=\"editMcAnswer\(\'"+thisAnswerNumber+"\'\);return false;\" id=\""+thisAnswerNumber+"\" width=\"85%\">";
    strVar3 += thisAnswerText;
    strVar3 += "</td>";
    strVar3 += "</tr>";
    strVar3 += "</table>";
    strVar3 += "</div>";
    return strVar3;
}


multichoice.prototype = new component();
toolIcons.push("multichoice");


