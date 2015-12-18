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
        $("#dashBoardMapArea").css('overflow-y', 'auto');
        $("#dashBoardMap").css('top', '50px');
        $("#dashBoardMap").css('left', '0px');

//        $("#dashBoardMap").css('width',screenWidth+'px');
//        $("#dashBoardMap").css('height',mapAreaHeight+200+'px');
//        var dctx = $("canvas.dashBoardCanvas")[0].getContext('2d');
//        dctx.canvas.width  = screenWidth+'px';
//        dctx.canvas.height = window.innerHeight-50;
//        $("#dashBoardCanvas").prop('width', screenWidth+'px');
//        $("#dashBoardCanvas").prop('height', mapAreaHeight+200+'px');

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
        $("#dashBoardMap").html(makeCanvas());
        var dashBoardCanvas = $("#dashBoardCanvas").get(0);
        var dctx = dashBoardCanvas.getContext('2d');
        dctx.canvas.height=mapAreaHeight+200;
        dctx.canvas.width=screenWidth;

//        getMapForContextNow();
    }

    var makeCanvas = function(){
        var strVar="";
        strVar += "            <canvas id = \"dashBoardCanvas\" class=\"dashBoardCanvas\"  >";
        strVar += "            <\/canvas>";
        return strVar;
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

    var getMapForContextNow = function(){
        getMapForContext(inContextNow);
    }

    var getMapForContext = function(contextId, userId) {
        var myData = {contextId: contextId, userId: userId};
 //       var thisTransaction = urlBase + fetch_components_and_events + "?" + debug;
        var thisTransaction = urlBase + get_combined_user_events + "?" + debug;
        $.ajax({
            type: "POST",
            url: thisTransaction,
            data: myData,
            success: function (msg) {
                currentComponentsAndContext = JSON.parse(msg);
                currentComponents = currentComponentsAndContext[0];
                drawMap(currentComponents);

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
    }

    var drawMap = function(allComponents){
        $.each(allComponents, function(comp) {
            var thisComponent = allComponents[comp];
            var dgName = 'dg_' + thisComponent.id;
            srcRef = "images/" + thisComponent['type'] + ".png";
            console.log("this component - " + srcRef);
            $("canvas.dashBoardCanvas").drawImage({
                layer: true,
                name: thisComponent.id,
                group: "component",
                dragstart: null,
                dragstop: null,
                draggable: false,
                source: srcRef,
                shadowColor: "#666",
                shadowBlur: 5,
                shadowX: -5, shadowY: 5,
                mouseup: function (layer) {
                    wasClicked(layer);
                },
                x: parseInt(thisComponent['x']), y: parseInt(thisComponent['y']),
                index: 1,
                bringToFront: true
            });
            if(this.title!=null){
                $("canvas").drawText({
                    fillStyle: "#9cf",
                    layer: true,
                    draggable: true,
                    groups: [dgName],
                    dragGroups: [dgName],
                    index: 2,
                    strokeStyle: "#25a",
                    strokeWidth: 1,
                    x: parseInt(thisComponent['x']), y: parseInt(thisComponent['y'])+40,
                    font: "8pt Verdana, sans-serif",
                    text: this.title,
                    bringToFront: true
                });
            }
            thisComponentConnections = thisComponent['connections'];
            $.each(thisComponentConnections, function(con){
                thisConnection = thisComponentConnections[con];
                startComponent = findComponent(thisConnection['start_id'], allComponents);
                endComponent = findComponent(thisConnection['end_id'], allComponents);
                goAhead = thisConnection.goAhead;
                drawArrow(parseInt(startComponent.x), parseInt(startComponent.y), parseInt(endComponent.x), parseInt(endComponent.y), goAhead);
            });

        });
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
        var latestSelectedActivity = "";

        var getBackgroundCss = function(rowId, evtype){
            if(rowId==latestSelectedActivity){
                if(evtype=="mouseenter"){
                    return '#FC0202';
                }else{
                    return '#FC0202';
                }
            }else{
                if(evtype=="mouseenter"){
                    return '#0323f9';
                }else{
                    return '#0de9f9';
                }
            }

        }

        var getColorCss = function(rowId, evtype){
            if(rowId==latestSelectedActivity){
                if(evtype=="mouseenter"){
                    return '#fffa08';
                }else{
                    return '#fffa08';
                }

            }else{
                if(evtype=="mouseenter"){
                    return '#fffa08';
                }else{
                    return '#931109';
                }

            }
        }


        var getActivityScrollSkeleton = function(){
            var strVar="";
            strVar += "<table class=\"scrollTable\" cellpadding=\"0\" id=\"t1\" cellspacing=\"0\" width=\"100%\">";
            strVar += "    <thead>";
            strVar += "    <tr>";
            strVar += "        <th id=\"activityUserLabel\" align = \"left\" width=\"20%\"><\/th>";
            strVar += "        <th id=\"activityTypeLabel\" align = \"left\" width=\"15%\"><\/th>";
            strVar += "        <th id=\"activityTimeLabel\" align = \"left\" width=\"15%\"><\/th>";
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
                    $("#"+thisRowName+"b").html(getEventLabels(value.event_type));
                    $("#"+thisRowName+"c").html(value.event_time);
                    var thisName = value.first_name+" "+value.last_name;
                    $("#"+thisRowName+"a").html(thisName);
                    var thisDetail = JSON.parse(value.detail);
                    $("#"+thisRowName+"d").html(thisDetail.msg);
                    $("#"+thisRowName).on('click', function(){
                        $("#"+latestSelectedActivity+"a").css('background-color', '#0de9f9');
                        $("#"+latestSelectedActivity+"a").css('color', '#931109');
                        $("#"+latestSelectedActivity+"b").css('background-color', '#0de9f9');
                        $("#"+latestSelectedActivity+"b").css('color', '#931109');
                        $("#"+latestSelectedActivity+"c").css('background-color', '#0de9f9');
                        $("#"+latestSelectedActivity+"c").css('color', '#931109');
                        $("#"+latestSelectedActivity+"d").css('background-color', '#0de9f9');
                        $("#"+latestSelectedActivity+"d").css('color', '#931109');
                        latestSelectedActivity = thisRowName;
                        $("#" + thisRowName + "a").css('background-color', '#FC0202');
                        $("#" + thisRowName + "a").css('color', '#fffa08');
                        $("#" + thisRowName + "b").css('background-color', '#FC0202');
                        $("#" + thisRowName + "b").css('color', '#fffa08');
                        $("#" + thisRowName + "c").css('background-color', '#FC0202');
                        $("#" + thisRowName + "c").css('color', '#fffa08');
                        $("#" + thisRowName + "d").css('background-color', '#FC0202');
                        $("#" + thisRowName + "d").css('color', '#fffa08');
                        showActivityDetail(thisRowName);
                    });
                    $("#"+thisRowName+"a").on('hover', function(event){
                        var thisBackGroundColor =  getBackgroundCss(thisRowName, event.type);
                        var thisColor = getColorCss(thisRowName, event.type);
                        $("#" + thisRowName + "a").css('background-color', thisBackGroundColor);
                        $("#" + thisRowName + "a").css('color', thisColor);
                        $("#" + thisRowName + "b").css('background-color', thisBackGroundColor);
                        $("#" + thisRowName + "b").css('color', thisColor);
                        $("#" + thisRowName + "c").css('background-color', thisBackGroundColor);
                        $("#" + thisRowName + "c").css('color', thisColor);
                        $("#" + thisRowName + "d").css('background-color', thisBackGroundColor);
                        $("#" + thisRowName + "d").css('color', thisColor);

                    });
                });
                $('.scrollTable').scrolltable({
                    stripe: false,
                    oddClass: 'odd',
                    maxHeight: listAreaHeight
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

        var showActivityDetail = function(rowName){
            var thisUserEventId = rowName.substring(1);

            var getUserChoiceSkeletonHtml = function(){
                var strVar="";
                strVar += "<table id=\"userViewChoiceTable\" class=\"buttonTableCss\" border=\"0\">";
                strVar += "	<tr>";
                strVar += "		<td class=\"buttonMenuCss\" id = \"userViewChoiceProgressMap\" ><\/td>";
                strVar += "	<\/tr>";
                strVar += "	<tr>";
                strVar += "		<td class=\"buttonMenuCss\" id = \"userViewChoiceProgressList\" ><\/td>";
                strVar += "	<\/tr>";
                strVar += "	<tr>";
                strVar += "		<td class=\"buttonMenuCss\" id = \"userViewChoiceMessage\" ><\/td>";
                strVar += "	<\/tr>";
                strVar += "<\/table>";
                return strVar;
            }
            var makeNewCanvas = function(){
                var strVar="";
                strVar += "            <canvas id = \"dashBoardCanvas\" class=\"dashBoardCanvas\"  >";
                strVar += "            <\/canvas>";
                return strVar;
            }
            var makeDshContextLine =function (contextInfo){
                var contextReturn = "<span class=\"ctxInfoBold\">\/</span>";
                var thisContextStack = [];
                for(var i = 0; i<contextInfo.length; i++){
                    var thisContextInfo = contextInfo[i];
                    var thisContextElement = "<span id=\"dshctx"+thisContextInfo.contextId+"\" class=\"ctxInfo ctxLevel\">"+thisContextInfo.contextTitle+"</span><span class=\"ctxInfoBold\">\/</span>";
                    thisContextStack.unshift(thisContextElement);
                }
                for(var r=0;r<thisContextStack.length;r++) {
                    contextReturn += thisContextStack[r];
                }

                return contextReturn;
            }


            var showUserMap = function(userEventId){
                $("#dashPop").hide();
                var thisTransaction = urlBase+get_user_event+"?"+debug;
                var myData = {eventId:userEventId};
                $.ajax({
                    type: "POST",
                    url: thisTransaction,
                    data: myData,
                    success: function(msg) {
                        var thisUserEvent = JSON.parse(msg);
                        var thisUserLastName = thisUserEvent.lastName;
                        var thisUserFirstName = thisUserEvent.firstName;
                        var thisEventContext = thisUserEvent.context;
                        var thisUserId = thisUserEvent.userId;
                        $("#dashBoardMap").html("");
                        $("#dashBoardMap").html(makeNewCanvas());
                        var dashBoardCanvas = $("#dashBoardCanvas").get(0);
                        var dctx = dashBoardCanvas.getContext('2d');
                        dctx.canvas.height=mapAreaHeight+200;
                        dctx.canvas.width=screenWidth;
                        getMapForContext(thisEventContext, thisUserId);
                        $("#contextLine").html(makeDshContextLine(currentComponentsAndContext[1]));
                        contexts = currentComponentsAndContext[1];
                        for (i=0;i<contexts.length;i++){
                            thisCtx = contexts[i];
                            $("#dshctx"+thisCtx.contextId).on("click", function(){
                                dashBoardContext(this.id.substring(3));
                            });
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
            var offsets = $('#participButton').offset();
            var bottomBorderOffset = $("#dbBorder2").offset();
            var participMenuTop = Math.round(bottomBorderOffset.top)-5;
            var menuTop = offsets.top;
            var menuLeft = offsets.left;
            $("#dashPop").css('position', 'absolute');
            $("#dashPop").css('top', participMenuTop+100+'px');
            $("#dashPop").css('left', menuLeft+350+'px');
            $("#dashPop").html(getUserChoiceSkeletonHtml());
            $("#userViewChoiceProgressMap").html($.t("dashBoard.userViewChoiceProgressMap"));
            $("#userViewChoiceProgressMap").on('click', function(){
                showUserMap(thisUserEventId);
            });
            $("#userViewChoiceProgressList").html($.t("dashBoard.userViewChoiceProgressList"));
            $("#userViewChoiceMessage").html($.t("dashBoard.userViewChoiceMessage"));
            $("#dashPop").show();



        }

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
            case authorSelect:
                return $.t("dashBoard.authorSelect");
            default:
                return "Add Event";
                break;
        }
    }


    return this;
}
