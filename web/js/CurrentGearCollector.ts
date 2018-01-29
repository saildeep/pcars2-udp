import BaseValueCollector from './BaseValueCollector';
export default class CurrentGearCollector extends BaseValueCollector<Number>{
    updateTelemetry(telemetryData:any):void{
        const v = telemetryData.sGearNumGears & 0xF;
        
        this.setState(v == 15 ? -1 : v);
    }
    updateStatistics(telemetryData:any):void{}
}