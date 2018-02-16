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


let raceTrack:string = "";
socket.on('sRaceData_raw',function(data:any){
   
    const newRT = data.sTrackLocation+ data.sTrackVariation;
    if(raceTrack!= newRT){
        raceTrack = newRT;
        resetAll();
    }
});

window.addEventListener('resize', function(event){
   resetAll();
});

function resetAll(){
    collectors.forEach((e)=>{e.reset()});
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
        new HistoricalNumberComponentConfig(tyreRPS[0],'Tyre FL','#0000','#FA0','TyreRPS',false),
        new HistoricalNumberComponentConfig(tyreRPS[1],'Tyre FR','#0000','#F0A','TyreRPS',false),
        new HistoricalNumberComponentConfig(tyreRPS[2],'Tyre RL','#0000','#AF0','TyreRPS',false),
        new HistoricalNumberComponentConfig(tyreRPS[3],'Tyre RR','#0000','#0FA','TyreRPS',false),
    ]));

    components.push(new HistoricalNumberComponent(d3.select('#c'),[
            new HistoricalNumberComponentConfig(rpmc,'Engine RPM','#0000','aqua','RPM',true),
            new HistoricalNumberComponentConfig(torquec,'Torque','#0000','#EEE','NM',true)
           
    ]));
}


