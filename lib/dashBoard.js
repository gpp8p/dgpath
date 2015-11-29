/**
 * Created by georgepipkin on 11/9/15.
 */

var dashBoard = function(){
    var screenHeight = window.innerHeight-50;
    var screenWidth = window.innerWidth;
    var mapAreaHeight = Math.round(screenHeight*0.40);
    var buttonsHeight = Math.round(screenHeight*0.075);
    var listAreaHeight = Math.round(screenHeight*0.525);
    this.showDashBoardSkeleton = function(){
        $("#dashBoardMapArea").css('top', '50px');
        $("#dashBoardMapArea").css('left', '0px');
        $("#dashBoardMapArea").css('height', mapAreaHeight+'px');
        $("#dashBoardMapArea").css('width',screenWidth+'px');
        $("#dashBoardMapArea").css('background-color','#CDD4F7');
        $("#dbBorder1").css('top',mapAreaHeight+50+'px');
        $("#dbBorder1").css('left','0px');
        $("#dbBorder1").css('height','4px');
        $("#dbBorder1").css('width',screenWidth+'px');
        $("#dbBorder1").css('background-color','#000000');
        $("#dbButtons").css('top',mapAreaHeight+50+4+'px');
        $("#dbButtons").css('left','0px');
        $("#dbButtons").css('width',screenWidth+'px');
        $("#dbButtons").css('background-color','#08FF88');
        $("#dbButtons").html(getButtonHtml());
        $("#dbBorder2").css('top',mapAreaHeight+50+buttonsHeight+'px');
        $("#dbBorder2").css('left','0px');
        $("#dbBorder2").css('height','4px');
        $("#dbBorder2").css('width',screenWidth+'px');
        $("#dbBorder2").css('background-color','#000000');
        $("#dashBoardListArea").css('top',mapAreaHeight+50+buttonsHeight+4+'px');
        $("#dashBoardListArea").css('left', '0px');
        $("#dashBoardListArea").css('height', listAreaHeight+'px');
        $("#dashBoardListArea").css('width',screenWidth+'px');
        $("#dashBoardListArea").css('background-color','#cccccc');
        $("#participants").html($.t("dashBoard.participants"));
        $("#notifications").html($.t("dashBoard.notifications"));
        $("#statistics").html($.t("dashBoard.statistics"));
        $("#participButton").addClass('buttonNotSelectedCss buttonCss');
        $("#notificationButton").addClass('buttonNotSelectedCss buttonCss');
        $("#statButton").addClass('buttonNotSelectedCss buttonCss');
        $("#participButton").on('click', function(){

            $("#participButton").removeClass('buttonNotSelectedCss').addClass('buttonSelectedCss');
            $("#notificationButton").removeClass('buttonSelectedCss').addClass('buttonNotSelectedCss');
            $("#statButton").removeClass('buttonSelectedCss').addClass('buttonNotSelectedCss');
            var offsets = $('#participButton').offset();
            var bottomBorderOffset = $("#dbBorder2").offset();
            var participMenuTop = Math.round(bottomBorderOffset.top)-5;
            var menuTop = offsets.top;
            var menuLeft = offsets.left;
            $("#dashMenu").css('position', 'absolute');
            $("#dashMenu").css('top', participMenuTop+'px');
            $("#dashMenu").css('left', menuLeft-5+'px');
            $("#dashMenu").html(getParticipantMenuHtml());
            $("#addParticipant").html($.t("dashBoard.addParticipant"));
            $("#addLti").html($.t("dashBoard.addLti"));
            $("#addParticipant").html($.t("dashBoard.addParticipant"));
            $("#mostRecent").html($.t("dashBoard.mostRecent"));
            $("#mostRecent").on('click', function(){
                showRecentStudentActivity();
            });
            $("#menuAddParticipant").on('click', function(){
                addNewUser(menuTop, menuLeft);
            });
            $("#dashMenu").show();
        });
        $("#notificationButton").on('click', function(){
            $("#participButton").removeClass('buttonSelectedCss').addClass('buttonNotSelectedCss');
            $("#notificationButton").removeClass('buttonNotSelectedCss').addClass('buttonSelectedCss');
            $("#statButton").removeClass('buttonSelectedCss').addClass('buttonNotSelectedCss');
            $("#dashMenu").html("");
            $("#dashMenu").hide();
            var offsets = $('#notificationButton').offset();
            var menuTop = offsets.top;
            var menuLeft = offsets.left;
        });
        $("#statButton").on('click', function(){
            $("#dashMenu").html("");
            $("#dashMenu").hide();
            $("#participButton").removeClass('buttonSelectedCss').addClass('buttonNotSelectedCss');
            $("#notificationButton").removeClass('buttonSelectedCss').addClass('buttonNotSelectedCss');
            $("#statButton").removeClass('buttonNotSelectedCss').addClass('buttonSelectedCss');
            var offsets = $('#statButton').offset();
            var menuTop = offsets.top;
            var menuLeft = offsets.left;
        });
        $("#dashMenu").hide();
        $("#dashPop").hide()
        $("#dashboardDiv").show();
    }

    var getButtonHtml = function(){
        var strVar="";
        strVar += "<table width=\"100%\" border=\"0\" class=\"buttonTableCss\">";
        strVar += "	<tr>";
        strVar += "		<td class=\"buttonCss\" id=\"participButton\" height = \"100%\" width=\"15%\"><span id=\"participants\" ></span><\/td>";
        strVar += "		<td class=\"buttonCss\" id=\"notificationButton\" height = \"100%\" width=\"15%\"><span id=\"notifications\" ></span><\/td>";
        strVar += "		<td class=\"buttonCss\" id=\"statButton\" height = \"100%\" width=\"15%\"><span id=\"statistics\" ></span><\/td>";
        strVar += "		<td class=\"blankAreaCss\" id=\"blank\" height = \"100%\" width=\"55%\"><\/td>";
        strVar += "	<\/tr>";
        strVar += "<\/table>";
        strVar += "		";
        return strVar;

    }

    var getParticipantMenuHtml = function(){
        var strVar="";
        strVar += "<table border=\"0\" class=\"buttonTableCss\" >";
        strVar += "	<tr>";
        strVar += "		<td class=\"buttonMenuCss\" id = \"menuAddParticipant\"><span id=\"addParticipant\"></span><\/td>";
        strVar += "	<\/tr>";
        strVar += "	<tr>";
        strVar += "		<td class=\"buttonMenuCss\" id = \"menuAddLti\"><span id=\"addLti\"></span><\/td>";
        strVar += "	<\/tr>";
        strVar += "	<tr>";
        strVar += "		<td class=\"buttonMenuCss\" id = \"menuMostRecent\"><span id=\"mostRecent\"></span><\/td>";
        strVar += "	<\/tr>";
        strVar += "	<tr>";
        strVar += "		<td class=\"buttonMenuCss\" id = \"option1\" >Option 1<\/td>";
        strVar += "	<\/tr>";
        strVar += "	<tr>";
        strVar += "		<td class=\"buttonMenuCss\" id = \"option2\" >Option 2<\/td>";
        strVar += "	<\/tr>";
        strVar += "	<tr>";
        strVar += "		<td class=\"buttonMenuCss\" id = \"option3\" >Option 3<\/td>";
        strVar += "	<\/tr>";
        strVar += "	<tr>";
        strVar += "		<td class=\"buttonMenuCss\" id = \"option4\" >Option 4<\/td>";
        strVar += "	<\/tr>";
        strVar += "<\/table>";
        return strVar;

    }

    var addNewUser = function(thisTop, thisLeft) {

        var getUserEntryPanelHtml = function () {
            var strVar = "";
            strVar += "<div id=\"userEntryId\" >";
            strVar += "    ";
            strVar += "<\/div>";
            strVar += "<div id=\"errorMessage\" >";
            strVar += "    ";
            strVar += "<\/div>";
            strVar += "<table id=\"newUser\" border=\"0\" width=\"100%\" >";
            strVar += "    <tr>";
            strVar += "        <td id=\"firstNameLabelTd\" width=\"35%\">";
            strVar += "            <span id=\"firstNameLabel\"><\/span>";
            strVar += "        <\/td>";
            strVar += "        <td id=\"firstNameTd\" width=\"65%\">";
            strVar += "            <span id=\"firstName\">";
            strVar += "                <input id = \"firstNameInput\" type=\"text\" size=\"40\" maxlength = \"128\"  \/>";
            strVar += "            <\/span>";
            strVar += "        <\/td>";
            strVar += "    <\/tr>";
            strVar += "    <tr>";
            strVar += "        <td id=\"lastNameLabelTd\" width=\"35%\">";
            strVar += "            <span id=\"lastNameLabel\"><\/span>";
            strVar += "        <\/td>";
            strVar += "        <td id=\"lastNameTd\" width=\"65%\">";
            strVar += "            <span id=\"lastName\">";
            strVar += "                <input id = \"lastNameInput\" type=\"text\" size=\"40\" maxlength = \"128\"  \/>";
            strVar += "            <\/span>";
            strVar += "        <\/td>";
            strVar += "    <\/tr>";
            strVar += "    <tr>";
            strVar += "        <td id=\"eidLabelTd\" width=\"35%\">";
            strVar += "            <span id=\"eidLabel\"><\/span>";
            strVar += "        <\/td>";
            strVar += "        <td id=\"eidTd\" width=\"65%\">";
            strVar += "            <span id=\"eid\">";
            strVar += "                <input id = \"eidInput\" type=\"text\" size=\"20\" maxlength = \"20\"  \/>";
            strVar += "            <\/span>";
            strVar += "        <\/td>";
            strVar += "    <\/tr>";
            strVar += "    <tr>";
            strVar += "        <td id=\"emailLabelTd\" width=\"35%\">";
            strVar += "            <span id=\"emailLabel\"><\/span>";
            strVar += "        <\/td>";
            strVar += "        <td id=\"emailTd\" width=\"65%\">";
            strVar += "            <span id=\"email\">";
            strVar += "                <input id = \"emailInput\" type=\"text\" size=\"40\" maxlength = \"80\"  \/>";
            strVar += "            <\/span>";
            strVar += "        <\/td>";
            strVar += "    <\/tr>";

            strVar += "    <tr>";
            strVar += "        <td id=\"passwordLabelTd\" width=\"35%\">";
            strVar += "            <span id=\"passwordLabel\"><\/span>";
            strVar += "        <\/td>";
            strVar += "        <td id=\"passwordTd\" width=\"65%\">";
            strVar += "            <span id=\"password\">";
            strVar += "                <input id = \"passwordInput\" type=\"password\" size=\"32\" maxlength = \"32\"  \/>";
            strVar += "            <\/span>";
            strVar += "        <\/td>";
            strVar += "    <\/tr>";
            strVar += "    <tr>";
            strVar += "        <td id=\"passwordConfirmLabelTd\" width=\"35%\">";
            strVar += "            <span id=\"passwordConfirmLabel\"><\/span>";
            strVar += "        <\/td>";
            strVar += "        <td id=\"passwordConfirmTd\" width=\"65%\">";
            strVar += "            <span id=\"passwordConfirm\">";
            strVar += "                <input id = \"passwordConfirmInput\" type=\"password\" size=\"32\" maxlength = \"32\"  \/>";
            strVar += "            <\/span>";
            strVar += "        <\/td>";
            strVar += "    <\/tr>";
            strVar += "    <tr>";
            strVar += "        <td id=\"userTypeLabelTd\" width=\"35%\">";
            strVar += "            <span id=\"userTypeLabel\"><\/span>";
            strVar += "        <\/td>";
            strVar += "        <td id=\"userTypeTd\" width=\"65%\">";
            strVar += "            <span id=\"userType\">";
            strVar += "                <select id=\"userTypeSelect\">";
            strVar += "                <\/select>";
            strVar += "            <\/span>";
            strVar += "        <\/td>";
            strVar += "    <\/tr>";
            strVar += "    <tr>";
            strVar += "        <td id=\"newUserSaveButtonTd\" width=\"35%\">";
            strVar += "            <input id=\"newUserSaveButton\" type=\"button\"/>";
            strVar += "        <\/td>";
            strVar += "        <td id=\"cancelNewUserTd\" width=\"65%\">";
            strVar += "                <input id=\"newUserCancelButton\" type=\"button\" \/>";
            strVar += "        <\/td>";
            strVar += "    <\/tr>";
            strVar += "<\/table>";
            return strVar;
        }

        var saveNewUser = function(){
            var blankData = false;
            var blankFields = "";
            if($("#firstNameInput").val()==""){
                blankFields+=$.t("dashBoard.firstNameLabel")+" ";
                blankData=true;
            }
            if($("#lastNameInput").val()==""){
                blankFields+=$.t("dashBoard.lastNameLabel")+" ";
                blankData=true;
            }
            if($("#eidInput").val()==""){
                blankFields+=$.t("dashBoard.eidLabel")+" ";
                blankData=true;
            }
            if($("#emailInput").val()==""){
                blankFields+=$.t("dashBoard.emailLabel")+" ";
                blankData=true;
            }
            if($("#passwordInput").val()==""){
                blankFields+=$.t("dashBoard.passwordLabel")+" ";
                blankData=true;
            }
            if($("#userTypeSelect").val()=="pleaseEnter"){
                blankFields+=$.t("dashBoard.userTypeLabel")+" ";
                blankData=true;
            }
            if(blankData){
                $("#errorMessage").html($.t("dashBoard.entryRequired")+"<br/>"+blankFields);
                $("#errorMessage").css('color','red');
                $("#errorMessage").show();
                return;
            }
            if($("#passwordInput").val()!=$("#passwordConfirmInput").val()){
                $("#errorMessage").html($.t("dashBoard.passwordNoMatch"));
                $("#errorMessage").css('color','red');
                $("#errorMessage").show();
                return;
            }
            var myData = {firstname: $("#firstNameInput").val(), lastname: $("#lastNameInput").val(), eid: $("#eidInput").val(), email:$("#emailInput").val(), password:$("#passwordInput").val(), userType: $("#userTypeSelect").val(), projectId: $("#currentProjectId").val() };
            var thisTransaction = urlBase+create_new_user+"?"+debug;
            $.ajax({
                type: "POST",
                url: thisTransaction,
                data: myData,
                success: function(msg) {
                    var saveResult = JSON.parse(msg);
                    switch(saveResult.msg){
                        case "duplicateUserId":
                            $("#errorMessage").html($.t("dashBoard.duplicateUser"));
                            $("#errorMessage").css('color','red');
                            $("#eidInput").val("");
                            $("#errorMessage").show();
                            break;
                        case "userCreated":
                            $("#firstNameInput").val("");
                            $("#lastNameInput").val("");
                            $("#eidInput").val("");
                            $("#emailInput").val("");
                            $("#passwordInput").val("");
                            $("#passwordConfirmInput").val("");
                            $("#userTypeSelect").val("pleaseEnter");
                            var userMessage = saveResult.eid+$.t("dashBoard.userCreated");
                            $("#errorMessage").css('color','green');
                            $("#errorMessage").html(userMessage);
                            $("#errorMessage").show();
                            break;

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

        $("#dashPop").html(getUserEntryPanelHtml());
        $("#dashPop").addClass('dashDialog');
        $("#dashPop").css('top', thisTop+80+'px');
        $("#dashPop").css('left', thisLeft+90+'px');
        $("#userEntryId").html($.t("dashBoard.newUserEntryTitle"));
        $("#userEntryId").css('font-size', '20px');
        $("#firstNameLabel").html($.t("dashBoard.firstNameLabel"));
        $("#lastNameLabel").html($.t("dashBoard.lastNameLabel"));
        $("#eidLabel").html($.t("dashBoard.eidLabel"));
        $("#emailLabel").html($.t("dashBoard.emailLabel"))
        $("#passwordLabel").html($.t("dashBoard.passwordLabel"));
        $("#passwordConfirmLabel").html($.t("dashBoard.passwordConfirmLabel"));
        $("#userTypeLabel").html($.t("dashBoard.userTypeLabel"));
        $("#userTypeSelect").append($('<option>', { value :'pleaseEnter' }).text($.t("dashBoard.pleaseEnterLabel")));
        $("#userTypeSelect").append($('<option>', { value :'courseDesigner' }).text($.t("dashBoard.courseDesignerOptionLabel")));
        $("#userTypeSelect").append($('<option>', { value :'instructor' }).text($.t("dashBoard.instructorOptionLabel")));
        $("#userTypeSelect").append($('<option>', { value :'secondaryInstructor' }).text($.t("dashBoard.secondaryInstructorOptionLabel")));
        $("#userTypeSelect").append($('<option>', { value :'student' }).text($.t("dashBoard.studentOptionLabel")));
        $("#userTypeSelect").append($('<option>', { value :'guest' }).text($.t("dashBoard.guestOptionLabel")));
        $("#errorMessage").hide();
        $("#newUserSaveButton").prop('value', $.t("dashBoard.newUserSaveButtonLabel"));
        $("#newUserCancelButton").prop('value', $.t("dashBoard.newUserCancelButtonLabel"));
        $("#firstNameInput").prop('autofocus','true');
        $("#newUserCancelButton").on('click', function(){
            $("#dashPop").html("");
            $("#dashPop").hide();
            $("#dashMenu").hide();
        });
        $("#newUserSaveButton").on('click', function(){
            saveNewUser();
        });
        $("#dashPop").show();


    }

    var showRecentStudentActivity = function(){
        var getActivityScrollSkeleton = function(){
            var strVar="";
            strVar += "<table class=\"scrollTable\" cellpadding=\"0\" id=\"t1\" cellspacing=\"0\" width=\"100%\">";
            strVar += "    <thead>";
            strVar += "    <tr>";
            strVar += "        <th id=\"activityTypeLabel\" align = \"left\" width=\"15%\"><\/th>";
            strVar += "        <th id=\"activityTimeLabel\" align = \"left\" width=\"15%\"><\/th>";
            strVar += "        <th id=\"activityUserLabel\" align = \"left\" width=\"20%\"><\/th>";
            strVar += "        <th id=\"activityDetailLabel\" align = \"left\" width=\"50%\"><\/th>";
            strVar += "    <\/tr>";
            strVar += "    <\/thead>";
            strVar += "    <tbody>";
            strVar += "";
            strVar += "    <\/tbody>";
            strVar += "<\/table>";
            return strVar;
        }
        $("#dashBoardListArea").html(getActivityScrollSkeleton());
        $("#activityTypeLabel").html($.t("dashBoard.activityTypeLabel"));
        $("#activityTimeLabel").html($.t("dashBoard.activityTimeLabel"));
        $("#activityUserLabel").html($.t("dashBoard.activityUserLabel"));
        $("#activityDetailLabel").html($.t("dashBoard.activityDetailLabel"));
        $("#dashMenu").hide();
        $("#dashBoardListArea").show();
        var myData = {activityTypes: userLoggedIn+','+linkTransfer+','+startView};
        var thisTransaction = urlBase+get_user_activity+"?"+debug;
        $.ajax({
            type: "POST",
            url: thisTransaction,
            data: myData,
            success: function(msg) {
                var activityResult = JSON.parse(msg);
                $.each( activityResult, function( key, value ) {
                    var thisRowName = "R"+value.id;
                    var thisRow = "<tr id = \""+thisRowName+"\"><td id = \""+thisRowName+"a\"></td><td id = \""+thisRowName+"b\"></td><td id = \""+thisRowName+"c\"></td><td id = \""+thisRowName+"d\"></td></tr>";
                    $("#t1 tbody").append(thisRow);
                    $("#"+thisRowName+"a").html(getEventLabels(value.event_type));
                    $("#"+thisRowName+"b").html(value.event_time);
                    var thisName = value.first_name+" "+value.last_name;
                    $("#"+thisRowName+"c").html(thisName);
                    var thisDetail = JSON.parse(value.detail);
                    $("#"+thisRowName+"d").html(thisDetail.msg);

                });
                $('.scrollTable').scrolltable({
                    stripe: false,
                    oddClass: 'odd',
                    maxHeight: 200
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

    var getEventLabels = function(eventId){
        switch(eventId){
            case linkTransfer:
                return $.t("dashBoard.linkTransfer");
                break;
            case startView:
                return $.t("dashBoard.startView");
                break;
            case userLoggedIn:
                return $.t("dashBoard.userLoggedIn");
                break;
            default:
                return "Add Event";
                break;
        }
    }


    return this;
}
