const fs = require('fs');
const UdpParser = require('./udp-parser');
const parser = new UdpParser('./SMS_UDP_Definitions.hpp');
const dgram = require('dgram');

const socket = dgram.createSocket('udp4');
socket.on('message',(msg,info) =>{
    console.log(msg.length);
    parser.pushBuffer(msg);
});

socket.bind(parser.port());