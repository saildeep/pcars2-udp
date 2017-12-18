console.log("Starting websocket listener");
const stylesheet = require('../stylesheet/style.less');
const d3 = require('d3');

const UDPStatisticsComponent = require('./UDPStatisticsComponent.js');
const ToruqeCurveComponent = require('./TorqueCurveComponent.js');
const GearComponent = require('./GearComponent.js');
const GearCurveComponent = require('./GearCurveComponent.js');
const TyreRPSBalanceComponent = require('./TyreRPSBalanceComponent.js');
var socket = io();

let components = [];

window.addEventListener('resize', function(event){
   resetAll();
});

function resetAll(){
    components.forEach((e) => {e.reset()})
}


window.onload = function(){
    components.push(new UDPStatisticsComponent(socket,d3.select('#statistics')));
    components.push(new ToruqeCurveComponent(socket,d3.select('#b')));
    components.push(new GearComponent(socket,d3.select('#gear')));
    components.push(new TyreRPSBalanceComponent(socket,d3.select('#tr')));
}




socket.on('sTelemetryData_raw',(data) =>{
    if( (data.sDPad & 1) > 0){
        resetAll();
    }
})