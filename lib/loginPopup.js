/**
 * Created by georgepipkin on 4/28/14.
 */

function loginPopup(){
    this.entry = function() {showLoginDialogHtml()};

    var showLoginDialogHtml = function(){
        $("#popup").html(getLoginDialogHtml());
        $("#submitLogin").click(function(){
            var thisTransaction = urlBase+login_check+"?"+debug;
            $.ajax({
                url: thisTransaction,
                cache: false,
                type: "POST",
                data:{
                    username: $("#loginUserName").val(),
                    password: $("#loginUserPassword").val()
                },
                success: function(data){
                    if (data == '1'){
                        $("#popup").hide();
                        $("#thisUserEid").val($("#loginUserName").val());
                        selectCourse($("#loginUserName").val());
                    }
                },
                error: function(data){
                    $("#loginUserName").val('');
                    $("#loginUserPassword").val('')
                    $("#loginError").show();
                    $("#loginUserName").focus();
                }

            });
        });
        $("#popup").show();
        $("#loginError").hide();
        $("#loginUserName").focus();
    }
    var getLoginDialogHtml = function(){
        var strVar="";
        strVar += "<div id=\"loginPopup\" class = \"loginPopup\">";
        strVar += "    <div id=\"loginError\" class = \"loginError\">";
        strVar += "       Login Failed - Please try again...";
        strVar += "    <\/div>";
        strVar += "    <table border=\"0\">";
        strVar += "        <tr>";
        strVar += "            <td class=\"loginLabels\">";
        strVar += "                User Id:";
        strVar += "            <\/td>";
        strVar += "            <td>";
        strVar += "                <input type=\"text\" id=\"loginUserName\" size=\"30\" placeholder=\"Please enter your User ID...\"\/>";
        strVar += "            <\/td>";
        strVar += "        <\/tr>";
        strVar += "        <tr>";
        strVar += "            <td class=\"loginLabels\">";
        strVar += "                Password:";
        strVar += "            <\/td>";
        strVar += "            <td>";
        strVar += "                <input type=\"password\" id=\"loginUserPassword\" size=\"30\"\/>";
        strVar += "            <\/td>";
        strVar += "        <\/tr>";
        strVar += "        <tr>";
        strVar += "            <td colspan=\"2\">";
        strVar += "                <table width=\"100%\">";
        strVar += "                    <tr>";
        strVar += "                        <td align=\"left\"><input type=\"button\" id=\"submitLogin\" value=\"Log In\" \/><\/td><td align=\"center\"><input type=\"button\" id=\"setupAct\" value=\"Sign Up\" \/><\/td><td align=\"right\"><input type=\"button\" id=\"cancelLogin\" value=\"Cancel\" \/><\/td>";
        strVar += "                    <\/tr>";
        strVar += "                <\/table>";
        strVar += "            <\/td>";
        strVar += "        <\/tr>";
        strVar += "";
        strVar += "    <\/table>";
        strVar += "<\/div>";
        return strVar;
    }
}


