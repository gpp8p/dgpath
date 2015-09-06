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

    var branchEntryScreen = function(t,x,y,n, popName){
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
        strVar += "	<span id = \"pathSelectDiv><\/span>";
        strVar += "<\/div>";
        return strVar;
    }
}


branch.prototype = new component();



toolIcons.push("branch");



