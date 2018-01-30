import BaseValueCollector from "./BaseValueCollector";
import { stat } from "fs";

export default abstract class HistoricalValueCollector<State> extends BaseValueCollector<TimedEntry<State>[]>{
    protected keepMs:number;

    constructor(socket:any,secondsToKeep:number = 60){
        super(socket);
        this.keepMs = secondsToKeep * 1000;
    }
    defaultState():TimedEntry<State>[]{
        return [];
    }

    protected add(e:State):void{
        this.removeObsolete();
        const state = this.getState();
        state.push(new TimedEntry<State>(e));
        this.setState(state);
    }
    

    private removeObsolete():void{
        const now = Date.now();
        const state = this.getState();
        if(state.length == 0)
            return;
        if(state[0].t < now - this.keepMs){
            state.shift();
            this.setState(state);
        }
        
    }
}

class TimedEntry<Element>{
    public e:Element;
    public t:number;

    constructor(value:Element){
        this.e = value;
        this.t = Date.now();
    }
}