class PacketCategoryStatistics{
    constructor(packetName){
        this.packetName = packetName;
        this.lastID = Number.MAX_SAFE_INTEGER;
        this.smoothSkipRatio = 0;
        //higher means smoother
        this.smoothingFactor = 0.95;
        this.lastTimeStamp = new Date().getTime();
        this.smoothInterval = 0;
    }

    push(idInCategory){
        const now = new Date().getTime();
        const interval = (now - this.lastTimeStamp);
        const numSkipped = Math.max(0,(idInCategory - this.lastID) -1);
        const skipRatio = numSkipped / (numSkipped + 1);
        this.smoothInterval = this.smoothingFactor * this.smoothInterval + interval * (1- this.smoothingFactor);
        this.smoothSkipRatio = this.smoothSkipRatio * this.smoothingFactor + skipRatio * (1-this.smoothingFactor);
        
        this.lastID = idInCategory;
        this.lastTimeStamp = now;
    }



}

module.exports = exports = PacketCategoryStatistics;