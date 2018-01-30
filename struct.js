const Parser = require('binary-parser').Parser;

class Struct{
    constructor(valueDict,name,packetSize){
        this.valueDict = valueDict;
        this.name = name;
        this.packetSize = packetSize;
        this.parser = null;
    }

    getParser(otherStructs,nested){
        if(this.parser)
            return this.parser;

        
        let p = new Parser();
        

        if(!nested)
           // console.log("struct " + this.name + "{");
        for(var varName in this.valueDict){
            const variable = this.valueDict[varName];
            if(!nested)
         //       console.log("    " + variable.varType + JSON.stringify(variable.arraySize) + "    " + variable.varName + ";     //" + p.sizeOf());
            p = variable.appendToParser(p,otherStructs);
            if(!p)
                throw new Error("Invalid parser returned " + p);
        }
        if(!nested)
           // console.log("};");
        
        this.parser = p;
        return p;
    }
}

module.exports = exports = Struct;