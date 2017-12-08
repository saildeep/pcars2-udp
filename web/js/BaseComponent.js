class BaseComponent{
    constructor(socket,div){
        if(!socket)
            throw new Error("No socket given");

        if(!div)
            throw new Error("No div given");


        

        this.socket = socket;
        this._height = 0;
        this._width = 0;
        this.div = div;
        this.updateSize()
        this.reset();
    }

    // is called in super constructor
    reset(){
        this.div.selectAll("*").remove();
        this.updateSize();
        this.svg = this.div.append('svg').attr('height',this.height()).attr('width',this.width());
        
        this.OnReset();
    }

    OnReset(){}

    updateSize(){
        this._height = this.div.node().getBoundingClientRect().height;
        this._width = this.div.node().getBoundingClientRect().width;
    }

    width(){
        return this._width;
    }
    
    height(){
        return this._height;
    }

    

}

module.exports = exports = BaseComponent;