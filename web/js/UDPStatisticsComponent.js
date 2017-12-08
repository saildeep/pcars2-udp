const BaseComponent = require('./BaseComponent');
class UDPStatisticsComponent extends BaseComponent{
    constructor(socket,div){
        super(socket,div);
        socket.on('statistics',this.update.bind(this));
    }

    OnReset(){
        this.div.append('svg').attr("height",this.height()).attr("width",this.width());
    }


    update(){

    }



}

module.exports = UDPStatisticsComponent;