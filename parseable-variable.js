
const Parser = require('binary-parser').Parser;

const typesDict={

'signed char': Parser.prototype.int8,
'unsigned char': Parser.prototype.uint8,
'char': Parser.prototype.uint8,

'signed short': Parser.prototype.int16,
'unsigned short': Parser.prototype.uint16,

'signed int': Parser.prototype.int32,
'unsigned int': Parser.prototype.uint32,

'float': Parser.prototype.float,
'double':Parser.prototype.double,

};
class ParseableVariable{
    constructor(varName,varType,arraySize){
        this.varName = varName;
        this.varType = varType;
        this.arraySize = arraySize;
        
    }

    appendToParser(parser,otherStructs){

        if(!parser)
            throw new Error("Parser missing");

        if(this.varType === 'char' && this.arraySize.length === 1){
            return parser.string(this.varName,{encoding:'utf8',length:this.arraySize[0]});
        }

        if(this.varType === 'char' && this.arraySize.length > 1){
            return this.getArrayParser(parser,this.arraySize.slice(0,-1),new Parser().string('',{encoding:'utf8',length:this.arraySize[this.arraySize.length-1]}));
        }

        //e.g. unsigned int
        if(typesDict[this.varType] && this.arraySize.length === 0){
            return typesDict[this.varType].call(parser,this.varName);
        }

        
        
        //e.g. sBase
        if(this.arraySize.length === 0){
            return parser.nest(this.varName,{type:otherStructs[this.varType].getParser(otherStructs)});
            
        }

        //handle array types here
        const baseParser = typesDict[this.varType] != undefined ?
             typesDict[this.varType].call(new Parser(),'') :
              otherStructs[this.varType].getParser(otherStructs);
        return this.getArrayParser(parser,this.arraySize,baseParser);
        
    };

    getArrayParser(parser,depths,elementParser){
        return parser.array(depths.length == this.arraySize ? this.varName : '',{
            type:depths.length === 1 ? elementParser: this.getArrayParser(new Parser(),depths.slice(1),elementParser),
            length:depths[0]
        });
    }
}

module.exports = exports = ParseableVariable;