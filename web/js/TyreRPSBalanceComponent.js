const BaseComponent = require('./BaseComponent');
const d3 = require('d3');


class TyreRPSBalanceComponent extends BaseComponent{
    constructor(socket,div){
        super(socket,div);
        socket.on('sTelemetryData_raw',this.update.bind(this));
    }

    OnReset(){
        this.tyrePositions = [
            {x:0.1,y:0.1},
            {x:0.9,y:0.1},
            {x:0.1,y:0.9},
            {x:0.9,y:0.9}
        ];

        
        this.contentPoints = this.svg.append('g');
        
    }

    linearInterpolation(start,end,weight){
        return (end - start) * weight + start;
    }

    update(data){
        const rps = data.sTyreRPS;
        let points = [

         this.getInterpolatedTyrePosition(rps,0,1),
        this.getInterpolatedTyrePosition(rps,2,3)
        ];

        const w = this.width();
        const h = this.height();

        this.contentPoints.selectAll('g').data(points).enter().append('g');
        this.contentPoints.selectAll('g').selectAll('line').data(function(d,i){return d.anchors}).enter().append('line');
        this.contentPoints.selectAll('g').selectAll('line')
        .attr('stroke','red')
        .attr('fill','red')
        .attr('x1',function(d,i){return d[0].x * w})
        .attr('y1',function(d,i){return d[0].y * h})
        .attr('x2',function(d,i){return d[1].x * w})
        .attr('y2',function(d,i){return d[1].y * h});
        this.contentPoints.selectAll('g').selectAll('circle').data(function(d,i){return [d]}).enter().append('circle');
        this.contentPoints.selectAll('g').selectAll('circle').attr('cx',function(d,i){return d.x * w}).attr('cy',function(d,i){return d.y * h})
        .attr('fill','red').attr('r',10);
    }

    getInterpolatedTyrePosition(rps,indexone,indextwo){
        const arps = rps[indexone];
        const brps = rps[indextwo];
        const ratio = (brps / (arps + brps)) || 0;
        const apos = this.tyrePositions[indexone];
        const a = apos;
        const bpos = this.tyrePositions[indextwo];
        const b = bpos;
        const p = {x:this.linearInterpolation(a.x,b.x,ratio),y:this.linearInterpolation(a.y,b.y,ratio)}; 
        return {x:this.linearInterpolation(a.x,b.x,ratio),y:this.linearInterpolation(a.y,b.y,ratio),anchors:[
            [p,apos],
            [p,bpos]
        ]};
    }

    
}

module.exports = exports = TyreRPSBalanceComponent;