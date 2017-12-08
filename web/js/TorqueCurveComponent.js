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
        this.xAxisLines = this.svg.append('g');
        this.xAxisTexts = this.svg.append('g');
        this.xAxisInterval = 1000;

        this.maxTorque = 50;
        this.maxPower = 50;

        this.maxTorqueText = this.svg.append('text').attr('x',0.01 * this.width()).attr('fill','red');
        this.maxTorqueLine = this.svg.append('line')
        .attr('x1',this.width() * 0.1)
        .attr('x2',this.width()*0.9)
        .attr('stroke','red');
        
        this.maxPowerText = this.svg.append('text').attr('x',0.9 * this.width()).attr('fill','blue');
        this.maxPowerLine = this.svg.append('line')
        .attr('x1',this.width() * 0.1)
        .attr('x2',this.width()*0.9)
        .attr('stroke','blue');
       


        this.lastMaxRpm;
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

        const maxAxis = Math.max(this.maxTorque,this.maxPower);

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
        .attr('cy',(d,i)=>{return 0.1 * this.height() + d * 0.8 * this.height() / maxAxis });


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
        .attr('cy',(d,i)=>{return 0.1 * this.height() + d * 0.8 * this.height() / maxAxis });

        
        var xValues = [];
        for(var i = 0;i<= data.sMaxRpm;i+=this.xAxisInterval){
            xValues.push(i);
        }

        this.xAxisLines
        .selectAll('line')
        .data(xValues)
        .enter()
        .append('line')
        .attr('y2',0.1 * this.height())
        .attr('y1',0.9 * this.height())
        .attr('stroke','lightgray')
        .attr('x2',(d,i)=>{return 0.1 * this.width() + d * this.width() * 0.8 / data.sMaxRpm } )
        .attr('x1',(d,i)=>{return 0.1 * this.width() + d * this.width() * 0.8 / data.sMaxRpm } );
        
        this.xAxisTexts
        .selectAll('text')
        .data(xValues)
        .enter()
        .append('text')
        .attr('x',(d,i)=>{return 0.1 * this.width() + d * this.width() * 0.8 / data.sMaxRpm })
        .attr('y',(d,i) => {return i%2 == 0 ? 0.95 *  this.height(): 0.05 * this.height();})
        .attr('text-anchor','middle')
        .html((d)=>{return d + 'rpm'} );


        const torqueY = 0.1* this.height() + this.height() * this.maxTorque/maxAxis * 0.8;

        this.maxTorqueText.attr('y',torqueY).html(this.maxTorque.toFixed(0) + "NM");
        this.maxTorqueLine.attr('y1',torqueY).attr('y2',torqueY);


        const powerY = 0.1 * this.height() + this.height() * this.maxPower / maxAxis * 0.8;
        this.maxPowerText.attr('y',powerY).html(powerY.toFixed(0)+ "HP");
        this.maxPowerLine.attr('y1',powerY).attr('y2',powerY);
        
    }

}

module.exports = exports = TorqueCurceComponent;