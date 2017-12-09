const BaseComponent = require('./BaseComponent');
const d3 = require('d3');

class GearCurveComponent extends BaseComponent{
    constructor(socket,div){
        super(socket,div);
        socket.on('sTelemetryData_raw',this.update.bind(this));
    }

    OnReset(){
        this.text=  this.svg
        .append('text')
        .attr('text-anchor','middle')
        .attr('font-size',10)
        .html('N')
        .attr('x',this.width()/2)
        .attr('y',this.height() * 0.9);

        this.samples = this.svg.append('g');

        this.approxRatio = {};
        this.maxGear = 2;
       

        //acceleration value, may be exchanged by torque and power
        this.accelData = [];
        this.accelInterval = 100;
        this.maxAccel = 1;
        

        this.gearToColor  = {};
        for(var g = 1; g <14;g++){
            this.gearToColor[g] = this.randomColor();
        }
    }

    randomColor(){
        return "rgb(" + Math.floor(Math.random() *255) + "," + Math.floor(Math.random() *255) + "," + Math.floor(Math.random() *255) + ")";
    }

    update(data){
       var gear = data.sGearNumGears & 0xF;
        if(gear <= 0 || gear >= 15)
            return;
        if(data.sClutch > 0)
            return;

        if(gear > this.maxGear){
            this.maxGear = gear;
        }
      

        //estimate gear ratios
        const speed = - data.sTyreRPS.reduce((a,b) => {return a + b} );
        const ratio =  speed / data.sRpm;
        const prevRatio = this.approxRatio[gear]== undefined ? ratio:this.approxRatio[gear];
        const s = 0.999;
        const newRatio = prevRatio * s + (1 -s ) * ratio;
        this.approxRatio[gear] = newRatio;
        


        const accelIndex = Math.floor(data.sRpm / this.accelInterval);
        const maxAccelIndex = Math.floor(data.sMaxRpm/this.accelInterval);
        while(this.accelData.length <= maxAccelIndex){
            this.accelData.push(0);
        }

        const accelValue = data.sEngineTorque;
        //const accelValue = data.sEngineTorque * data.sRpm * (1/60) * 2 * Math.PI * 1e-3 * 1.32;

        if(accelValue > this.accelData[accelIndex]){
            this.accelData[accelIndex] = accelValue;
        }
        if(accelValue > this.maxAccel){
            this.maxAccel = accelValue;
        }

        if(this.approxRatio[1] == undefined){
            this.text.html("Shift into first gear to collect data")
            return;
        }

        if(this.approxRatio[this.maxGear] == undefined){
            
            this.text.html("Shift into second gear to collect data");
            return;
        }

        
        const baseRatio = this.approxRatio[1];
        const finalRatio = this.approxRatio[this.maxGear];
        
        const max = finalRatio * this.accelData.length * this.accelInterval;


        var dataset = [];
        const gtoc = this.gearToColor;
        for(var g = 1; g<= this.maxGear;g++ ){
            const ratio = ( this.approxRatio[g] ? this.approxRatio[g] : 0) ;
            dataset.push(this.accelData.map((v,i) =>{return {
                gear:g,
                ratio :ratio,
                accel:(v/ratio) / (this.maxAccel / baseRatio),
                relativeOffset:( ratio * i * this.accelInterval ) / max,
                color: gtoc[g]
            };} ));
        }
        this.samples.selectAll('g').data(dataset).enter().append('g');
        this.samples.selectAll('g').selectAll('circle').data(function(d,i){return d;}).enter().append('circle');

        this.samples
        .selectAll('g')
        .selectAll('circle')
        .attr('cx',(d)=>{return d.relativeOffset * this.width()})
        .attr('cy',(d)=>{return d.accel * this.height()})
        .attr('r',4)
        .attr('fill',function(d){return d.color})
        .attr('stroke',function(d){return d.color});
        


        
        this.text.html("");

    }

}

module.exports = exports = GearCurveComponent;