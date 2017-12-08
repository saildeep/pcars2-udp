console.log("Starting websocket listener");

var socket = io();
var svgContainer = d3.select("#d3").append("svg")                                  
.attr("width", window.innerWidth)
.attr("height", window.innerHeight);






socket.on('sTelemetryData_raw',(data)=>{
    var relativeRPM = parseInt(svgContainer.attr("width")) * data.sRpm / data.sMaxRpm;
    var torque = data.sEngineTorque;
    var power = data.sEngineTorque * Math.PI * 2 * (1/60) * data.sRpm * 1e-3 * 1.3405;
   
    svgContainer.append("circle").attr("cx",relativeRPM).attr("cy",power).attr('r',4).attr('fill',rgb(255-data.sThrottle,255 - data.sThrottle,255));
    svgContainer.append("circle").attr("cx",relativeRPM).attr("cy",torque).attr('r',4).attr('fill',rgb(255,255 -data.sThrottle,255  - data.sThrottle));
    
});


function rgb(r,g,b){
    return "rgb(" + r + "," +g + ","+b + ")"
}

