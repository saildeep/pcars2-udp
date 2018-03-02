import BaseComponent from "./BaseComponent";
import HistoricNumberCollector from "./HistoricNumberCollector";
import { TimedEntry } from "./HistoricalValueCollector";

export default class HistoricalNumberComponent extends BaseComponent{
    protected data:HistoricalNumberComponentConfig[];
   
    private upper :any;
    private lower: any;
    private dataContainer:any;
    private minLabelContainer:any;
    private maxLabelContainer:any;
    private nameLabelContainer:any;
    private currentLabelContainer:any;
    private maxUnitDict:{[key:string]:number};
    private minUnitDict:{[key:string]:number};

    constructor(div:any,data:HistoricalNumberComponentConfig[]){
        super(div);
        if(!data)
            throw new Error('empty data');
        this.data = data;
       
        
    }

    private buildMinMax():void{
        this.maxUnitDict = {};
        this.minUnitDict = {};
        this.data.forEach(function(a:HistoricalNumberComponentConfig,i:number){
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
       this.minLabelContainer = this.svg.append('g');
       this.maxLabelContainer = this.svg.append('g');
       this.nameLabelContainer = this.svg.append('g');
       this.currentLabelContainer = this.svg.append('g');
       this.minUnitDict = null;
       this.maxUnitDict = null;
    }

    OnUpdate():void{
        if(!this.minUnitDict){
            this.buildMinMax();
        }

        const allDataSelection = this.bindData(this.dataContainer,this.data,'g');
        const subDataSelection = this.bindData(allDataSelection,function(d:HistoricalNumberComponentConfig){
            const timedData = d.data.getTimeNormalized();
            if(!timedData)
                return [];
            const p:string ="M " + (this.width() * 0.1) + " " + (this.height() *0.9) + " "  + timedData.map(function(td:TimedEntry<number>,i:number):string{
                const y = (0.9 -  0.8* this.norm(td.e,d)) * this.height();
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

        const xstep = 1 / (this.data.length + 1);
        
        this.bindData(this.minLabelContainer,this.data,'text')
            .attr('x',function(d:HistoricalNumberComponentConfig,i:number){return i * xstep * this.width()}.bind(this))
            .attr('y',0.95 * this.height())
            .style('fill',function(d:HistoricalNumberComponentConfig,i:number){return d.stroke }.bind(this))
            .html(function(d:HistoricalNumberComponentConfig,i:number){return this.minUnitDict[d.unit].toFixed(1) + " " + d.unit}.bind(this));
            
            
        this.bindData(this.maxLabelContainer,this.data,'text')
            .attr('x',function(d:HistoricalNumberComponentConfig,i:number){return i * xstep * this.width()}.bind(this))
            .attr('y',0.03 * this.height())
            .style('fill',function(d:HistoricalNumberComponentConfig,i:number){return d.stroke }.bind(this))
            .html(function(d:HistoricalNumberComponentConfig,i:number){return  +this.maxUnitDict[d.unit].toFixed(1) + " " + d.unit}.bind(this));

        this.bindData(this.nameLabelContainer,this.data,'text')
            .attr('x',0.91 * this.width())
            .attr('height',xstep * this.height())
            .attr('y',function(d:HistoricalNumberComponentConfig,i:number){return (1+ i) * xstep * this.height()}.bind(this))
            .style('fill',function(d:HistoricalNumberComponentConfig,i:number){return d.stroke }.bind(this))
            .html(function(d:HistoricalNumberComponentConfig,i:number){return d.name}.bind(this));
       
        
        this.bindData(this.currentLabelContainer,this.data,'text')
            .attr('x',0.01 * this.width())
            .attr('y',function(d:HistoricalNumberComponentConfig,i:number){return (1+ i) * xstep * this.height()}.bind(this))
            .style('fill',function(d:HistoricalNumberComponentConfig,i:number){return d.stroke }.bind(this))
            .html(function(d:HistoricalNumberComponentConfig,i:number){
                if(d.data.getNewest()){
                    return d.data.getNewest().e.toFixed(1) + "" + d.unit;
                }
                return "";
            }.bind(this));

        
    }

    private bindData(domElement:any,data:any,tag:string = 'g'):any{
        const dataSelection = domElement.selectAll(tag).data(data);
        dataSelection.enter().append(tag);
        dataSelection.exit().remove();
        return domElement.selectAll(tag);
    }

    private norm(v:number,config:HistoricalNumberComponentConfig):number{

        this.minUnitDict[config.unit] = config.useZeroNorm? 0 : Math.min(this.minUnitDict[config.unit],config.data.minV);
        this.maxUnitDict[config.unit] = Math.max(this.maxUnitDict[config.unit],config.data.maxV);
        
        const minV :number = this.minUnitDict[config.unit];
        const maxV :number = this.maxUnitDict[config.unit];
        const eps:number = 0.00001;
        
        return Math.max( (v - minV) / Math.max(maxV - minV,eps),0);
    }
   
}
export class HistoricalNumberComponentConfig{
    public fill:string;
    public stroke:string;
    public unit:string;
    public useZeroNorm:boolean;
    public data:HistoricNumberCollector;
    public name:string
    constructor(data:HistoricNumberCollector,name:string, fill:string='#0000',stroke:string='aqua',unit:string='',useZeroNorm:boolean = true){
        this.data = data;
        this.name = name;
        this.fill = fill;
        this.stroke = stroke;
        this.unit = unit;
        this.useZeroNorm = useZeroNorm;
    }

}