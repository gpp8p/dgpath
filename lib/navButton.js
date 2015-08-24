/**
 * Created by georgepipkin on 6/28/14.
 */

function navButton(){

    this.entry = function(iFunctions){
        for(f=0;f<iFunctions.length;f++){
            var thisInitFunction = iFunctions[f];
            thisInitFunction();
        }

        $("#navButtomImg").bind("click", function(){ submitNext(); });
    }


    var sub1 = function(){
        dataToSend = [];
    }

    var submitNext = function(){
        dataToSend = [];
        for(var i=0;i<readerFunctions.length;i++){
            thisReaderFunction = readerFunctions[i];
            thisComponentEvents = thisReaderFunction();
            for(j=0;j<thisComponentEvents.length;j++){
                thisEvent = thisComponentEvents[j];
                if($.isArray(thisEvent)){
                    for(k=0;k<(thisEvent.length);k++){
                        dataToSend.push(thisEvent[k]);
                    }
                }else{
                    dataToSend.push(thisEvent);
                }
            }
        }
        packedSubmission = JSON.stringify(dataToSend);
        myData = {submission: packedSubmission};
        var thisTransaction = urlBase+user_submit+"?"+debug;
        $.ajax({
            type: "POST",
            url: thisTransaction,
            data: myData,
            success: function(msg) {
                var contentComponents = JSON.parse(msg);
                if(contentComponents.returnType=='veto'){
                    $("#popup").html(getVetoHtml(contentComponents.data));
                    $("#popup").show();
                }else if(contentComponents.returnType=='1pathOpen'){
                    readerFunctions = [];
                    $("#contentArea").html("");
                    for(var i=0;i<contentComponents.data.length;i++){
                        var thisContentComponent = contentComponents.data[i];
                        var newComponentString = "thisNewComponent = new "+thisContentComponent.type+"();";
                        var newComponent = eval(newComponentString);
                        readerFunctions.push(newComponent.entry(thisContentComponent));
                    }
                }
            },
            error: function(err) {
                alert("error in processing submissions");
            }
        });

    }

    var getVetoHtml = function(vetoMessages){
        var strVar="";
        strVar += "<div id=\"vetoPopup\" class = \"vetoPopup\">";
        strVar += "<h1>Before proceeding:</h1>";
        strVar += "<ul>";
        for(var i=0;i<vetoMessages.length;i++){
            strVar += "<li>"+vetoMessages[i]+"</li>"
        }
        strVar += "</ul>";
        strVar += "<\/div>";
        return strVar;
    }
}
