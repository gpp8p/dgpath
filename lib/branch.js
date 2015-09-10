/**
 * Created by georgepipkin on 6/14/15.
 */
/**
 * Created by georgepipkin on 6/18/14.
 */

function branch(loadedComponent) {


    var thisComponentId;

    if (typeof loadedComponent == "undefined") {
        this.x = 0;
        this.y = 0;
        this.icon = "branch";
        this.active = false;
        this.layerName = "";
    } else {
        this.x = loadedComponent.x;
        this.y = loadedComponent.y;
        this.title = loadedComponent.title;
        this.icon = "branch";
        thisContent = loadedComponent.content;
        this.content = thisContent;
        this.type = loadedComponent.type;
        this.context = loadedComponent.context;
        this.id = loadedComponent.id;
        thisComponentId = this.id;
        this.elementId = loadedComponent.elementId;
        //       res = thisContent.replace("\n","\\n");
        //       res = res.replace("{","\\{");
        //       res = res.replace("}","\\}");
        //       parsedContent = jQuery.parseJSON(res);
    }
    this.contentEntry = function (x, y, n, popName, saveContext) {
        $("#saveContext").val(saveContext);
        $("#reLoadContext").val($("#subContext").val());
        branchEntryScreen(this,x,y,n, popName);

    };
    this.contentUpdate = function (l) {
        $("componentId").val(l);
        updateBranch(this, l)
    };
    this.contentEdit = function (thisComponent, layer, connections, popName, saveContext) {
        $("#saveContext").val(saveContext);
        $("#reLoadContext").val($("#subContext").val());
        branchEditScreen(thisComponent, popName, connections);

    };
    this.getPathOptions = function (componentId, contextId, connectionId) {
        return [];
    };
    this.createComponent = function (layerName) {

    };
    this.getUserView = function (componentId) {

    };
    this.libraryEdit = function (thisComponent) {
        setupEdit(thisComponent, "libPopup");
    };

    this.displayInit = function (c) {

    }

    var thisObject = this;


    this.entry = function (thisComponent) {


    }

    var passDoorId;
    var failDoorId;
    var branchComponentId;

    var branchEntryScreen = function(t,x,y,n, popName){
        var componentX = x;
        var componentY = y;
        $("#"+popName).html(getBranchDialogHtml(t,x,y,popName));
        $("#branchingComponentTypeLabel").html($.t("branch.branchingComponentTypeLabel"));
        $("#errMsg").html($.t("branch.correctEntries"));
        $("#errMsgArea").hide();
        $("#branchingComponentTitleLabel").html($.t("branch.branchingComponentTitleLabel"));
        $("#noComponentTitle").hide();
        $("#branchingExitOptionLabel").html($.t("branch.branchingExitOptionLabel"));
        $("#branchThreshold").append($('<option>', { selected: false, value :"select" }).text($.t("branch.branchPleaseSelect")));
        $("#branchThreshold").append($('<option>', { selected: false, value :"100" }).text($.t("branch.branchat100")));
        $("#branchThreshold").append($('<option>', { selected: false, value :"95" }).text($.t("branch.branchat95")));
        $("#branchThreshold").append($('<option>', { selected: false, value :"90" }).text($.t("branch.branchat90")));
        $("#branchThreshold").append($('<option>', { selected: false, value :"85" }).text($.t("branch.branchat85")));
        $("#branchThreshold").append($('<option>', { selected: false, value :"80" }).text($.t("branch.branchat80")));
        $("#branchThreshold").append($('<option>', { selected: false, value :"75" }).text($.t("branch.branchat75")));
        $("#branchThreshold").append($('<option>', { selected: false, value :"70" }).text($.t("branch.branchat70")));
        $("#branchThreshold").append($('<option>', { selected: false, value :"65" }).text($.t("branch.branchat65")));
        $("#branchThreshold").append($('<option>', { selected: false, value :"60" }).text($.t("branch.branchat60")));
        $("#branchThreshold").append($('<option>', { selected: false, value :"55" }).text($.t("branch.branchat55")));
        $("#branchThreshold").append($('<option>', { selected: false, value :"50" }).text($.t("branch.branchat50")));
        $("#branchThreshold").append($('<option>', { selected: false, value :"45" }).text($.t("branch.branchat45")));
        $("#branchThreshold").append($('<option>', { selected: false, value :"40" }).text($.t("branch.branchat40")));
        $("#branchThreshold").append($('<option>', { selected: false, value :"35" }).text($.t("branch.branchat35")));
        $("#branchThreshold").append($('<option>', { selected: false, value :"30" }).text($.t("branch.branchat30")));
        $("#branchThreshold").append($('<option>', { selected: false, value :"25" }).text($.t("branch.branchat25")));
        $("#branchThreshold").append($('<option>', { selected: false, value :"20" }).text($.t("branch.branchat20")));
        $("#branchThreshold").append($('<option>', { selected: false, value :"15" }).text($.t("branch.branchat15")));
        $("#branchThreshold").append($('<option>', { selected: false, value :"10" }).text($.t("branch.branchat10")));
        $("#branchThreshold").append($('<option>', { selected: false, value :"05" }).text($.t("branch.branchat05")));
        $("#branchThreshold").append($('<option>', { selected: false, value :"00" }).text($.t("branch.branchat00")));
        $("#createBranch").prop('value', $.t("branch.createBranch"));
        $("#createBranch").on('click', function(){
            var componentTitle = $("#branchingComponentTitleValue").val();
            var ex;
            if($("#buildExitOption").prop('checked')){
                ex=true;
            }else{
                ex=false;
            }
            createBranchComponent(componentX, componentY, $("#branchingComponentTitleValue").val(), ex, popName);
        });
        $("#cancelBranch").prop('value',$.t("branch.cancelBranch"));
        $("#cancelBranch").on('click', function(){
            $("#"+popName).html("");
            $("#"+popName).hide();
            var thisContextId = $("#componentContext").val();
            reloadAllComponents(thisContextId, true);
        });
        $("#removeBranch").prop('value',$.t("branch.removeBranch"));
        $("#removeBranch").hide();
        $("#branchingComponent").css("height", "150px");
        $("#branchingComponent").css("top", "300px");
        $("#"+popName).show();





    }

    var branchEditScreen = function(thisComponent, popName, connections){
        var componentX = thisComponent.x;
        var componentY = thisComponent.y;
        var componentTitle = thisComponent.title;
        var componentId = thisComponent.id;
        var popName = popName;
        $("#"+popName).html(getBranchDialogHtml(thisComponent,componentX,componentY,popName));
        $("#branchingComponentTypeLabel").html($.t("branch.branchingComponentTypeLabel"));
        $("#errMsg").html($.t("branch.correctEntries"));
        $("#errMsgArea").hide();
        $("#branchingComponentTitleLabel").html($.t("branch.branchingComponentTitleLabel"));
        $("#noComponentTitle").hide();
        $("#branchingExitOptionLabel").html($.t("branch.branchingExitOptionLabel"));
        $("#branchingComponentTitleValue").val(thisComponent.title);
        $("#branchThreshold").append($('<option>', { selected: false, value :"select" }).text($.t("branch.branchPleaseSelect")));
        $("#branchThreshold").append($('<option>', { selected: false, value :"95" }).text($.t("branch.branchat95")));
        $("#branchThreshold").append($('<option>', { selected: false, value :"90" }).text($.t("branch.branchat90")));
        $("#branchThreshold").append($('<option>', { selected: false, value :"85" }).text($.t("branch.branchat85")));
        $("#branchThreshold").append($('<option>', { selected: false, value :"80" }).text($.t("branch.branchat80")));
        $("#branchThreshold").append($('<option>', { selected: false, value :"75" }).text($.t("branch.branchat75")));
        $("#branchThreshold").append($('<option>', { selected: false, value :"70" }).text($.t("branch.branchat70")));
        $("#branchThreshold").append($('<option>', { selected: false, value :"65" }).text($.t("branch.branchat65")));
        $("#branchThreshold").append($('<option>', { selected: false, value :"60" }).text($.t("branch.branchat60")));
        $("#branchThreshold").append($('<option>', { selected: false, value :"55" }).text($.t("branch.branchat55")));
        $("#branchThreshold").append($('<option>', { selected: false, value :"50" }).text($.t("branch.branchat50")));
        $("#branchThreshold").append($('<option>', { selected: false, value :"45" }).text($.t("branch.branchat45")));
        $("#branchThreshold").append($('<option>', { selected: false, value :"40" }).text($.t("branch.branchat40")));
        $("#branchThreshold").append($('<option>', { selected: false, value :"35" }).text($.t("branch.branchat35")));
        $("#branchThreshold").append($('<option>', { selected: false, value :"30" }).text($.t("branch.branchat30")));
        $("#branchThreshold").append($('<option>', { selected: false, value :"25" }).text($.t("branch.branchat25")));
        $("#branchThreshold").append($('<option>', { selected: false, value :"20" }).text($.t("branch.branchat20")));
        $("#branchThreshold").append($('<option>', { selected: false, value :"15" }).text($.t("branch.branchat15")));
        $("#branchThreshold").append($('<option>', { selected: false, value :"10" }).text($.t("branch.branchat10")));
        $("#branchThreshold").append($('<option>', { selected: false, value :"05" }).text($.t("branch.branchat05")));
        $("#createBranch").hide();
        $("#removeBranch").prop('value',$.t("branch.removeBranch"));
        $("#removeBranch").on('click', function(){
            $("#"+popName).hide();
            deleteComponent(componentId,componentTitle);
        });
        $("#cancelBranch").prop('value',$.t("branch.cancelBranch"));
        $("#cancelBranch").on('click', function(){
            $("#"+popName).html("");
            $("#"+popName).hide();
            var thisContextId = $("#componentContext").val();
            reloadAllComponents(thisContextId, true);
        });
        $("#branchingComponent").css("height", "150px");
        $("#branchingComponent").css("top", "300px");
        $("#pathSelectDiv").html(getPathSelectHtml());
        setPathSelect(connections);
        $("#pathSelectDropDown").on('change', function(){
            editPath(thisComponent.id, thisComponent.context);
        });
        $("#"+popName).show();


    };

    var getBranchDialogHtml = function(){
        var strVar="";
        strVar += "<div class = \"docComponent\" id = \"branchingComponent\">";
        strVar += "	<div class = \"componentTypeLabel\" id=\"branchingComponentTypeLabel\"><\/div>";
        strVar += "	<div id=\"errMsgArea\">";
        strVar += "        <span class=\"componentTitleLabel\" id = \"errMsg\" style=\"color: red\" ><\/span>";
        strVar += "    <\/div>";
        strVar += "	<div class = \"componentTitleLabel\" id=\"branchingComponentTitle\">";
        strVar += "		<span id = \"branchingComponentTitleLabel\"><\/span>";
        strVar += "     <span>"
        strVar += "		<input type=\"text\" size=\"40\" maxlength=\"60\" id=\"branchingComponentTitleValue\"\/>";
        strVar += "     </span>"
        strVar += "	<\/div>";
        strVar += "	<div class = \"componentTitleLabel\" id=\"branchingComponentOption\">";
        strVar += "		<span id = \"branchingExitOption\"><input type=\"checkbox\" id=\"buildExitOption\" \/><span id = \"branchingExitOptionLabel\"><\/span><select id = \"branchThreshold\"><\/select><\/span>";
        strVar += "	<\/div>";
        strVar += "	<div class= \"submitButtons\">";
        strVar += "		<input type=\"button\" id=\"createBranch\"\/>";
        strVar += "		<input type=\"button\" id=\"cancelBranch\"\/>";
        strVar += "		<input type=\"button\" id=\"removeBranch\"\/>";
        strVar += "	<\/div>";
        strVar += "<div id = \"pathSelectDiv\">";
        strVar += "<\/div>";

        return strVar;
    }

    var createBranchComponent = function(posX, posY, title, doCreateExits, popName){
        var popName = popName;
        if($("#branchThreshold option:selected").val()=="select"  && doCreateExits) {
            $("#errorDialog").html(errorDialogHtml());
            $("#errorDialog").addClass("errorDialog");
            $("#errorContent").html($.t("branch.nopassfail"));
            $("#cancelError").prop('value', $.t("branch.cancelBranch"));
            $("#cancelError").on('click', function () {
                $("#errorDialog").html("");
                $("#errorDialog").hide();
            });
            $("#errorDialog").show();
            return;
        }
        var theseEvents = Array();
        var elementId = generateUUID();
        var posX = posX;
        var posY = posY;
        var createExits = createExits;
        theseEvents.push(new dgEvent('Component viewed by user',false, componentViewed,'', elementId));
        var sevts = JSON.stringify(theseEvents);
        var thisContext = $("#componentContext").val();
        var thisBranchContent = new branchContent(doCreateExits, $("#branchThreshold option:selected").val());
        var thisBranchContentEncoded = JSON.stringify(thisBranchContent);
        myData = { xpos:posX, ypos:posY, type:"branch", content: thisBranchContentEncoded, title: title, context: thisContext, events: sevts, showSub: "false", elementId: elementId, reloadContext:thisContext};
        var thisTransaction = urlBase+insert_component+"?"+debug;
        $.ajax({
            type: "POST",
            url: thisTransaction,
            data: myData,
            success: function(msg) {
                var componentInserted = JSON.parse(msg);
                branchComponentId = componentInserted[1];
                if(doCreateExits){
                    createExitComponents(posX, posY,branchComponentId, popName);
                }else{
                    $("#"+popName).html("");
                    $("#"+popName).hide();
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



    var createExitComponents = function(currentX, currentY, branchComponentId, popName){
        var popName = popName;
        var cwidth = getCanvasWidth('myCanvas');
        var cheight = getCanvasHeight('myCanvas');
        if((cwidth - currentX)< 300){
            errorDialog($.t("branch.moveLeft"));
        }
        if((cheight-currentY)<300){
            errorDialog($.t("branch.moveUp"));
        }
        var exit1X = currentX+200;
        var exit1Y = currentY-50;
        var exit2X = currentX+200;
        var exit2Y = currentY+50;




        var myData = { xpos:exit1X, ypos:exit1Y, type:'exit_door', content: '', title: "pass", context: $("#componentContext").val(), elementId: generateUUID()};
        var thisTransaction = urlBase+insert_exit_door+"?"+debug;
        $.ajax({
            type: "POST",
            url: thisTransaction,
            data: myData,
            success: function(msg) {
                passDoorId = parseInt(msg);
                createExit2(exit2X, exit2Y, popName);
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

    var createExit2 = function(x,y, popName){
        var popName = popName;
        var myData = { xpos:x, ypos:y, type:'exit_door', content: '', title: "fail", context: $("#componentContext").val(), elementId: generateUUID()};
        var thisTransaction = urlBase+insert_exit_door+"?"+debug;
        $.ajax({
            type: "POST",
            url: thisTransaction,
            data: myData,
            success: function(msg) {
                failDoorId = parseInt(msg);
                createPassFailLinks(passDoorId, failDoorId, branchComponentId, popName);
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

    var createPassFailLinks=function(passId, failId, branchId, passFailPoint, popName){
        var popName = popName;
        var myData = {passFailPoint: $("#branchThreshold option:selected").val(), componentId: branchId, passExit:passId, failExit: failId };
        var thisTransaction = urlBase+setup_exit_link+"?"+debug;
        $.ajax({
            type: "POST",
            url: thisTransaction,
            data: myData,
            success: function(msg) {
                $("#"+popName).html("");
                $("#"+popName).hide();
                var thisContextId = $("#componentContext").val();
                reloadAllComponents(thisContextId, true);
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

    var errorDialogHtml = function(){
        var strVar="";
        strVar += "	<div id=\"errorContent\"><\/div>";
        strVar += "	<div id=\"cancelButton\">";
        strVar += "		<input type=\"button\" id=\"cancelError\"\/>";
        strVar += "	<\/div>";
        return strVar;

    }

    var branchContent = function(generateExits, passFailPoint){
        this.generateExits = generateExits;
        this.passFailPoint = passFailPoint;
        return this;
    }
}



branch.prototype = new component();



toolIcons.push("branch");



