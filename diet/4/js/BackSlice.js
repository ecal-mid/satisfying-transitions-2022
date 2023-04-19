class BackSlice{
    constructor() {
        // Coords
        this.coord1 = {x: 0, y: 0 - objSize / 2}
        this.coord2 = {x : 0 + halfWidth/2, y : 0}
        this.coord3 = {x : 0 - halfWidth/2, y : 0}
        this.posX = this.coord1.x
        this.posY = this.coord1.y

        this.easeCoord1X = new Easing({
            duration: 1000,
            from: this.coord1.x,
            to: 0,
            easing: EASINGS.easeInOutQuad
        })
        this.easeCoord2X = new Easing({
            duration: 1000,
            from: this.coord2.x,
            to: 0 + halfWidth,
            easing: EASINGS.easeInOutQuad
        })
        this.easeCoord3X = new Easing({
            duration: 1000,
            from: this.coord3.x,
            to: 0 - halfWidth,
            easing: EASINGS.easeInOutQuad
        })
        this.easeCoordTopY = new Easing({
            duration: 1000,
            from: this.coord1.y,
            to: 0 - objSize / 2,
            easing: EASINGS.easeInOutQuad
        })
        this.easeCoordBottomY = new Easing({
            duration: 1000,
            from: this.coord2.y,
            to: 0 + objSize / 2,
            easing: EASINGS.easeInOutQuad
        })

        this.easeCoordBottomY.onEnd = function () {
            console.log("transition DONE");
            // burp.play(); // degueulasse
            started = true
        
          }
    }


      draw(){
       this.easeCoord1X.update(deltaTime)       
       this.easeCoord2X.update(deltaTime)
       this.easeCoord3X.update(deltaTime)
       this.easeCoordTopY.update(deltaTime)
       this.easeCoordBottomY.update(deltaTime)

        triangle(this.easeCoord1X.value, this.easeCoordTopY.value, this.easeCoord2X.value, this.easeCoordBottomY.value, this.easeCoord3X.value, this.easeCoordBottomY.value)
    }

}