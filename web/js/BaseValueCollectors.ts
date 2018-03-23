import BaseValueCollector from './BaseValueCollector';
export class CurrentBoostCollector extends BaseValueCollector<number>{
    defaultState():number{
        return 0;
    }
    updateTelemetry(telemetryData:any):void{
        this.setState(telemetryData.sBoostAmount / 100);
    }
}