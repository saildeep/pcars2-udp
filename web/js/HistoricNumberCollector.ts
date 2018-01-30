import HistoricalValueCollector from "./HistoricalValueCollector";

export default abstract class HistoricNumberCollector extends HistoricalValueCollector<number>{
    public minV:number = Number.MAX_VALUE;
    public maxV:number = Number.MIN_VALUE;

    add(e:number){
        super.add(e);
        this.minV = Math.min(this.minV,e);
        this.maxV = Math.max(this.maxV,e);
    }
    reset():void{
        super.reset();
        this.minV = Number.MAX_VALUE;
        this.maxV = Number.MIN_VALUE;
    }

   
}