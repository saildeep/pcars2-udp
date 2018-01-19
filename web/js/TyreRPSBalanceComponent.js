const BaseComponent = require('./BaseComponent');
const d3 = require('d3');


class TyreRPSBalanceComponent extends BaseComponent{
    constructor(socket,div){
        super(socket,div);
        socket.on('sTelemetryData_raw',this.update.bind(this));
    }

    OnReset(){
        this.tyrePositions = [
            {x:0.2,y:0.2},
            {x:0.8,y:0.2},
            {x:0.2,y:0.8},
            {x:0.8,y:0.8}
        ];

        this.factors = [0.99,0.97,0.95,0.9,0.8];
        this.rpsDataset = this.factors.map(function(d){
            return new SmoothedTyreDataset(d);
        });
        this.heightDataset = this.factors.map(function(d){
            return new SmoothedTyreDataset(d);
        });

        this.factorOffset = 0.03;
        
        this.contentPoints = this.svg.append('g');
        
    }

    linearInterpolation(start,end,weight){
        return (end - start) * weight + start;
    }

    update(data){
        const rps = data.sTyreRPS;
        const height = data.sTyreY;
       
        this.rpsDataset.forEach(function(d){d.update(rps)});
        this.heightDataset.forEach(function(d){d.update(height)});
        let points = [];


        const safeRemap = (x) => {return Math.sign(x) * Math.abs(x) / (Math.abs(x) + 1)}
        const rpsRescale = (x,a,b) => {return safeRemap(x * (a+b)/4)};

        this.rpsDataset.forEach(function(d,i){
            points.push(this.getInterpolatedTyrePosition(d.getData(),0,1,{x:0,y:(i +1) * this.factorOffset},{color:'red'},rpsRescale));
            points.push(this.getInterpolatedTyrePosition(d.getData(),2,3,{x:0,y:-(i+1) * this.factorOffset},{color:'red',rpsRescale}));
            points.push(this.getInterpolatedTyrePosition(d.getData(),0,2,{y:0,x:(i+1) * this.factorOffset},{color:'red'},rpsRescale));
            points.push(this.getInterpolatedTyrePosition(d.getData(),1,3,{y:0,x:-(i+1) * this.factorOffset},{color:'red'},rpsRescale));
        }.bind(this));
        

        this.heightDataset.forEach(function(d,i){
            points.push(this.getInterpolatedTyrePosition(d.getData(),0,1,{x:0,y:-(i +1) * this.factorOffset},{color:'blue'}));
            points.push(this.getInterpolatedTyrePosition(d.getData(),2,3,{x:0,y:(i+1) * this.factorOffset},{color:'blue'}));
            points.push(this.getInterpolatedTyrePosition(d.getData(),0,2,{y:0,x:-(i+1) * this.factorOffset},{color:'blue'}));
            points.push(this.getInterpolatedTyrePosition(d.getData(),1,3,{y:0,x:(i+1) * this.factorOffset},{color:'blue'}));
        }.bind(this));
        
        

        const w = this.width();
        const h = this.height();

        this.contentPoints.selectAll('g').data(points).enter().append('g');
        this.contentPoints.selectAll('g').selectAll('line').data(function(d,i){return d.anchors}).enter().append('line');
        this.contentPoints.selectAll('g').selectAll('line')
        .attr('stroke','black')
        .attr('fill','black')
        .attr('x1',function(d,i){return d[0].x * w})
        .attr('y1',function(d,i){return d[0].y * h})
        .attr('x2',function(d,i){return d[1].x * w})
        .attr('y2',function(d,i){return d[1].y * h});
        this.contentPoints.selectAll('g').selectAll('circle').data(function(d,i){return [d]}).enter().append('circle');
        this.contentPoints.selectAll('g').selectAll('circle').attr('cx',function(d,i){return d.x * w}).attr('cy',function(d,i){return d.y * h})
        .attr('fill',function(d){return d.additional.color}).attr('r',10);
    }

    getInterpolatedTyrePosition(tyreData,indexone,indextwo,offset,additional,renorm){
        const renormFN = renorm? renorm: (x,a,b) => {return x};
        const rps = tyreData
        const oset = offset || {x:0,y:0};
        const arps = rps[indexone];
        const brps = rps[indextwo];
        const initialRatio = 1- Math.max(Math.min( (brps / (arps + brps)) || 0,1),0); //ratio in range[0,1]
        const symmetricRatio = initialRatio * 2.0 - 1.0; //ratio in range [-1,1]
        const renormedRatio = renormFN(symmetricRatio,arps,brps);
        const ratio = Math.max( Math.min((renormedRatio + 1.0) / 2.0,1),0);
        const apos = this.tyrePositions[indexone];
        const a = apos;
        const bpos = this.tyrePositions[indextwo];
        const b = bpos;
        const p = {x:this.linearInterpolation(a.x,b.x,ratio) + oset.x,y:this.linearInterpolation(a.y,b.y,ratio)+oset.y}; 
        return {x:p.x,y:p.y,additional:additional,anchors:[
            [p,apos],
            [p,bpos],
            
        ]};
    }

    
}

class SmoothedTyreDataset{
    constructor(smoothingFactor){
        this.smoothingFactor = smoothingFactor || 0.99;
        this.data = [0,0,0,0];
    }

    update(dataArray){
        for(var i = 0;i<this.data.length;i++){
            this.data[i] = this.data[i] * this.smoothingFactor + dataArray[i] * (1-this.smoothingFactor);
        }
    }

    getData(){
        return this.data;
    }
}

module.exports = exports = TyreRPSBalanceComponent;