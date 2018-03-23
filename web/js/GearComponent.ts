import BaseComponent from './BaseComponent';
import CurrentGearCollector from './CurrentGearCollector';
import { CurrentBoostCollector } from './BaseValueCollectors';
export default class GearComponent extends BaseComponent{
    private gc:CurrentGearCollector;
    private bc:CurrentBoostCollector;
    private gearText: any;
    private maxGearText:any;
    private boostBG:any;
    constructor(div:any,gc:CurrentGearCollector,bc:CurrentBoostCollector){
        super(div);
        this.gc = gc;
        this.bc = bc;
    }

    OnReset():void{
        const size = Math.min(this.width(),this.height()) ;
        
        
        this.boostBG = this.svg
            .append('rect')
            .attr('y',0)
            .attr('x',0)
            .attr('fill','#EE09')
            .attr('height','100%')
            .attr('width','0');

        this.gearText = this.svg
            .append('text')
            .attr('font-size',size)
            .attr('y','100%');


        this.maxGearText = this.svg
            .append('text')
            .attr('font-size',size * 0.3)
            .attr('y','100%')
            .attr('x','100%')
            .attr('text-anchor','end');

        
          
    }

    OnUpdate():void{
        if(!this.gc.hasData())
            return;
        this.gearText.html(this.gc.getState().gear);
        this.boostBG.attr('width',this.bc.getState() * this.width());
        this.maxGearText.html('/' +this.gc.getState().maxGear);
        
    }
}