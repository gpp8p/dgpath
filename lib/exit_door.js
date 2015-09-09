/**
 * Created by georgepipkin on 12/27/13.
 */

function exit_door(component){
    if (typeof component == 'undefined'){
        this.x = 0;
        this.y = 0;
        this.icon = "exit_door";
        this.active = false;
        this.layerName = "";
    }else{
        this.x = component.x;
        this.y = component.y;
        this.icon="exit_door";
        this.content = component.content;
        this.title = component.title;
        this.context = component.context;
        this.id = component.id;
        this.type = component.type;
    }
    var componentId = this.id;
    var componentTitle = this.title;
    this.contentEntry = function(x,y,n,popName,saveContext){
        $("#saveContext").val(saveContext);
        $("#reLoadContext").val($("#subContext").val());
        showExEntryScreen(this,x,y,n)};

//    this.contentUpdate = function(l){ showExUpdateScreen(this,l)};
    this.contentEdit = function(thisComponent,l, connections, popName, saveContext){
        $("#saveContext").val(saveContext);
        $("#reLoadContext").val($("#subContext").val());
        editExContent(thisComponent,connections)};

    this.entry = function(thisComponent){
        var returnExitDoorUserEvents = function(id){
            var thisUserEventsArray = [];
            thisUserEventsArray.push(new userEvent(thisComponent.id, "", exitDoorExited,thisComponent.elementId));
            return thisUserEventsArray;
        }
        return returnExitDoorUserEvents;
    }

    this.libraryEdit = function(thisComponent){
        setupEdit(thisComponent, "popup");
    }

    var editExContent = function(thisComponent, popName){
        setupEdit(thisComponent,"popup");
        $("#pathSelectDiv").html(getPathSelectHtml());
        setPathSelect(connections);
        $("#pathSelectDropDown").on('change', function(){
            editPath(thisComponent.id, thisComponent.context);
        });
    }

    var setupEdit = function(thisComponent, popName){
        $("#"+popName).html(getExHTML());
        $("#cancel").on("click", function(){
            setupThisProject(thisComponent.context);
            $("#"+popName).html("");
            $("#"+popName).hide();
        });
        $("#save").on("click", function(){
            $("#"+popName).hide();
            updateComponent($("#componentX").val(), $("#componentY").val(), $("#componentType").val(), $("#exitTitle").val(), "", $("#componentContext").val(), $("#componentId").val(), $("#reLoadContext").val() );;
        });
        $("#removeExit").prop('value', $.t("nav.removeComponent"));
        $("#removeExit").on('click', function(){
            $("#"+popName).hide();
            deleteComponent(componentId,componentTitle);
        });
        $("#exitTitle").val(thisComponent.title);
//        $("#componentTitle").val(thisComponent.title);
        $("#componentX").val(thisComponent.x);
        $("#componentY").val(thisComponent.y);
        $("#componentType").val(thisComponent.type);
        $("#componentId").val(thisComponent.id);
        $("#componentContext").val(thisComponent.context);
        $("#"+popName).show();

    }



    var getExHTML = function(){
        var strVar="";
        strVar += "    <div id=\"componentEdit\" class=\"contextComponent\">";
        strVar += "            <div class=\"hdr3\">";
        strVar += "                Exit Label:<input id=\"exitTitle\" name=\"exitTitle\" size=\"60\" placeholder=\"Enter Exit Label here...\">";
        strVar += "            <\/div>";
        strVar += "        <br/>"
        strVar += "        <div class=\"docSubmit\" id=\"addExitSubmit\">";
        strVar += "            <input type=\"submit\" value=\"Save \" id=\"save\" \/>";
        strVar += "            <input type=\"submit\" value=\"Cancel\" id=\"cancel\"\/>";
        strVar += "            <input type=\"submit\" value=\"Cancel\" id=\"removeExit\"\/>";
        strVar += "        <\/div>";
        strVar += "        <div id = \"pathSelectDiv\">";
        strVar += "        <\/div>";
        strVar += "    <\/div>";
        strVar += "    <input id=\"componentX\" name=\"componentX\" hidden=\"true\" \/>";
        strVar += "    <input id=\"componentY\" name=\"componentY\" hidden=\"true\" \/>";
        strVar += "    <input id=\"componentType\" name=\"componentType\" hidden=\"true\" value=\"subcontext\" \/>";
        strVar += "    <input id=\"componentId\" name=\"componentId\" hidden=\"true\" hidden=\"true\" \/>";
        strVar += "    <input id=\"componentContent\" name=\"componentContent\" hidden=\"true\" \/>";
        strVar += "    <input id=\"debug\" name=\"debug\" hidden=\"true\" \/>";

        strVar += "";
        return strVar;
    }
}

exit_door.prototype = new component();


function showExEntryScreen(t,x,y,n){
    $('#popup').html(getExEntryHTML(t.layerName,x,y,n));
    $('#popup').show();
}



function getExEntryHTML(layerName,x,y,n){
    var strVar="";
    strVar += "    <div id=\"componentEdit\" class=\"contextComponent\">";
    strVar += "            <div class=\"hdr3\">";
    strVar += "                Exit Label:<input id=\"exitTitle\" name=\"exitTitle\" size=\"60\" placeholder=\"Enter Exit Label here...\">";
    strVar += "            <\/div>";
    strVar += "        <br/>"
    strVar += "        <div class=\"docSubmit\" id=\"addDocSubmit\">";
    strVar += "            <input type=\"submit\" value=\"Create  this Exit\"  onclick=\"createExit(); return false;\"\/>";
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

function createExit(){
    myData = { xpos:$("#componentX").val(), ypos:$("#componentY").val(), type:'exit_door', content: '', title: $("#exitTitle").val(), context: $("#componentContext").val(), elementId: generateUUID()};
    var thisTransaction = urlBase+insert_exit_door+"?"+debug;
    $.ajax({
        type: "POST",
        url: thisTransaction,
        data: myData,
        success: function(msg) {
            reloadAllComponents($("#componentContext").val());
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

toolIcons.push("exit_door");

