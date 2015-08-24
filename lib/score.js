/**
 * Created by georgepipkin on 4/22/14.
 */

function score(loadedComponent){

    if(typeof loadedComponent=="undefined"){
        this.x = 0;
        this.y = 0;
        this.icon = "score";
        this.active = false;
        this.layerName = "";
    }else{
        this.x = loadedComponent.x;
        this.y = loadedComponent.y;
        this.title = loadedComponent.title;
        this.icon = "score";
        thisContent = loadedComponent.content;
        this.content = thisContent;
    }

    this.contentEntry = function(x,y,n){ showScoreEntryScreen(this,x,y,n, "entry")};
    this.contentUpdate = function(l){ updateScore(this,l)};
    this.contentEdit = function(thisComponent,layer, connections){ editScoreContent(this,thisComponent, layer, connections)};
    this.getPathOptions = function(componentId, contextId, connectionId){
        myData = {componentId: componentId, contextId: contextId };
        var thisTransaction = urlBase+find_predecessor_paths+"?"+debug;
        $.ajax({
            type: "POST",
            url: thisTransaction,
            data: myData,
            success: function(msg) {
            },
            error: function(err) {
                alert(err.toString());
                if (err.status == 200) {
                    ParseResult(err);
                }
                else { alert('Error:' + err.responseText + '  Status: ' + err.status); }
            }

        });
    };
    this.createComponent = function(layerName){
        theseEvents = Array();
        elementId = generateUUID();
        theseEvents.push(new dgEvent('Component viewed by user',false, componentViewed,'', elementId));
        thisElementId = generateUUID();
        insertComponent($("#componentX").val(), $("#componentY").val(), "score", $("#componentTitle").val(), "", $("#componentContext").val(), theseEvents, "false", thisElementId);

    };

        var editScoreContent = function(t,thisComponent, layer, connections){
            $('#popup').html(getScoreEntryScreen(t.layerName,thisComponent.x,thisComponent.y,thisComponent.id,'edit'));
            $('#popup').show();
            setPathSelect(connections);
        }

        var showScoreEntryScreen = function(t,x,y,n){
            $('#popup').html(getScoreEntryScreen(t.layerName,x,y,n,'entry'));
            $('#popup').show();
        }

        var editScoreContent = function(this,thisComponent, layer, connections){

        }

        var getScoreEntryScreen = function(layerName,x,y,n, mode){
        var savejs = "saveNewComponent('"+n+"', 'score');";
        var updatejs = "updateExistingComponent('"+n+"', 'score');";
        var removejs = "removeComponent('"+n+"', 'score');";

        var strVar="";
        strVar += "    <div id=\"componentEdit\" class=\"docComponent scoreComponent\">";
        strVar += "        <div class=\"hdr1\">";
        strVar += "            Summarize Upstream Components";
        strVar += "            <span class=\"componentTitle\">";
        strVar += "                <input id=\"componentTitle\" name=\"componentTitle\" size=\"40\" placeholder=\"Enter component name here....\">";
        strVar += "            <\/span>";
        strVar += "        <\/div>";
        if(mode=='entry'){
            strVar += "        <div class=\"docSubmit\" id=\"addScoreSubmit\">";
            strVar += "            <input type=\"submit\" value=\"Add the Component\"  onclick=\""+savejs+" return false;\"\/>";
            strVar += "            <input type=\"submit\" value=\"Cancel\"  onclick=\"cancelEntry(); return false;\"\/>";
            strVar += "            <input id=\"componentX\" name=\"componentX\" hidden=\"true\" value=\""+x+"\" \/>";
            strVar += "            <input id=\"componentY\" name=\"componentY\" hidden=\"true\" value=\""+y+"\"\/>";

            strVar += "        <\/div>";
        }else{
            var thisComponentContext = $("#componentContext").val();
            strVar += "        <div class=\"docSubmit\" id=\"addScoreSubmit\">";
            strVar += "            <input type=\"submit\" value=\"Save Changes\"  onclick=\""+updatejs+" return false;\"\/>";
            strVar += "            <input type=\"submit\" value=\"Remove\"  onclick=\""+removejs+" return false;\"\/>";
            strVar += "            <input type=\"submit\" value=\"Cancel\"  onclick=\"cancelEntry(); return false;\"\/>";
            strVar += "             <select name=\"pathSelectDropDown\" id = \"pathSelectDropDown\" onchange=\" editPath("+n+","+thisComponentContext+");\">";
            strVar += "                 <option value=\"\">Select A Path To Edit<\/option>";
            strVar += "             <\/select>";
            strVar += "        <\/div>";
        }
        strVar += "     <\/div>";

        return strVar;
    }



}

score.prototype = new component();
toolIcons.push("score");
