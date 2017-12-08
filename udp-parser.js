const events = require('events');
const fs = require('fs');
const ParseableVariable = require('./parseable-variable.js');
const Struct = require('./struct.js');
const PacketCategoryStatistics = require('./packet-category-statistics.js');

class PCars2UdpParser extends events.EventEmitter{
    constructor(definitionsFile){
        super()
        if(!fs.existsSync(definitionsFile)){
            throw new Error('Definitions file does not exist');
        };
        const fileContent = fs.readFileSync(definitionsFile,{encoding:'utf-8'});
        const lineSplitted = fileContent.split(/\r?\n/);

        //read global defines
        const globalDefineLines = lineSplitted
            .filter((value,index,array)=>{return value.match(/\s*#define/)}) // get all lines with #define
            .map((value,index,array)=>{return value.replace(/\s+/g,' ')}) // removed multiple spaces
            .map((value,index,array)=>{return value.split(/\s/)}) // split to #define NAME VALUE
            .filter((value,index,array)=>{return value.length > 2}); //omit defines without value
        this.globalDefineDict = {};
        globalDefineLines.forEach((line)=>{
            this.globalDefineDict[line[1]] = parseInt(line[2]);
        } );
        
        //get structs
        const allStructs = fileContent.match(/struct \w+\s*\{[^\}]*\};/g);
        let allStructsDict = {};

        allStructs.forEach((struct) =>{

            const structLines =struct.split(/\r?\n/);
            const structName = structLines[0].replace(/\s*struct\s*/g,'');
            const varLines = structLines.filter((line) => {return !line.match(/struct \w+\s*/) && !line.match('[^]*[\}|\{}][^]*')});
            const varLinesWithoutComments = varLines.map((line) => {return line.replace(/\/\/[^]*/g,'');});
            const varLinesSplitted = varLinesWithoutComments.map((line) => { return (" " + line).replace(/\s+/g,' ').replace(/;/,'').trim().split(' ')} );
            let packetSize = -1;

            let structDict = {};
            
            varLinesSplitted.forEach((line) => {
                if(!line[0])
                    return;
                
                if(!line[1])
                    return;

                if(line[0] === 'static' && line[1] === 'const' && line[2] === 'unsigned'){
                    packetSize = parseInt(line[line.length - 1]);
                    return;
                }

                const doubleNameType = line[0] === 'unsigned' || line[0] === 'signed';
                let type = line[0];
                if(doubleNameType){
                    type = type + " " + line[1];
                }
                
                const rawVarName = doubleNameType ? line[2] :line[1];

                const splitVarName = rawVarName.split('[');
                const clearVarName = splitVarName[0];
                let arrayDepths = [];
                for(var i = 1; i< splitVarName.length;i++){
                    const arrayDepth =  parseInt(splitVarName[i].replace(/\]/,'')) || this.globalDefineDict[splitVarName[i].replace(/\]/,'')];
                    arrayDepths.push(arrayDepth);
                }
                
                structDict[clearVarName] = new ParseableVariable(clearVarName,type,arrayDepths);
                
            });
          

            
            allStructsDict[structName] = new Struct(structDict,structName,packetSize)

        } );
        this.allStructsDict = allStructsDict;

        this.packetSizeToStruct = {};
        this.categoryStatistics = {};
        

        for(let structName in allStructsDict){
            const struct = allStructsDict[structName];
            if(struct.packetSize > 0){
                this.packetSizeToStruct[struct.packetSize] = struct;
                struct.getParser(allStructsDict);
                this.categoryStatistics[structName] = new PacketCategoryStatistics(structName);
            }
        }

        
        this.packetIdToStruct = ['sTelemetryData','sRaceData','sParticipantsData','sTimingsData','sGameStateData','','','sTimeStatsData','sParticipantVehicleNamesData'];
        
        setInterval(this.sendStatistics.bind(this),1000);
    };

    pushBuffer(buffer){
        const base = this.parseBase(buffer);
        if(base.mPacketVersion === 2){
            const structName = this.packetIdToStruct[base.mPacketType];
            this.categoryStatistics[structName].push(base.mCategoryPacketNumber);
            //this.emit('statistics',this.categoryStatistics);
            const parsed = this.parseType(buffer,structName);
            this.emit(structName+ '_raw',parsed);

            if(structName === 'sTelemetryData'){
              //console.log(parsed);
               //console.log(buffer.length)
            }
        }
    }

    sendStatistics(){
        this.emit('statistics',this.categoryStatistics);
    }

    parseBase(buffer){
        return this.parseType(buffer,'PacketBase');
    }

    parseType(buffer,type){
        return this.allStructsDict[type].getParser(this.allStructsDict).parse(buffer);
    }

    port(){
        return this.globalDefineDict['SMS_UDP_PORT'];
    }

};

module.exports = exports = PCars2UdpParser;