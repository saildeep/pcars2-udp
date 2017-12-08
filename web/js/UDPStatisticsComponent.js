const BaseComponent = require('./BaseComponent');
const d3 = require('d3');
const arc = d3.arc();
class UDPStatisticsComponent extends BaseComponent{
    constructor(socket,div){
        super(socket,div);
        socket.on('statistics',this.update.bind(this));
    }

    OnReset(){
        this.svg.append('text').attr('x',10).attr('y',this.height() / 8).html('Loss Rate');
        this.svg.append('text').attr('x',10 + this.width() / 2).attr('y',this.height() / 8).html('Data Interval');

        this.skipRateCircle = this.svg.append('path').attr('d',this.getArc(0.5)).attr('fill','black').attr('transform','translate('+ this.width()/4 +','+ this.height()/3 +')');
        this.frequencyText = this.svg.append('text').attr('x',this.width()* 3/4).attr('y',this.height()/3);
    }


    update(data){

        const interval = data.sTelemetryData.smoothInterval;
        const skipRate = data.sTelemetryData.smoothSkipRatio;
        this.skipRateCircle.attr('d',this.getArc(skipRate));
        this.frequencyText.html(interval.toFixed(2)+ 'ms');
    }

    getArc(skipRate){
        return arc({
            innerRadius: 0,
            outerRadius: 100,
            startAngle: 0,
            endAngle: (skipRate) * Math.PI * 2
        });
    }


}

module.exports = UDPStatisticsComponent;