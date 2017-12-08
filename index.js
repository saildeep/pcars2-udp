const fs = require('fs');
const UdpParser = require('./udp-parser');
const parser = new UdpParser('./SMS_UDP_Definitions.hpp');
const dgram = require('dgram');

const socket = dgram.createSocket('udp4');
socket.on('message',(msg,info) =>{
    parser.pushBuffer(msg);
});
parser.on('statistics',(statistics)=>{
    console.log(statistics.sTelemetryData);
});

socket.bind(parser.port());