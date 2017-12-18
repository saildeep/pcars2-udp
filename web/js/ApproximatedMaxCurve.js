import { AssertionError } from "assert";

class ApproximatedMaxCurve{
    constructor(interval,maxX){
        this.interval =  interval;
        this.weightMax = 0.2;
        this.weightMin = 0.001;
        this.maxY = 0;
        this.maxX = 0;
        this.data = [0];
        
        
    }

    c(x){
        if(isNaN(x)){
            throw new Error("Nan detected");
        }else{
            return x;
        }
    }

    update(x,y){
        if(isNaN(y) || !isFinite(y) || y<=0)
            return false;
        if(isNaN(x) || !isFinite(x) ||x<=0)
            return false;
        const index = this.getIndex(x);
        //fill up data array until it has sufficient lengt
        while(this.data.length<= index){
            const lastElement = this.data[this.data.length -1];
            this.data.push(0);
        }
        this.maxX = Math.max(this.maxX,x);
        if(y > this.data[index]){
            this.data[index] = this.c(this.data[index] * (1-this.weightMax) + y * this.weightMax);
            this.maxY = Math.max(this.maxY,this.data[index])
            return true;
        }else{
          //  this.data[index] = this.c(this.data[index] * this.weightMin + y * (1-this.weightMin));
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
        return this.c(this.maxY);
    }
    getMaxX(){
        return this.c(this.maxX);
    }

    getIntersected(numIntersections){
        const intersectionInterval = this.maxX / numIntersections;
        var out = new Array(numIntersections);
        for(var i = 0;i<numIntersections;i++){
            out[i] = this.c(this.getValue(intersectionInterval * i));
            
            
        }
        
        return out;
    }
}
module.exports = exports = ApproximatedMaxCurve;
