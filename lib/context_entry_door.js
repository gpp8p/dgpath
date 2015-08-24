/**
 * Created by georgepipkin on 2/24/14.
 */

function context_entry_door(){
    this.x = 0;
    this.y = 0;
    this.icon = "entry_door";
    this.active = false;
    this.layerName = "";
    this.contentEntry = function(x,y,n,popName,saveContext){ showEdEntryScreen(this,x,y,n)};
//    this.contentUpdate = function(l){ showEdUpdateScreen(this,l)};
    this.contentEdit = function(thisComponent,layer, connections){ editEdContent(this,thisComponent,layer, connections)};
    this.getPathOptions = function(componentId, contextId, connectionId){
        return [];
    }
    return this;
}

context_entry_door.prototype = new component();

