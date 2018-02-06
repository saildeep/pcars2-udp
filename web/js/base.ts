console.log("Starting websocket listener");
import '../stylesheet/style.less';
import * as d3 from 'd3';
import * as io from 'socket.io-client';
import BaseComponent from './BaseComponent';
import GearComponent from './GearComponent';
import CurrentGearCollector from './CurrentGearCollector';
import BaseValueCollector from './BaseValueCollector';

import HistoricalNumberComponent, { HistoricalNumberComponentConfig } from './HistoricalNumberComponent';
import { HistoricalRPMCollector, HistoricalTyreRPSCollector, HistoricalTorqueCollector } from './HistoricalNumberCollectors';
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
const torquec:HistoricalRPMCollector = new HistoricalTorqueCollector(socket,10);
const tyreRPS:HistoricalTyreRPSCollector[] = [0,1,2,3].map(function(t:number){return new HistoricalTyreRPSCollector(socket,10,0.1,t);});
collectors.push(gc);
collectors.push(rpmc);
collectors.push(...tyreRPS);

window.onload = function(){
    components.push(new GearComponent(d3.select('#gear'),gc));
    components.push(new HistoricalNumberComponent(d3.select('#b'),[
        new HistoricalNumberComponentConfig(rpmc),
        new HistoricalNumberComponentConfig(torquec,'#0000','#EEE','NM',true),
        new HistoricalNumberComponentConfig(tyreRPS[0],'#0000','#A0F','TyreRPS',false),
        new HistoricalNumberComponentConfig(tyreRPS[1],'#0000','#A0A','TyreRPS',false),
        new HistoricalNumberComponentConfig(tyreRPS[2],'#0000','#F0F','TyreRPS',false),
        new HistoricalNumberComponentConfig(tyreRPS[3],'#0000','#F0A','TyreRPS',false),
    ]));
}


