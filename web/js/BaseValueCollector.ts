import { EventEmitter } from "events";


export default abstract class BaseValueCollector<State> extends EventEmitter{
    private readonly socket:any;
    protected state:State;
    protected isSet:boolean = false;
    constructor(socket:any){
        super();
        this.reset();
        this.socket = socket;
        this.socket.on('sTelemetryData_raw',this.updateTelemetry.bind(this));
        this.socket.on('sRaceData_raw',this.updateRaceData.bind(this));
        this.socket.on('statistics',this.updateStatistics.bind(this));
    }

    reset():void{
       
        this.setState(this.defaultState());
        this.isSet = false;
    }

    abstract defaultState():State;
    updateTelemetry(telemetryData:any):void{}
    updateStatistics(statistics:any):void{}
    updateRaceData(raceData:any):void{}
    protected setState(state:State){
        this.state = state;
        this.emit('update',state);
        this.isSet = true;
    }

    getState():State{
        return this.state;
    }

    hasData():boolean{
        return this.isSet;
    }
}