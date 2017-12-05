
const Parser = require('binary-parser').Parser;

const typesDict={

'signed char': (parser,name) => {return parser.int8(name)},
'unsigned char': (parser,name) => {return parser.uint8(name)},
'char': (parser,name) => {return parser.int8(name)},

'signed short': (parser,name) => {return parser.int16le(name)},
'unsigned short': (parser,name) => {return parser.uint16le(name)},

'signed int': (parser,name) => {return parser.int32le(name)},
'unsigned int': (parser,name) => {return parser.uint32le(name)},

'float': (parser,name) => {return parser.floatle(name)},

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

        if(this.varType === 'char' && this.arraySize.length == 2){
            return parser.array(this.varName
                ,{
                    type:new Parser().string('',{encoding:'utf8',length:this.arraySize[1]}),
                    length:this.arraySize[0]
                });
        }

        //e.g. unsigned int
        if(typesDict[this.varType] && this.arraySize.length === 0){
            return typesDict[this.varType].call(null,parser,this.varName);
        }

        if(typesDict[this.varType] && this.arraySize.length === 1){
            return parser.array(this.varName,{
                type:typesDict[this.varType](new Parser().endianess('little'),''),
                length:this.arraySize[0]
            });
        }
        
        
        //e.g. sBase
        if(this.arraySize.length === 0){
            return parser.nest(this.varName,{type:otherStructs[this.varType].getParser(otherStructs,true)});
        }

        if(this.arraySize.length === 1){
            return parser.array(this.varName,
                {
                    type:otherStructs[this.varType].getParser(otherStructs,true),
                    length:this.arraySize[0]
                });
        }




        throw new Error("Variable could not be parsed");
        
    };

}

module.exports = exports = ParseableVariable;