import BaseComponent from "./BaseComponent";
import HistoricNumberCollector from "./HistoricNumberCollector";
import { TimedEntry } from "./HistoricalValueCollector";

export default class HistoricalNumberComponent extends BaseComponent{
    protected data:HistoricalNumberComponentConfig[];
   
    private upper :any;
    private lower: any;
    private dataContainer:any;
    private maxUnitDict:{[key:string]:number};
    private minUnitDict:{[key:string]:number};

    constructor(div:any,data:HistoricalNumberComponentConfig[]){
        super(div);
        if(!data)
            throw new Error('empty data');
        this.data = data;
        this.maxUnitDict = {};
        this.minUnitDict = {};
        data.forEach(function(a:HistoricalNumberComponentConfig,i:number){
            if(!(a.unit in this.maxUnitDict)){
                this.maxUnitDict[a.unit] = a.data.maxV;
            }
            if(!(a.unit in this.minUnitDict)){
                this.minUnitDict[a.unit] = a.data.minV;
            }
            this.minUnitDict[a.unit] = Math.min(this.minUnitDict[a.unit],a.data.minV);
            this.maxUnitDict[a.unit] = Math.max(this.maxUnitDict[a.unit],a.data.maxV);
        }.bind(this));
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

        this.minUnitDict[config.unit] = Math.min(this.minUnitDict[config.unit],config.data.minV);
        this.maxUnitDict[config.unit] = Math.max(this.maxUnitDict[config.unit],config.data.maxV);
        
        const minV :number = config.useZeroNorm? 0: this.minUnitDict[config.unit];
        const maxV :number = this.maxUnitDict[config.unit];
        const eps:number = 0.00001;
        
        return (v - minV) / Math.max(maxV - minV,eps);
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