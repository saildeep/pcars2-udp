import HistoricNumberCollector from "./HistoricNumberCollector";

export default class HistoricalRPMCollector extends HistoricNumberCollector{
    updateTelemetry(telemetry:any){
        this.add(telemetry.sRpm);
    }
}