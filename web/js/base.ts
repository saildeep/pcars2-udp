console.log("Starting websocket listener");
import '../stylesheet/style.less';
import * as d3 from 'd3';
import * as io from 'socket.io-client';
import BaseComponent from './BaseComponent';
import GearComponent from './GearComponent';
import CurrentGearCollector from './CurrentGearCollector';
import BaseValueCollector from './BaseValueCollector';
const socket = io();

let components:BaseComponent[] = [];
let collectors:BaseValueCollector<any>[] = [];

window.addEventListener('resize', function(event){
   resetAll();
});

function resetAll(){
    components.forEach((e)=>{e.reset()});
}

const gc:CurrentGearCollector = new CurrentGearCollector(socket);
collectors.push(gc);

window.onload = function(){
    components.push(new GearComponent(d3.select('#gear'),gc));
}


