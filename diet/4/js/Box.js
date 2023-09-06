class Box{
    constructor() {
        // Coords
        this.coord1 = {
            x: centerX-objSize/2,
            y: centerY-(objSize/4)/2
        }
        this.coord2 = {x : 0, y : 0}
        this.coord3 = {x : 0, y : 0}
        this.coord4 = {
            x: centerX+objSize/2,
            y: centerY-(objSize/4)/2
        } 
        this.posX = 0
        this.posY = 0
        this.angle = 0
        this.boxWidth
        this.boxOpened = false

        // Easings
        this.easeCoverBoxY = new Easing({
            duration: 1000,
            from: centerY-(objSize/4)/2,
            easing: EASINGS.easeInOutQuad
        })
        this.easeCoverBoxX1 = new Easing({
            duration: 1000,
            from: centerX - objSize/6,
            easing: EASINGS.easeInOutQuad
        })
        this.easeCoverBoxX2 = new Easing({
            duration: 1000,
            from: centerX + objSize/6,
            easing: EASINGS.easeInOutQuad
        })
        this.easeBoxPosY = new Easing({
            duration: 1000,
            from: 0,
            easing: EASINGS.easeInOutQuad
        })


        this.easeCoverBoxY.onEnd = function () {
            console.log("la boîte est ouverte");
            ring.volume(0.4)
            ring.play();
            changeState(states.FALL)
            setTimeout(() => {easePosBox.start({
                to: height*2,
            })}, 200);
            
        }
      }

      draw(){
        // Update easing
        this.easeYValue = this.easeCoverBoxY.update(deltaTime)
        this.easeX1Value = this.easeCoverBoxX1.update(deltaTime)
        this.easeX2Value = this.easeCoverBoxX2.update(deltaTime)
        this.easeBoxPosYValue = this.easeBoxPosY.update(deltaTime)
          
        // Update moving coord
        this.coord2 = {
            x: this.easeX1Value,
            y: this.easeYValue
        }
        this.coord3 = {
            x: this.easeX2Value,
            y: this.easeYValue
        }
        if(currState == states.IDLE){
            this.posY = this.easeBoxPosYValue

        }

        // Draw box
        push()
        strokeWeight(1)
        stroke(0)
        translate(this.posX, this.posY)
        // rotate(this.angle)
        // bottom
        rect(centerX, centerY, objSize, objSize/4)
        // cover
        quad(this.coord1.x, this.coord1.y, this.coord2.x, this.coord2.y, this.coord3.x, this.coord3.y, this.coord4.x, this.coord4.y)
        pop()

        // Calculate box width
        this.boxWidth = dist(this.coord1.x, this.coord1.y, this.coord4.x, this.coord4.y)
    }

      openBox(){
        this.coordYtarget =  (centerY - (objSize/4)/2) - this.boxWidth;
        this.coordX1target = centerX-objSize/2;
        this.coordX2target = centerX+objSize/2;

        this.easeCoverBoxY.start({
            to: this.coordYtarget,
        })
        this.easeCoverBoxX1.start({
            to: this.coordX1target,
        })
        this.easeCoverBoxX2.start({
            to: this.coordX2target,
        })
        this.easeBoxPosY.start({
            to: objSize/2,
        })
      }
}