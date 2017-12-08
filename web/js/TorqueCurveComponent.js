const BaseComponent = require('./BaseComponent');
const d3 = require('d3');

class TorqueCurceComponent extends BaseComponent{
    constructor(socket,div){
        super(socket,div);
        socket.on('sTelemetryData_raw',this.update.bind(this));
    }

    OnReset(){
        this.torque = [];
        this.power = [];
        this.rpminterval = 100;
        this.samplesTorque = this.svg.append('g');
        this.samplesPower = this.svg.append('g');

        this.maxTorque = 50;
        this.maxPower = 50;
        
    }

    update(data){
        if(data.sClutch > 0)
            return;

        if(data.sThrottle < 128)
            return;

        const index = Math.floor(data.sRpm / this.rpminterval);
        var dirty = false;


        while(this.power.length <= index || this.torque.length <= index){
            this.power.push(0);
            this.torque.push(0);
            dirty = true;
        }

        const t = data.sEngineTorque;
        const p = t * data.sRpm * (1/60) * 2 * Math.PI * 1e-3 * 1.32;
        if(t > this.torque[index]){
            this.torque[index] = t;
            dirty = true;
        }

        if(p > this.power[index]){
            this.power[index] = p;
            dirty = true;
        }

        if(!dirty)
            return;
       
        this.maxTorque = Math.max(this.maxTorque,t);
        this.maxPower = Math.max(this.maxPower,p);


        this.samplesTorque
        .selectAll('circle')
        .data(this.torque)
        .enter()
        .append('circle')
        .attr('r',5)
        .attr('stroke','red')
        .attr('fill','red');

        this.samplesTorque.selectAll('circle')
        .attr('cx',(d,i)=>{return 0.1 * this.width() + i * this.rpminterval * this.width() * 0.8 / data.sMaxRpm })
        .attr('cy',(d,i)=>{return 0.1 * this.height() + d * 0.8 * this.height() / this.maxTorque });


        this.samplesPower
        .selectAll('circle')
        .data(this.power)
        .enter()
        .append('circle')
        .attr('r',5)
        .attr('stroke','blue')
        .attr('fill','blue');

        this.samplesPower.selectAll('circle')
        .attr('cx',(d,i)=>{return 0.1 * this.width() + i * this.rpminterval * this.width() * 0.8 / data.sMaxRpm })
        .attr('cy',(d,i)=>{return 0.1 * this.height() + d * 0.8 * this.height() / this.maxPower });

    }

}

module.exports = exports = TorqueCurceComponent;