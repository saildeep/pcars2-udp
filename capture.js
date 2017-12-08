const dgram = require('dgram');
const socket = dgram.createSocket('udp4');
const fs = require('fs');
let i = 0;
socket.on('message',(msg,info)=>{
    fs.writeFile('sample/' + new Date().getTime() + "_" + i+ ".bin",msg);
    i++;
});
socket.bind(5606);