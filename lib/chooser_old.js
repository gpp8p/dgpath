/**
 * Created with JetBrains WebStorm.
 * User: georgepipkin
 * Date: 9/2/13
 * Time: 8:32 PM
 * To change this template use File | Settings | File Templates.
 */




function getChooserHTML(){
    var strVar="";
    strVar += "    <div id=\"dirGadget\">";
    strVar += "        <p>";
    strVar += "";
    strVar += "        <div id=\"directoryDiv\" class=\"dd1\">";
    strVar += "            <div class=\"dd2\">";
    strVar += "                Select Project:";
    strVar += "            <\/div>";
    strVar += "            <select name=\"mySelect\" id=\"mySelect\"  size=\"5\" style=\"width: 300px;\">";
    strVar += "            <\/select>";
    strVar += "            <div class=\"dd2\">";
    strVar += "                Project Name:";
    strVar += "                <input id=\"pName\" name=\"pName\" size=\"40\" \/>";
    strVar += "                <input type=\"submit\" id=\"npSubmit\" onclick=\"createNewProject();return false;\" value=\"Create New Project\"\/>";
    strVar += "            <\/div>";
    strVar += "        <\/div>";
    strVar += "";
    strVar += "        <\/p>";
    strVar += "    <\/div>";
    strVar += "";
    return strVar;
}


function setupChooser(p1){
    $('#popup').html(getChooserHTML());
    var myData = {ownerContext: p1};
    var thisTransaction = urlBase+transaction_get_project_list+"?"+debug;
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

function populateNewChooser(resultData){
    selectValues= eval(resultData);
    $.each(selectValues, function(proj) {
        var t = selectValues[proj];
        $('#mySelect')
            .append($('<option>', { value : t[0], onclick: "setupThisProject(this.value);" })
            .text(t[1]));
    });
    $('canvas').drawLayers();
}