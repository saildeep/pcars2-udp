import HistoricNumberCollector from "./HistoricNumberCollector";

abstract class HistoricalTireDataCollector extends HistoricNumberCollector{
    protected tire:number;
    protected smoothingFactor:number;

    constructor(socket:any,secondsToKeep:number,maxFreq:number,tireIndex:number,exponentialSmoothingFactor:number = 0){
        super(socket,secondsToKeep,maxFreq)
        if(tireIndex<0){
            throw new Error("Invalid tire index");
        }
        if(tireIndex > 3){
            throw new Error("Invalid tire index");
        }
        if(exponentialSmoothingFactor<0 ||exponentialSmoothingFactor > 1){
            throw new Error("Smoothing factor has to be in range from 0 to 1");
        }
        this.tire = tireIndex;
        this.smoothingFactor =exponentialSmoothingFactor;
    }
    add(e:number){
        
        if(this.smoothingFactor>0){
           
            const newest = this.getNewest();
            if(newest){
                super.add(newest.e * this.smoothingFactor + (1- this.smoothingFactor) * e);
                return;
            }
        }
        super.add(e);
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

export class HistoricalDeltaTyreRPSCollector extends HistoricalTireDataCollector{
    updateTelemetry(telemetry:any){
        const tyreSum = telemetry.sTyreRPS.reduce((accumulator:number, currentValue:number) => accumulator + currentValue);
        const tyreAVG = tyreSum * 0.25;
        this.add( (-1 * tyreAVG) - (-1 *telemetry.sTyreRPS[this.tire]));
    }
}
export class HistoricalTyreYCollector extends HistoricalTireDataCollector{
    updateTelemetry(telemetry:any){
        this.add(100 * telemetry.sWheelLocalPositionY[this.tire]);
    }
}

export class HistoricalTyreTempCollector extends HistoricalTireDataCollector{
    constructor(socket:any,secondsToKeep:number,maxFreq:number,tireIndex:number){
        super(socket,secondsToKeep,maxFreq,tireIndex,0.75);
    }

    updateTelemetry(telemetry:any){
        const v = telemetry.sTyreTempCenter[this.tire];
        if(v > 0){
            this.add(v);
        }
    }
}

