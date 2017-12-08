const BaseComponent = require('./BaseComponent');
const d3 = require('d3');

class GearComponent extends BaseComponent{
    constructor(socket,div){
        super(socket,div);
        socket.on('sTelemetryData_raw',this.update.bind(this));
    }

    OnReset(){
        this.text=  this.svg
        .append('text')
        .attr('text-anchor','middle')
        .attr('font-size',Math.min(this.height() * 0.8, this.width() *0.8 ))
        .html('N')
        .attr('x',this.width()/2)
        .attr('y',this.height() * 0.9);
    }

    update(data){
        const gear = data.sGearNumGears & 0xF;
        var gearString = "R";
        if(gear === 0){
            gearString = "N";
        }else if(gear < 15){
            gearString = "" + gear;
        }
        this.text.html(gearString);


    }

}

module.exports = exports = GearComponent;