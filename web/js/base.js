console.log("Starting websocket listener");
const stylesheet = require('../stylesheet/style.less');
const d3 = require('d3');

const UDPStatisticsComponent = require('./UDPStatisticsComponent.js');
const ToruqeCurveComponent = require('./TorqueCurveComponent.js');


var socket = io();

let components = [];

window.addEventListener('resize', function(event){
    components.forEach((e) => {e.reset()})
});

window.onload = function(){
    components.push(new UDPStatisticsComponent(socket,d3.select('#statistics')));
    components.push(new ToruqeCurveComponent(socket,d3.select('#torque')));
    
}