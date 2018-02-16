import HistoricNumberCollector from "./HistoricNumberCollector";

abstract class HistoricalTireDataCollector extends HistoricNumberCollector{
    protected tire:number;

    constructor(socket:any,secondsToKeep:number,maxFreq:number,tireIndex:number){
        super(socket,secondsToKeep,maxFreq)
        if(tireIndex<0){
            throw new Error("Invalid tire index");
        }
        if(tireIndex > 3){
            throw new Error("Invalid tire index");
        }
        this.tire = tireIndex;
    }
}

export class HistoricalRPMCollector extends HistoricNumberCollector{
    updateTelemetry(telemetry:any){
        this.add(telemetry.sRpm);
    }
}
export class HistoricalRPMByUnfilteredThrottleCollector extends HistoricNumberCollector{
    updateTelemetry(telemetry:any){
        this.add(telemetry.sRpm * telemetry.sUnfilteredThrottle /255);
    }
}
export class HistoricalRPMByfilteredThrottleCollector extends HistoricNumberCollector{
    updateTelemetry(telemetry:any){
        this.add(telemetry.sRpm * telemetry.sThrottle /255.0);
    }
}

export class HistoricalTorqueCollector extends HistoricNumberCollector{
    updateTelemetry(telemetry:any){
        this.add(telemetry.sEngineTorque);
    }
}
export class HistoricalPowerCollector extends HistoricNumberCollector{
    updateTelemetry(telemetry:any){
        this.add(telemetry.sEngineTorque *telemetry.sRpm /5252.0);
    }
}

export class HistoricalTyreRPSCollector extends HistoricalTireDataCollector{
    updateTelemetry(telemetry:any){
        this.add(-1 *telemetry.sTyreRPS[this.tire]);
    }
}
export class HistoricalTyreYCollector extends HistoricalTireDataCollector{
    updateTelemetry(telemetry:any){
        this.add(-100*telemetry.sWheelLocalPositionY[this.tire]);
    }
}

