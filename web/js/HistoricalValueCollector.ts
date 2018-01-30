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

    /**
     * Get all entries with the time normalized between 0 and 1, where 0 is the oldest entry
     */
    getTimeNormalized():TimedEntry<State>[]{
        if(!this.hasData())
            return null;
        const tmin:number = this.getState()[0].t;
        const tmax:number = this.getState()[this.getState().length -1].t;
        return this.getState().map(function(te:TimedEntry<State>){
            return new TimedEntry<State>(te.e, (te.t - tmin) / (0.0000001 + tmax - tmin));
        });
    }

    hasData():boolean{
        return this.getState().length > 2;
    }
}

class TimedEntry<Element>{
    public e:Element;
    public t:number;

    constructor(value:Element,t = Date.now()){
        this.e = value;
        this.t = t;
    }
}