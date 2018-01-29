import BaseComponent from './BaseComponent';
import CurrentGearCollector from './CurrentGearCollector';
export default class GearComponent extends BaseComponent{
    private gc:CurrentGearCollector;
    private text: any;
    constructor(div:any,gc:CurrentGearCollector){
        super(div);
        this.gc = gc;
    }

    OnReset():void{
        this.text = this.svg.append('text');
        const size = Math.min(this.width(),this.height() / 2) * 0.8;
        this.text
            .attr('font-size',size)
            .attr('y','100%');
          
    }

    OnUpdate():void{
        this.text.html(this.gc.getState());
    }
}