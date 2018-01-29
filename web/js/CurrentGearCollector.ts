import BaseValueCollector from './BaseValueCollector';
class CurrentGearCollector extends BaseValueCollector<Number>{
    updateTelemetry(telemetryData:any):void{
        this.setState(telemetryData.sGearNumGears & 0xF)
    }
    updateStatistics(telemetryData:any):void{}
}