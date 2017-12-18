import { AssertionError } from "assert";

class ApproximatedMaxCurve{
    constructor(interval,maxX){
        this.interval =  interval;
        this.weightMax = 0.5;
        this.weightMin = 0.001;
        this.maxY = 0;
        this.maxX = 0;
        this.data = [0];
        
        
    }

    update(x,y){
        if(y<0)
            return;
        if(x<0)
            return;
        const index = this.getIndex(x);
        //fill up data array until it has sufficient lengt
        while(this.data.length<= index){
            const lastElement = this.data[this.data.length -1];
            this.data.push(0);
        }
        this.maxX = Math.max(this.maxX,x);
        if(y > this.data[index]){
            this.data[index] = this.data[index] * (1-this.weightMax) + y * this.weightMax;
            this.maxY = Math.max(this.maxY,this.data[index])
            return true;
        }else{
            this.data[index] = this.data[index] * this.weightMin + y * (1-this.weightMin);
            return false;
        }

    }

    getIndex(x){
        return Math.floor(x/this.interval);
    }

    getValue(x){
        const index = this.getIndex(x);
        if(index >= this.data.length){
            return 0;
        }
        if(index == (this.data.length -1)){
            return this.data[index];
        }
        const nextIndex = index +1;
        const weight =  (x % this.interval) /this.interval;
        return this.data[index] * (1-weight) + this.data[nextIndex] * weight;
    }
    getMax(){
        return this.maxY;
    }
    getMaxX(){
        return this.maxX;
    }

    getIntersected(numIntersections){
        const intersectionInterval = this.maxX / numIntersections;
        var out = new Array(numIntersections);
        for(var i = 0;i<numIntersections;i++){
            out[i] = this.getValue(intersectionInterval * i);
            if(isNaN(out[i])){
                console.error("Returning NAN:",intersectionInterval,i,this.data);
            }
            
        }

        
        return out;
    }
}
module.exports = exports = ApproximatedMaxCurve;
