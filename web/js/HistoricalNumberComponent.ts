import BaseComponent from "./BaseComponent";
import HistoricNumberCollector from "./HistoricNumberCollector";
import { TimedEntry } from "./HistoricalValueCollector";

export default class HistoricalNumberComponent extends BaseComponent{
    protected data:HistoricalNumberComponentConfig[];
   
    private upper :any;
    private lower: any;
    private dataContainer:any;

    constructor(div:any,data:HistoricalNumberComponentConfig[]){
        super(div);
        if(!data)
            throw new Error('empty data');
        this.data = data;
    }

    OnReset():void{
       this.dataContainer = this.svg.append('g');
    }

    OnUpdate():void{
        const allDataSelection = this.bindData(this.dataContainer,this.data,'g');
        const subDataSelection = this.bindData(allDataSelection,function(d:HistoricalNumberComponentConfig){
            const timedData = d.data.getTimeNormalized();
            if(!timedData)
                return [];
            const p:string ="M " + (this.width() * 0.1) + " " + (this.height() *0.9) + " "  + timedData.map(function(td:TimedEntry<number>,i:number):string{
                const y = (0.9 -  0.8* (td.e - d.data.minV) / (d.data.maxV - d.data.minV + 0.00001)) * this.height();
                const x = (td.t * 0.8 + 0.1) * this.width();
                return ('L' + x.toString() + " " + y.toString() + " ");
            }.bind(this)).reduce(function(pre:string,next:string):string{return pre + next}) + "L" +(this.width() * 0.9) + " " + (this.height() * 0.9)+ " Z";
            return [{path:p,config:d}];
        }.bind(this),'path')
        subDataSelection
        .attr('d',function(d:any){return d.path})
        .attr('fill',function(d:any){return d.config.fill})
        .attr('stroke',function(d:any){return d.config.stroke})
        ;
        
    }

    private bindData(domElement:any,data:any,tag:string = 'g'):any{
        const dataSelection = domElement.selectAll(tag).data(data);
        dataSelection.enter().append(tag);
        dataSelection.exit().remove();
        return domElement.selectAll(tag);
    }

    private norm(v:number,config:HistoricalNumberComponentConfig):number{
        const eps:number = 0.00001;
        if(config.useZeroNorm){
            return v / Math.max(config.data.maxV,eps);
        }
        return (v - config.data.minV) / Math.max(config.data.maxV - config.data.minV,eps);
    }
   
}
export class HistoricalNumberComponentConfig{
    public fill:string;
    public stroke:string;
    public unit:string;
    public useZeroNorm:boolean;
    public data:HistoricNumberCollector;
    constructor(data:HistoricNumberCollector, fill:string='#0000',stroke:string='aqua',unit:string='',useZeroNorm:boolean = true){
        this.data = data;
        this.fill = fill;
        this.stroke = stroke;
        this.unit = unit;
        this.useZeroNorm = useZeroNorm;
    }

}