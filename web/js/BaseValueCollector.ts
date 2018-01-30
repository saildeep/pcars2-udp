import { EventEmitter } from "events";


export default abstract class BaseValueCollector<State> extends EventEmitter{
    private readonly socket:any;
    private state:State;
    constructor(socket:any){
        super();
        this.socket = socket;
        this.socket.on('sTelemetryData_raw',this.updateTelemetry.bind(this));
        this.socket.on('sRaceData_raw',this.updateRaceData.bind(this));
        this.socket.on('statistics',this.updateTelemetry.bind(this));
    }

    reset():void{
        this.setState(this.defaultState());
    }

    abstract defaultState():State;
    updateTelemetry(telemetryData:any):void{}
    updateStatistics(statistics:any):void{}
    updateRaceData(raceData:any):void{}
    protected setState(state:State){
        this.state = state;
        this.emit('update',state);
    }

    getState():State{
        return this.state;
    }
}