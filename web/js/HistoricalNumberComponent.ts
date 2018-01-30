import BaseComponent from "./BaseComponent";
import HistoricNumberCollector from "./HistoricNumberCollector";

export default class HistoricalNumberComponent extends BaseComponent{
    protected data:HistoricNumberCollector;
    protected config:HistoricalNumberComponentConfig;

    private upper :any;
    private lower: any;
    private dataContainer:any;

    constructor(div:any,data:HistoricNumberCollector,config:HistoricalNumberComponentConfig = new HistoricalNumberComponentConfig()){
        super(div);
        this.data = data;
        this.config = config;
    }

    OnReset():void{
        this.dataContainer = this.svg.append('g');
    }

    OnUpdate():void{
       
        if(!this.data.hasData())
            return;
        const dataSelection = this.dataContainer.selectAll('circle').data(this.data.getTimeNormalized());
        dataSelection.enter().append('circle');
        dataSelection.exit().remove();
        
        this.dataContainer.selectAll('circle')
            .attr('r',1)
            .attr('cx',function(d:any){return 100 *d.t})
            .attr('cy',function(d:any){return 90- 80 * this.norm(d.e)}.bind(this))
            .attr('fill',this.config.color);
    }

    private norm(v:number):number{
        const eps:number = 0.00001;
        if(this.config.useZeroNorm){
            return v / Math.max(this.data.maxV,eps);
        }
        return (v - this.data.minV) / Math.max(this.data.maxV - this.data.minV,eps);
    }
}
export class HistoricalNumberComponentConfig{
    public color:string;
    public unit:string;
    public useZeroNorm:boolean;
    constructor(color:string='aqua',unit:string='',useZeroNorm:boolean = true){
        this.color = color;
        this.unit = unit;
        this.useZeroNorm = useZeroNorm;
    }

}