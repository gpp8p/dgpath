/**
 * Created by georgepipkin on 11/9/15.
 */

var dashBoard = function(){
    var screenHeight = window.innerHeight-50;
    var screenWidth = window.innerWidth;
    this.showDashBoardSkeleton = function(){
        var mapAreaHeight = Math.round(screenHeight*0.40);
        var buttonsHeight = Math.round(screenHeight*0.075);
        var listAreaHeight = Math.round(screenHeight*0.525);
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
 //           $("#participButton").css('background-color','#BC7065');
            $("#participButton").removeClass('buttonNotSelectedCss').addClass('buttonSelectedCss');
 //           $("#notificationButton").css('background-color','#030bda');
            $("#notificationButton").removeClass('buttonSelectedCss').addClass('buttonNotSelectedCss');
 //           $("#statButton").removeClass('buttonSelectedCss').addClass('buttonNotSelectedCss');
            $("#statButton").removeClass('buttonSelectedCss').addClass('buttonNotSelectedCss');
            var offsets = $('#participButton').offset();
            var bottomBorderOffset = $("#dbBorder2").offset();
            var participMenuTop = Math.round(bottomBorderOffset.top)-5;
            var top = offsets.top;
            var left = offsets.left;
            $("#dashMenu").css('position', 'absolute');
            $("#dashMenu").css('top', participMenuTop+'px');
            $("#dashMenu").css('left', left-5+'px');
            $("#dashMenu").html(getParticipantMenuHtml());
            $("#addParticipant").html($.t("dashBoard.addParticipant"));
            $("#addLti").html($.t("dashBoard.addLti"));
            $("#addParticipant").html($.t("dashBoard.addParticipant"));
            $("#mostRecent").html($.t("dashBoard.mostRecent"));
            $("#dashMenu").show();
        });
        $("#notificationButton").on('click', function(){
            $("#participButton").removeClass('buttonSelectedCss').addClass('buttonNotSelectedCss');
            $("#notificationButton").removeClass('buttonNotSelectedCss').addClass('buttonSelectedCss');
            $("#statButton").removeClass('buttonSelectedCss').addClass('buttonNotSelectedCss');
            $("#dashMenu").html("");
            $("#dashMenu").hide();
            var offsets = $('#notificationButton').offset();
            var top = offsets.top;
            var left = offsets.left;
        });
        $("#statButton").on('click', function(){
            $("#dashMenu").html("");
            $("#dashMenu").hide();
            $("#participButton").removeClass('buttonSelectedCss').addClass('buttonNotSelectedCss');
            $("#notificationButton").removeClass('buttonSelectedCss').addClass('buttonNotSelectedCss');
            $("#statButton").removeClass('buttonNotSelectedCss').addClass('buttonSelectedCss');
            var offsets = $('#statButton').offset();
            var top = offsets.top;
            var left = offsets.left;
        });
        $("#dashMenu").hide();
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

    var getUserEntryPanelHtml = function(){
        var strVar="";
        strVar += "<div id=\"userEntryId\" >";
        strVar += "    ";
        strVar += "<\/div>";
        strVar += "<table id=\"newUser\" border=\"0\" width=\"100%\" >";
        strVar += "    <tr>";
        strVar += "        <td id=\"firstNameLabelTd\" width=\"35%\">";
        strVar += "            <span id=\"firstNameLabel\"><\/span>";
        strVar += "        <\/td>";
        strVar += "        <td id=\"firstNameTd\" width=\"65%\">";
        strVar += "            <span id=\"firstName\">";
        strVar += "                <input id = \"firstNameInput\" type=\"text\" size=\"40\" maxlength = \"128\" required=\"true\" \/>";
        strVar += "            <\/span>";
        strVar += "        <\/td>";
        strVar += "    <\/tr>";
        strVar += "    <tr>";
        strVar += "        <td id=\"lastNameLabelTd\" width=\"35%\">";
        strVar += "            <span id=\"lastNameLabel\"><\/span>";
        strVar += "        <\/td>";
        strVar += "        <td id=\"lastNameTd\" width=\"65%\">";
        strVar += "            <span id=\"lastName\">";
        strVar += "                <input id = \"lastNameInput\" type=\"text\" size=\"40\" maxlength = \"128\" required=\"true\" \/>";
        strVar += "            <\/span>";
        strVar += "        <\/td>";
        strVar += "    <\/tr>";
        strVar += "    <tr>";
        strVar += "        <td id=\"eidLabelTd\" width=\"35%\">";
        strVar += "            <span id=\"eidLabel\"><\/span>";
        strVar += "        <\/td>";
        strVar += "        <td id=\"eidTd\" width=\"65%\">";
        strVar += "            <span id=\"eid\">";
        strVar += "                <input id = \"eidInput\" type=\"text\" size=\"20\" maxlength = \"20\" required=\"true\" \/>";
        strVar += "            <\/span>";
        strVar += "        <\/td>";
        strVar += "    <\/tr>";
        strVar += "    <tr>";
        strVar += "        <td id=\"passwordLabelTd\" width=\"35%\">";
        strVar += "            <span id=\"passwordLabel\"><\/span>";
        strVar += "        <\/td>";
        strVar += "        <td id=\"passwordTd\" width=\"65%\">";
        strVar += "            <span id=\"password\">";
        strVar += "                <input id = \"passwordInput\" type=\"password\" size=\"32\" maxlength = \"32\" required=\"true\" \/>";
        strVar += "            <\/span>";
        strVar += "        <\/td>";
        strVar += "    <\/tr>";
        strVar += "    <tr>";
        strVar += "        <td id=\"passwordConfirmLabelTd\" width=\"35%\">";
        strVar += "            <span id=\"passwordConfirmLabel\"><\/span>";
        strVar += "        <\/td>";
        strVar += "        <td id=\"passwordConfirmTd\" width=\"65%\">";
        strVar += "            <span id=\"passwordConfirm\">";
        strVar += "                <input id = \"passwordConfirmInput\" type=\"password\" size=\"32\" maxlength = \"32\" required=\"true\" \/>";
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
        strVar += "                    <option id=\"pleaseEnterId\" value=\"pleaseEnter\"><span id=\"pleaseEnterLabel\"><\/span><\/option>";
        strVar += "                    <option id=\"courseDesignerOptionId\" value=\"courseDesigner\"><span id=\"courseDesignerLabel\"><\/span><\/option>";
        strVar += "                    <option id=\"instructorOptionId\" value=\"instructor\"><span id=\"instructorLabel\"><\/span><\/option>";
        strVar += "                    <option id=\"secondaryInstructorId\" value=\"secondaryInstructor\"><span id=\"secondaryInstructorLabel\"><\/span><\/option>";
        strVar += "                    <option id=\"studentId\" value=\"student\"><span id=\"studentLabel\"><\/span><\/option>";
        strVar += "                    <option id=\"guestId\" value=\"guest\"><span id=\"guestLabel\"><\/span><\/option>";
        strVar += "                <\/select>";
        strVar += "            <\/span>";
        strVar += "        <\/td>";
        strVar += "    <\/tr>";
        strVar += "<\/table>";
        return strVar;
    }


    return this;
}
