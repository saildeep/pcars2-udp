
const BaseComponent = require('./BaseComponent');
const ApproximatedMaxCurve = require('./ApproximatedMaxCurve');
const GearRatioTracker = require('./GearRatioTracker');
const d3 = require('d3');

class TorqueCurveComponent extends BaseComponent{
    constructor(socket,div){
        super(socket,div);
        socket.on('sTelemetryData_raw',this.update.bind(this));
        this.colorTorque = "red";
        this.colorPower = "blue";
        this.colorBoost = "lightgreen";
    }

    OnReset(){
        const resolution = 300;

        this.torque = new ApproximatedMaxCurve(resolution);
        this.power = new ApproximatedMaxCurve(resolution);
        this.boost = new ApproximatedMaxCurve(resolution);
        this.gears = new GearRatioTracker();
        this.opticalIntersections = 100;
        this.samplesTorque = this.svg.append('g');
        this.samplesPower = this.svg.append('g');
        this.samplesBoost = this.svg.append('g');
        this.xAxisLines = this.svg.append('g');
        this.xAxisTexts = this.svg.append('g');
        this.currentRpmGroup = this.svg.append('g');
        this.currentRpmDisplay = this.currentRpmGroup
        .append('line')
        .attr('y1',0.1*this.height())
        .attr('y2',0.9*this.height())
        .attr('stroke','aqua')
        .attr('x1',0.1*this.width())
        .attr('x2',0.9*this.width())
        .attr('stroke-width',5)
        this.xAxisInterval = 1000;



        this.nextGearRpmDisplay = this.currentRpmGroup
        .append('line')
        .attr('y1',0.2*this.height())
        .attr('y2',0.8*this.height())
        .attr('stroke','#6874E8')
        .attr('x1',0.1*this.width())
        .attr('x2',0.9*this.width())
        .attr('stroke-width',3)


        this.prevGearRpmDisplay = this.currentRpmGroup
        .append('line')
        .attr('y1',0.2*this.height())
        .attr('y2',0.8*this.height())
        .attr('stroke','#4ca522')
        .attr('x1',0.1*this.width())
        .attr('x2',0.9*this.width())
        .attr('stroke-width',3)
        this.xAxisInterval = 1000;

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

        this.maxBoostText = this.svg.append('text').attr('x',0.9 * this.width()).attr('fill','green');
        this.maxBoostLine = this.svg.append('line')
        .attr('x1',this.width() * 0.1)
        .attr('x2',this.width()*0.9)
        .attr('stroke','green');
       
        this.lastMaxX = 0;
    }
    update(data){
        this.updateCurves(data);
        this.updateCurrentStats(data);
    }

    updateCurrentStats(data){
        const gear = this.gears.update(data);
        const t = data.sEngineTorque;
        const p = t * data.sRpm * (1/60) * 2 * Math.PI * 1e-3 * 1.32;
        if(data.sRpm > this.torque.getMaxX()|| this.torque.getMaxX() < 1)
            return;

        if(gear > 0){
            const xcoord1 = 0.1 * this.width() + 0.8 * this.width() * data.sRpm / this.torque.getMaxX();
            const xcoord2 = 0.1 * this.width() + 0.8 * this.width() * Math.min(this.gears.rpmTarget(gear,data.sSpeed),this.torque.getMaxX() )/ this.torque.getMaxX();
            this.currentRpmDisplay.attr('x1',xcoord1).attr('x2',xcoord2);
        }
        //display for next and previous gear
        const nextRpm = this.gears.rpmNext(gear,data.sRpm);
        const xcoordNext = 0.1 * this.width() + 0.8 * this.width() * nextRpm / this.torque.getMaxX();
        this.nextGearRpmDisplay.attr('x1',xcoordNext).attr('x2',xcoordNext);        

        const prevRpm = Math.min(this.gears.rpmPrevious(gear,data.sRpm),this.torque.getMaxX());
        const xcoordPrev = 0.1 * this.width() + 0.8 * this.width() * prevRpm / this.torque.getMaxX();
        this.prevGearRpmDisplay.attr('x1',xcoordPrev).attr('x2',xcoordPrev);        

    }

    updateCurves(data){
        if(data.sClutch > 0)
            return;

        if(data.sThrottle < 250)
            return;
       
        const t = data.sEngineTorque;
        const p = t * data.sRpm * (1/60) * 2 * Math.PI * 1e-3 * 1.32;
        const b =  (data.sTurboBoostPressure /100000) ; //convert to bar
        const pChanged = this.power.update(data.sRpm,p);
        const tChanged = this.torque.update(data.sRpm,t);
        const bChanged = this.boost.update(data.sRpm,b);
        const curveDirty =  pChanged || tChanged ;
        const lastMaxXDirty = this.lastMaxX != this.power.getMaxX();
        
        

        const maxAxis = Math.max(this.power.getMax(),this.torque.getMax());


        if(curveDirty){
            this.samplesTorque
            .selectAll('circle')
            .data(this.torque.getIntersected(this.opticalIntersections))
            .enter()
            .append('circle')
            .attr('r',5)
            .attr('stroke','red')
            .attr('fill','red');

            this.samplesTorque.selectAll('circle')
            .attr('cx',(d,i)=>{return 0.1 * this.width() + i * this.width() * 0.8 / this.opticalIntersections })
            .attr('cy',(d,i)=>{return 0.1 * this.height() + d * 0.8 * this.height() / maxAxis });


          
            this.samplesPower
            .selectAll('circle')
            .data(this.power.getIntersected(this.opticalIntersections))
            .enter()
            .append('circle')
            .attr('r',5)
            .attr('stroke','blue')
            .attr('fill','blue');

            this.samplesPower.selectAll('circle')
            .attr('cx',(d,i)=>{return 0.1 * this.width() + i  * this.width() * 0.8 / this.opticalIntersections })
            .attr('cy',(d,i)=>{return 0.1 * this.height() + d * 0.8 * this.height() / maxAxis });


            this.samplesBoost
            .selectAll('circle')
            .data(this.boost.getIntersected(this.opticalIntersections))
            .enter()
            .append('circle')
            .attr('r',5)
            .attr('stroke','green')
            .attr('fill','green');

            this.samplesBoost.selectAll('circle')
            .attr('cx',(d,i)=>{return 0.1 * this.width() + i  * this.width() * 0.8 / this.opticalIntersections })
            .attr('cy',(d,i)=>{return 0.1 * this.height() + d * 0.8 * this.height() * 0.75 / this.boost.getMax() });

        
            const torqueY = 0.1* this.height() + this.height() * this.torque.getMax()/maxAxis * 0.8;
            
            this.maxTorqueText.attr('y',torqueY).html(this.torque.getMax().toFixed(0) + "NM");
            this.maxTorqueLine.attr('y1',torqueY).attr('y2',torqueY);
    
    
            const powerY = 0.1 * this.height() + this.height() * this.power.getMax() / maxAxis * 0.8;
            this.maxPowerText.attr('y',powerY).html(this.power.getMax().toFixed(0)+ "HP");
            this.maxPowerLine.attr('y1',powerY).attr('y2',powerY);

            const boostY = this.boost.getMax() > 0.01 ? this.height() * 0.1 + this.height() * 0.8 * 0.75 : this.height() * 0.1;
            this.maxBoostText.attr('y',boostY).html(this.boost.getMax().toFixed(2) + "Bar");
            this.maxBoostLine.attr('y1',boostY).attr('y2',boostY);
                    
        }
        
        if(lastMaxXDirty){
            this.lastMaxX = this.power.getMaxX();
            var xValues = [];
            for(var i = 0;i<= this.torque.getMaxX();i+=this.xAxisInterval){
                xValues.push(i);
            }

            this.xAxisLines
            .selectAll('line')
            .data(xValues)
            .enter()
            .append('line');

            this.xAxisLines.selectAll('line')
            .attr('y2',0.1 * this.height())
            .attr('y1',0.9 * this.height())
            .attr('stroke','lightgray')
            .attr('x2',(d,i)=>{return 0.1 * this.width() + d * this.width() * 0.8 / this.torque.getMaxX() } )
            .attr('x1',(d,i)=>{return 0.1 * this.width() + d * this.width() * 0.8 / this.torque.getMaxX() } );
            
            this.xAxisTexts
            .selectAll('text')
            .data(xValues)
            .enter()
            .append('text');
            this.xAxisTexts.selectAll('text')
            .attr('x',(d,i)=>{return 0.1 * this.width() + d * this.width() * 0.8 / this.torque.getMaxX() })
            .attr('y',(d,i) => {return i%2 == 0 ? 0.95 *  this.height(): 0.05 * this.height();})
            .attr('text-anchor','middle')
            .html((d)=>{return d + 'rpm'} );

        }

        
    }

}


module.exports = exports = TorqueCurveComponent;