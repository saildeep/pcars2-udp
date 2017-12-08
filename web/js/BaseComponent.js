class BaseComponent{
    constructor(socket,div){
        this.socket = socket;
        this.div = div;
        this.reset();
    }

    // is called in super constructor
    reset(){
        this.div.selectAll("*").remove();
        this.OnReset();
    }

    OnReset(){}

    width(){
        return this.div.node().getBoundingClientRect().width;
    }
    
    height(){
        return this.div.node().getBoundingClientRect().height;
    }

    

}

module.exports = exports = BaseComponent;