console.log("Starting websocket listener");
import '../stylesheet/style.less';
import * as d3 from 'd3';
import * as io from 'socket.io-client';
const socket = io();

let components:BaseComponent[] = [];


window.addEventListener('resize', function(event){
   resetAll();
});

function resetAll(){
    components.forEach((e)=>{e.reset()});
}


window.onload = function(){
    
}


