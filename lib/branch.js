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
        showBranchDialogfunction(t,x,y,popName);

    }

    var showBranchDialogfunction(t,x,y,popName){

    }

    var getBranchDialogHtml = function(){
        var strVar="";
        strVar += "<div class = \"docComponent\" id = \"branchingComponent\">";
        strVar += "	<div class = \"componentTypeLabel\" id=\"branchingComponentTypeLabel\"><\/div>";
        strVar += "	<div id=\"errMsgArea\">";
        strVar += "        <span class=\"componentTitleLabel\" style=\"color: red\" >Please correct entries marked in red below<\\/span>";
        strVar += "    <\\/div>";
        strVar += "	<div class = \"componentTitleLabel\" id=\"branchingComponentTitle\">";
        strVar += "		<span id = \"branchingComponentTitleLabel\"><\/span>";
        strVar += "		<input type=\"text\" size=\"40\" maxlength=\"60\" id=\"branchingComponentTitleValue\"\/><span class=\"componentTitleLabel\" style=\"color: red\" id=\"noComponentTitle\" >*<\/span>";
        strVar += "	<\/div>";
        strVar += "	<div class = \"componentTitleLabel\" id=\"branchingComponentOption\">";
        strVar += "		<span id = \"branchingExitOption\"><input type\"checkbox\" id=\"buildExitOption\" \/><span id = \"branchingExitOptionLabel\"><\/span><select id = \"branchThreshold\"><option id = \"pleaseSelect\" value=\"0\">Please Select Threshold<\/option><\/select><\/span>";
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



