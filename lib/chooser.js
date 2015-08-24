/**
 * Created with JetBrains WebStorm.
 * User: georgepipkin
 * Date: 9/2/13
 * Time: 8:32 PM
 * To change this template use File | Settings | File Templates.
 */

function chooser(userEid){

    this.userEid = userEid;
    this.entry = function(){
        $('#popup').html(getChooserHTML());
        $("#selectProject").prop('value', $.t("miscLabels.selectProject"));
        $("#selectProject").prop('disabled', true);
        $("#selectProject").on('click', function(){
            var selectedProject = $("#mySelect").val();
            setupThisProject(selectedProject);
        });
        $("#mySelect").on('click', function(){
            $("#selectProject").prop('disabled', false);
        });
        $( "#mySelect" ).keydown(function( event ) {
            if (event.which == 13) {
                var selectedProject = $("#mySelect").val();
                setupThisProject(selectedProject);
            }
        });
        $("#npSubmit").prop('value', $.t("miscLabels.newProject"))
        $("#npSubmit").on('click', function(){
            createNewProject();
        });
        setupChooser(this.userEid);
    }



    var getChooserHTML = function(){
        var strVar="";
        strVar += "    <div id=\"courseChooser\" class=\"chooserPopup\">";
        strVar += "    <table border = \"0\" width=\"100%\"";
        strVar += "     <tr>"
        strVar += "         <td colspan=\"2\">";
        strVar += "            <div class=\"dd2\">";
        strVar += "                Select Course:";
        strVar += "            <\/div>";
        strVar += "         </td>";
        strVar += "     </tr>";
        strVar += "     <tr>"
        strVar += "         <td colspan=\"2\">";
        strVar += "            <select name=\"mySelect\" id=\"mySelect\"  size=\"5\" class=\"chooserSelect\">";
        strVar += "            <\/select>";
        strVar += "         </td>";
        strVar += "     </tr>";
        strVar += "     <tr>";
        strVar += "         <td colspan=\"2\">";
        strVar += "             <table border=\"0\">";
        strVar += "             	<tr>";
        strVar += "		                <td>";
        strVar += "			                <input type=\"button\" id=\"selectProject\" \/>";
        strVar += "		            <\/td>";
        strVar += "		            <td>";
        strVar += "			            <input type=\"button\" id=\"npSubmit\" \/>";
        strVar += "		            <\/td>";
        strVar += "		            <td>";
        strVar += "			            <input id=\"pName\" name=\"pName\" size=\"40\" \/>";
        strVar += "		            <\/td>";
        strVar += "	                <\/tr>";
        strVar += "             <\/table>";
        strVar += "         </td>";
        strVar += "     </tr>";
        strVar += "     </table>";
        strVar += "    <\/div>";
        strVar += "";
        return strVar;
    }


    var setupChooser = function(p1){

        var myData = {userEid: p1};
        var thisTransaction = urlBase+get_user_courses+"?"+debug;
        $.ajax({
            type: "POST",
            url: thisTransaction,
            data: myData,
            success: function(msg) {
                populateNewChooser(msg);
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

    var populateNewChooser = function(resultData){
        selectValues= eval(resultData);
        $.each(selectValues, function(proj) {
            var t = selectValues[proj];
            $('#mySelect')
                .append($('<option>', { value : t[2] })
                .text(t[0]));
        });
        $("#popup").show();

    }

}