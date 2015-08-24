/**
 * Created with JetBrains WebStorm.
 * User: georgepipkin
 * Date: 5/6/13
 * Time: 9:57 PM
 * To change this template use File | Settings | File Templates.
 */


function component(){

    this.NOT_DROPPED = 0;
    this.ACTIVE = 1;
    this.CONNECTION_STARTED = 2;
    this.WAITING_CONNECTION_END = 3;
    this.status = this.NOT_DROPPED;
    this.x = 0;
    this.y = 0;
    this.icon = "";
    this.active = false;
    this.layerName = "";
    this.title="";
    this.handleMup = function (layer) {
        switch (this.status) {
            case this.ACTIVE:
                break;
            case  this.NOT_DROPPED:
//                replaceIcon(this.icon);
                $("#subContext").val(inContextNow);
                layer.data.contentEntry(Math.round(layer.eventX), Math.round(layer.eventY), layer.name,"popup", $("#subContext").val());
                this.status = this.ACTIVE;
                break;

        }
    };
    this.wasClicked = function(layer){
        s=1;
    }
}


