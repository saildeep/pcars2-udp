const fs = require('fs');
const UdpParser = require('./udp-parser');
const parser = new UdpParser('./SMS_UDP_Definitions.hpp');
const samples = fs.readdirSync('./sample');
console.log(samples);
let samplesIndex = 0;
let samplesLoop = setInterval(()=>{
    parser.pushBuffer(fs.readFileSync('sample/' + samples[samplesIndex]));
    samplesIndex++;
    if(samplesIndex == samples.length){
        clearInterval(samplesLoop);
    }
},50)


parser.on('statistics',(statistics)=>{
  //  console.log(statistics.sTelemetryData);
});
