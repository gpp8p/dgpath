/**
 * Created by georgepipkin on 12/1/14.
 */

function collection(c){
    if(arguments.length>0){
        this.icon = "collection";
        this.active = false;
        this.title = c.title;
        this.content = c.content;
        this.id = c.id;
    }else{
        this.icon = "collection";
        this.active = false;
        this.id = 0;

    }

    this.contentEntry = function(x,y,n,popName,saveContext){
        $("#libPopup").html(getCollectionHTML());
        $("#cancel").on("click", function(){
            $("#libPopup").html("");
            $("#libPopup").hide();
        });
        $("#save").on("click", function(){
            $("#libPopup").hide();
            saveCollection();
        });


        $("#libPopup").show();
        ed = CKEDITOR.replace("collectionDescription",
            {
                height:"200", width:"800",
                enterMode : CKEDITOR.ENTER_BR,
                shiftEnterMode: CKEDITOR.ENTER_P
            });


    };

    this.contentEdit = function(thisComponent, layer, connections){ };
    this.getPathOptions = function(componentId, contextId, connectionId){};
    this.editEntry = function(){};

    this.entry = function(thisComponent){};

    var setupEdit = function(thisComponent, popName){
        $("#"+popName).html(getCollectionHTML());
        $("#cancel").on("click", function(){
            $("#"+popName).html("");
            $("#"+popName).hide();
        });
        $("#save").on("click", function(){
            $("#"+popName).hide();
            updateCollection();
        });

        $("#componentTitle").val(thisComponent.title);


        $("#"+popName).show();
        ed = CKEDITOR.replace("collectionDescription",
            {
                height:"200", width:"800"
            });
        ckInstance = findCkInstanceByName("collectionDescription");
        ckInstance.setData(thisComponent.content);

    }


    var getCollectionHTML = function(){
        var strVar="";
        strVar += "    <div id=\"componentEdit\" class=\"docComponent newCollection\">";
        strVar += "        <div class=\"hdr1\">";
        strVar += "            Collection:";
        strVar += "            <span class=\"hdr2\">";
        strVar += "                <input id=\"collectionTitle\" name=\"collectionTitle\" size=\"40\" placeholder=\"Enter collection name here....\">";
        strVar += "            <\/span>";
        strVar += "        <\/div>";
        strVar += "        <div class=\"hdr6\">";
        strVar += "            Description of this collection:";
        strVar += "        <\/div>";
        strVar += "        <textarea class=\"ckeditor\" cols=\"40\" id=\"collectionDescription\" name=\"collectionDescription\" rows=\"20\">";
        strVar += "        <\/textarea>";
        strVar += "        <div class=\"docSubmit\" id=\"addDocSubmit\">";
        strVar += "            <input id = \"save\" type=\"submit\" value=\"Save\" \/>";
        strVar += "            <input id = \"cancel\" type=\"submit\" value=\"Cancel\"\/>";
        strVar += "        <\/div>";
        strVar += "    <\/div>";
        strVar += "    <input id=\"componentType\" name=\"componentType\" hidden=\"true\" value=\"collection\" \/>";
        strVar += "    <input id=\"debug\" name=\"debug\" hidden=\"true\" \/>";

        return strVar;
    }

    var saveCollection = function(){
        var thisTransaction = urlBase+create_new_collection+"?"+debug;
        var ckInstance = findCkInstanceByName("collectionDescription");
        var collectionDescription = ckInstance.getData();
        var myData = { collectionDescription:collectionDescription, collectionTitle: $("#collectionTitle").val() };

        $.ajax({
            type: "POST",
            url: thisTransaction,
            data: myData,
            success: function(msg) {
                var thisLibraryArea = new libraryArea();
                thisLibraryArea.entry();
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
