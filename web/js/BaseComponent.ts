import { setInterval } from "timers";

export default abstract class BaseComponent{
    
    private _height:number;
    private _width:number;
    private div:any;
    protected svg:any;

    constructor(div:any){
      
        if(!div)
            throw new Error("No div given");


        
        this._height = 0;
        this._width = 0;
        this.div = div;
        this.updateSize()
        this.reset();
        setInterval(this.OnUpdate.bind(this),50);//TODO change
    }

    // is called in super constructor
    reset(){
        this.div.selectAll("*").remove();
        this.updateSize();
        this.svg = this.div.append('svg').attr('height',this.height()).attr('width',this.width()).attr('viewBox','0 0 100 100');
        
        this.OnReset();
    }

    abstract OnReset():void;
    abstract OnUpdate():void;

    updateSize(){
        this._height = this.div.node().getBoundingClientRect().height;
        this._width = this.div.node().getBoundingClientRect().width;
    }

    width():number{
        return this._width;
    }
    
    height():number{
        return this._height;
    }

    

}