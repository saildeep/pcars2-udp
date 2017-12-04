const Parser = require('binary-parser').Parser;

class Struct{
    constructor(valueDict,name,packetSize){
        this.valueDict = valueDict;
        this.name = name;
        this.packetSize = packetSize;
        this.parser = null;
    }

    getParser(otherStructs){
        if(this.parser)
            return this.parser;

        let p = new Parser();
        for(var varName in this.valueDict){
            p = this.valueDict[varName].appendToParser(p,otherStructs);
            if(!p)
                throw new Error("Invalid parser returned");
        }
        this.parser = p;
        return p;
    }
}

module.exports = exports = Struct;