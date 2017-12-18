const fs = require('fs');
const UdpParser = require('./udp-parser');
const parser = new UdpParser('./SMS_UDP_Definitions.hpp');
const dgram = require('dgram');


const socket = dgram.createSocket('udp4');
socket.on('message',(msg,info) =>{
    parser.pushBuffer(msg);
});

socket.bind(parser.port());

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const createWebpackMiddleware = require('webpack-express-middleware');
const webpackConfig = require('./web/webpack.config.js');


app.get('/',(req,res)=>{
    res.sendFile(__dirname + "/web/static/index.html");
});

app.use(express.static('web/static'));

const compiler = require('webpack')(webpackConfig);
const webpackMiddleware = createWebpackMiddleware(compiler, webpackConfig);
webpackMiddleware(app);

parser.on('sTelemetryData_raw',(data)=>{
    //console.log("Sending telemetry data");
    io.sockets.emit('sTelemetryData_raw',data);
});

parser.on('statistics',(data)=>{
    io.sockets.emit('statistics',data);
});


http.listen(3000, function(){
    console.log('listening on *:3000');
});

      