import BaseComponent from './BaseComponent';
import CurrentGearCollector from './CurrentGearCollector';
export default class GearComponent extends BaseComponent{
    private gc:CurrentGearCollector;
    private gearText: any;
    private maxGearText:any;
    constructor(div:any,gc:CurrentGearCollector){
        super(div);
        this.gc = gc;
    }

    OnReset():void{
        this.gearText = this.svg
            .append('text')
            .attr('font-size',100)
            .attr('y','100%');
        
        this.maxGearText = this.svg
            .append('text')
            .attr('font-size',20)
            .attr('y','100%')
            .attr('x','100%')
            .attr('text-anchor','end');

          
    }

    OnUpdate():void{
        if(!this.gc.hasData())
            return;
        this.gearText.html(this.gc.getState().gear);
        this.maxGearText.html('/' +this.gc.getState().maxGear);
    }
}