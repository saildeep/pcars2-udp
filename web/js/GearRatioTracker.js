
class GearRatioTracker{
    constructor(){
        this.data = new Array(16).fill(0);
        this.numSamples = new Array(16).fill(0);
        
    }

    //updates the values and returns the current gear
    update(data){
        const gear = data.sGearNumGears & 0xF;
        
        if(data.sClutch > 0)
            return gear;

        if(gear == 0)
            return gear;
        
        if(data.sRpm< 1000 || data.sSpeed <5)
            return gear;

        const ratio = data.sRpm / data.sSpeed;
        const smoothingFactor = this.numSamples[gear] / (this.numSamples[gear] +1)
        this.data[gear] =  this.data[gear] *smoothingFactor + (1-smoothingFactor) * ratio;
        this.numSamples[gear] +=1
        return gear
    }

    rpmNext(currentGear,currentRpm){
        const currentRatio = this.data[currentGear];
        const nextRatio = this.data[(currentGear + 1) % this.data.length];
        if(nextRatio<=0 || currentRatio<=0)
            return 0;

        return currentRpm * nextRatio /currentRatio;
    }

    rpmPrevious(currentGear,currentRpm){
        const currentRatio = this.data[currentGear];
        const prevRatio = this.data[(currentGear - 1) % this.data.length];
        if(prevRatio<=0 || currentRatio <= 0)
            return 0;

        return currentRpm * prevRatio /currentRatio;
    }

    rpmTarget(currentGear,currentSpeed){
        const currentRatio = this.data[currentGear];
        return currentRatio * currentSpeed;
    }
    


}

module.exports = exports = GearRatioTracker;