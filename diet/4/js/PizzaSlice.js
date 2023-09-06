const sStates = {
    IDLE: 0,
    GRABBED: 1,
    FALL: 2,
    FELL: 3,
}

let sliceGrabbed

class PizzaSlice {
    constructor({ x, y, diameter, angle, sliceWidth }) {
        Object.assign(this, arguments[0])
        // console.log(this.x);

        this.changeState(sStates.IDLE)

        this.offsetGrab = createVector()
        this.angle2 = this.angle + this.sliceWidth
        this.blobs = []
        this.velocity = 0

        this.origX = this.x;
        this.origY = this.y;

        for (let i = 0; i < 16; i++) {
            const thickness = random(25, 50)
            const maxRadius = this.diameter / 2
            const side = round(random())
            const radius = random(maxRadius * 0.1, maxRadius - thickness / 2)
            this.blobs.push({ radius, thickness, side })
        }
    }

    changeState(newState) {
        this.state = newState

        switch (this.state) {
            case sStates.GRABBED:
                sliceGrabbed = this
                this.velocity = 0

                slice.volume(0.5);
                slice.play();
                break;

            case sStates.IDLE:
                sliceGrabbed = null
                break;
            case sStates.FALL:
                sliceGrabbed = null

                setTimeout(() => {
                    let randSound = random(eat);
                    randSound.play();
                }, 400);

                break;

        }
    }

    polar(angle, radius) {
        const x = this.x + cos(angle) * radius
        const y = this.y + sin(angle) * radius
        return createVector(x, y)
    }

    drawBlobs() {
        if (currState == states.OUT_OF_SCREEN || currState == states.FALL) {
            push()

            const ctx = g.drawingContext;

            g.stroke(colorPizza)

            this.blobs.forEach(blob => {

                ctx.beginPath()

                const sideWidth = this.angle + this.sliceWidth / 2
                const offset = this.sliceWidth / 2 * blob.side
                ctx.lineWidth = blob.thickness
                ctx.arc(this.x, this.y, blob.radius, radians(this.angle + offset), radians(sideWidth + offset))
                ctx.stroke()
            })

            pop()
        }
    }

    draw() {
        push()


        // arc(0, 0, this.diameter, this.diameter, this.angle, this.angle2)


        fill(colorPizza)
        this.arc(this.x, this.y, this.diameter / 2, (this.angle), (this.angle2))


        this.within = drawingContext.isPointInPath(mouseX * pixelDensity(), mouseY * pixelDensity());

        const c = drawingContext
        c.save()
        c.lineWidth = 20
        c.lineCap = 'butt'
        c.strokeStyle = colorBorder
        c.beginPath()
        c.arc(this.x, this.y, this.diameter / 2, radians(this.angle), radians(this.angle2))
        c.stroke()
        c.restore()

        this.drawBlobs()

        switch (this.state) {
            case sStates.IDLE:
                this.checkGrab()
                break;
            case sStates.GRABBED:

                const oldX = this.x
                const oldY = this.y
                const newX = mouseX + this.offsetGrab.x;
                const newY = mouseY + this.offsetGrab.y;

                let d = dist(this.x, this.y, this.origX, this.origY)
                let force = map(d, 0, this.diameter / 4, 0.0001, 1, true)

                this.x += (newX - oldX) * force
                this.y += (newY - oldY) * force

                if (!mouseIsPressed) {
                    this.changeState(sStates.FALL)
                }

                break;
            case sStates.FALL:
                this.checkGrab()
                this.velocity += 0.7
                this.y += this.velocity


                if (this.y > height * 2) {
                    this.changeState(sStates.FELL)

                    pizzaFell()
                }
        }

        pop()


    }

    checkGrab() {
        if (mouseIsPressed && this.within && !sliceGrabbed) {
            this.changeState(sStates.GRABBED)
            this.offsetGrab.x = this.x - mouseX
            this.offsetGrab.y = this.y - mouseY
        }
    }


    arc(x, y, radius, angleStart, angleEnd) {
        drawingContext.beginPath()
        drawingContext.arc(x, y, radius, radians(angleStart), radians(angleEnd))
        drawingContext.lineTo(x, y)
        drawingContext.fill()

        // console.log(within);
    }

    checkCollision() {
        ctx.rect(10, 10, 100, 100);
        ctx.fill();
        result.innerText = ctx.isPointInPath(30, 70);
    }

}