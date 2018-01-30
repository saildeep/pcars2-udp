import BaseValueCollector from './BaseValueCollector';
export default class CurrentGearCollector extends BaseValueCollector<GearAndMaxGear>{


    defaultState():GearAndMaxGear{
        return new GearAndMaxGear(0,1);
    }

    updateTelemetry(telemetryData:any):void{

        const v:number = telemetryData.sGearNumGears & 0xF;
        const vn:number = v == 15 ? -1 : v;
        const vmax:number = ( telemetryData.sGearNumGears & 0xF0)>>4 ;
        if(vmax == 0){
            debugger;
        }
        this.setState(new GearAndMaxGear(vn,vmax));
    }
    updateStatistics(telemetryData:any):void{}
}

class GearAndMaxGear{
    readonly gear:number;
    readonly maxGear:number;
    constructor(g:number,mg:number){
        this.gear = g;
        this.maxGear = mg;
    }
}