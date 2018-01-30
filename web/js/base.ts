console.log("Starting websocket listener");
import '../stylesheet/style.less';
import * as d3 from 'd3';
import * as io from 'socket.io-client';
import BaseComponent from './BaseComponent';
import GearComponent from './GearComponent';
import CurrentGearCollector from './CurrentGearCollector';
import BaseValueCollector from './BaseValueCollector';
import HistoricalRPMCollector from './HistoricalRPMCollector';
import HistoricalNumberComponent, { HistoricalNumberComponentConfig } from './HistoricalNumberComponent';
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
const rpmc:HistoricalRPMCollector = new HistoricalRPMCollector(socket,10);
collectors.push(gc);
collectors.push(rpmc);

window.onload = function(){
    components.push(new GearComponent(d3.select('#gear'),gc));
    components.push(new HistoricalNumberComponent(d3.select('#b'),[new HistoricalNumberComponentConfig(rpmc)]));
}


