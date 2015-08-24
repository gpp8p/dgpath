/**
 * Created by georgepipkin on 11/30/14.
 */

function folder(c){
    if(arguments.length>0){
        this.x = c.x;
        this.y = c.y;
        this.icon = "folder";
        this.active = false;
        this.title = c.title;
        this.content = c.content;
        this.id = c.id;
        this.context = c.context;
    }else{
        this.x = 0;
        this.y = 0;
        this.icon = "folder";
        this.active = false;
        this.layerName = "";
    }

    this.contentEntry = function(x,y,n, popName, saveContext){
        $("#"+popName).html(getFolderHTML());
        $("#collectionId").val(this.collectionId);
        $("#contextId").val(this.context);
        $("#cancel").on("click", function(){
            $("#"+popName).html("");
            $("#"+popName).hide();
        });
        $("#save").on("click", function(){
            $("#"+popName).hide();
            saveFolder();
        });


        $("#libPopup").show();
        ed = CKEDITOR.replace("folderDescription",
            {
                height:"200", width:"800",
                enterMode : CKEDITOR.ENTER_BR,
                shiftEnterMode: CKEDITOR.ENTER_P
            });
    };

    this.contentEdit = function(thisComponent, layer, connections, popName, saveContext){ };
    this.getPathOptions = function(componentId, contextId, connectionId){};
    this.editEntry = function(){};

    this.entry = function(thisComponent){};

    var setupEdit = function(thisComponent, popName){
        $("#"+popName).html(getDocumentHtml());
        $("#cancel").on("click", function(){
            $("#"+popName).html("");
            $("#"+popName).hide();
        });
        $("#save").on("click", function(){
            $("#"+popName).hide();
            updateFolder();
        });

        $("#componentTitle").val(thisComponent.title);
        $("#componentX").val(thisComponent.x);
        $("#componentY").val(thisComponent.y);
        $("#componentType").val(thisComponent.type);
        $("#componentId").val(thisComponent.id);
        $("#componentContext").val(thisComponent.context);
        $("#"+popName).show();
        ed = CKEDITOR.replace("docContent",
            {
                height:"200", width:"800"
            });
        ckInstance = findCkInstanceByName("docContent");
        ckInstance.setData(thisComponent.content);

    }


    var getFolderHTML = function(){
        var strVar="";
        strVar += "    <div id=\"folderEdit\" class=\"docComponent\">";
        strVar += "        <div class=\"hdr1\">";
        strVar += "            Folder:";
        strVar += "            <div class=\"hdr2\">";
        strVar += "                <input id=\"folderTitle\" name=\"folderTitle\" size=\"40\" placeholder=\"Enter folder name here....\">";
        strVar += "            <\/div>";
        strVar += "        <\/div>";
        strVar += "        <div class=\"hdr6\">";
        strVar += "            What is going into this folder ?";
        strVar += "        <\/div>";
        strVar += "        <textarea class=\"ckeditor\" cols=\"40\" id=\"folderDescription\" name=\"folderDescription\" rows=\"20\">";
        strVar += "        <\/textarea>";
        strVar += "        <div class=\"docSubmit\" id=\"addDocSubmit\">";
        strVar += "            <input id = \"save\" type=\"submit\" value=\"Save\" \/>";
        strVar += "            <input id = \"cancel\" type=\"submit\" value=\"Cancel\"\/>";
        strVar += "        <\/div>";
        strVar += "    <\/div>";
        strVar += "    <input id=\"componentX\" name=\"componentX\" hidden=\"true\"  \/>";
        strVar += "    <input id=\"componentY\" name=\"componentY\" hidden=\"true\" \/>";
        strVar += "    <input id=\"componentType\" name=\"componentType\" hidden=\"true\" value=\"doc\" \/>";
        strVar += "    <input id=\"componentId\" name=\"componentId\" hidden=\"true\" hidden=\"true\" \/>";
        strVar += "    <input id=\"componentContent\" name=\"componentContent\" hidden=\"true\" \/>";
        strVar += "    <input id=\"collectionId\" name=\"collectionId\" hidden=\"true\" \/>";
        strVar += "    <input id=\"contextId\" name=\"contextId\" hidden=\"true\" \/>";
        strVar += "    <input id=\"debug\" name=\"debug\" hidden=\"true\" \/>";

        return strVar;
    }

    var folderEntry = function(x,y, popName){
        $("#"+popName).html(getDocumentHtml());
        $("#"+popName).show();
        $("#cancel").on("click", function(){
            $("#"+popName).html("");
            $("#"+popName).hide();
            eatNextClick=true;
            var thisLibraryArea = new libraryArea();
            thisLibraryArea.entry();

        });
        $("#save").on("click", function(){
            $("#"+popName).hide();
            saveFolder();
        });
        $("#componentX").val(x);
        $("#componentY").val(y);
        $("#componentType").val("folder");

        ed = CKEDITOR.replace("folderDescription",
            {
                height:"200", width:"800",
                filebrowserBrowseUrl : 'lib/filebrowser.html',
                filebrowserUploadUrl : '/lib/upload.php'

            });
    }

    var saveFolder = function(){
        var ckInstance = findCkInstanceByName("folderDescription");
        var folderDescription = ckInstance.getData();

        var thisTransaction = urlBase+insert_new_folder+"?"+debug;
        var myData = { description:folderDescription, title: $("#folderTitle").val(), collectionId:$("#collectionId").val(), contextId: $("#contextId").val() };

        $.ajax({
            type: "POST",
            url: thisTransaction,
            data: myData,
            success: function(msg) {
                if(msg!="ok"){
                    alert("problem with save");
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
}
