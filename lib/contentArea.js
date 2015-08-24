/**
 * Created by georgepipkin on 4/30/14.
 */

function contentArea(){
    this.entry = function(){
        findStartingComponent(this.contextId, this.selectedComponentId);
    }

    var findStartingComponent = function(contextId, selectedComponentId){
        if(typeof(selectedComponentId)=='undefined'){
            selectedComponentId='undefined';
        }
        var myData = {contextId: contextId, startComponentId: selectedComponentId};
        var thisTransaction = urlBase+get_content_from_here+"?"+debug;
        $.ajax({
            type: "POST",
            url: thisTransaction,
            data: myData,
            success: function(msg) {
//                var m = msg.replace("load content","");
                var readerFunctions = [];
                var initFunctions = [];
                $("#contentArea").html("");
                var contentComponents = JSON.parse(msg);
                for(var i=0;i<contentComponents.length;i++){
                    var thisContentComponent = contentComponents[i];
                    var newComponentString = "thisNewComponent = new "+thisContentComponent.type+"();";
                    var newComponent = eval(newComponentString);
                    readerFunctions.push(newComponent.entry(thisContentComponent));
                    if(typeof newComponent.displayInit != 'undefined'){
                        initFunctions.push(newComponent.displayInit(thisContentComponent));
                    }
                }
                var thisNavButton = new navButton();
                thisNavButton.entry(initFunctions);

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
}
