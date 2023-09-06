'use strict';

let shapeId = 0

let sceneSize;
let centerY;
let objSize;

let originX;
let originY;
let posY;
let radius;
let minThickness;
let maxThickness;


let easeScale1, easeScale2, easeScale3, easeScale4, easePos, circleEase;
let grow = 0;
let move = false;

let clickCount = 0

let bounceSound;
let plopSound

function preload() {
    bounceSound = loadSound('./bounce-sound.wav');
    plopSound = loadSound('./plop-sound.wav');

}

function setup() {
    createCanvas(windowWidth, windowHeight);

    angleMode(DEGREES)

    const sceneSize = min(width, height)

    easeScale1 = new Easing({
        duration: 1000,
        from: 1,
        to: 0.833,
        easing: EASINGS.easeOutCubic
    })

    easeScale2 = new Easing({
        duration: 1000,
        from: 1,
        to: 0.833,
        easing: EASINGS.easeOutCubic
    })
    
    easeScale3 = new Easing({
        duration: 1000,
        from: 1,
        to: 0.73,
        easing: EASINGS.easeOutCubic
    })

    easeScale4 = new Easing({
        duration: 1000,
        from: 1,
        to: 0.99,
        easing: EASINGS.easeOutCubic
    })

    easePos = new Easing({
        duration: 1000,
        from: 0,
        //to: -200,
        easing: EASINGS.bounceOut
    })

    circleEase = new Easing({
        duration: 1000,
        from: 0,
        to:  height/2 - sceneSize/16,
        easing: EASINGS.bounceOut
    })

   
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}



function draw() {
   
    push()
    background(0);
    
    fill("#0037FF")
    noStroke()

    const sceneSize = min(width, height)

    const centerX = width / 2
    const centerY = height / 2
    const objSize = sceneSize / 2
    const halfWidth = objSize / tan(60) 
    
    posY = centerY;

    radius = sceneSize;
    let minThickness = objSize/4;
    let maxThickness = objSize/2;;

    const scale1 = easeScale1.update(deltaTime) 
    const scale2 = easeScale2.update(deltaTime) 
    const scale3 = easeScale3.update(deltaTime) 
    const scale4 = easeScale4.update(deltaTime) 
    const pos = easePos.update(deltaTime) 
    const circlepos = circleEase.update(deltaTime);

    //Burger
    let y = min(circlepos, centerY - minThickness)
    let h = min(maxThickness, centerY-y)
    let squeeze = 1-(h-minThickness)/(maxThickness-minThickness)
    let w = lerp(objSize, objSize, squeeze)
  
    
    
    translate(centerX, centerY*0.5 + pos)

    arc(0, 0, radius * scale1*scale2*scale3*scale4, radius * scale1*scale2*scale3*scale4, 0, 180)

    pop()
    
    push()
    if (scale3 == 0.73) {
        clear()
        fill("#0037FF")
        
        bottomBun(centerX-(objSize/2), circlepos,  w, h, lerp(w/2, 0, squeeze))
    }
    pop()

}

function bottomBun(x, y, w, h, roundness) {
    drawingContext.beginPath();
    drawingContext.roundRect(x, y, w, h, [0,0,roundness,roundness]);
    drawingContext.fill();
}


function mousePressed() {
    clickCount++;

    if (clickCount == 1) {
        easeScale1.start()
        bounceSound.play()
    } else if (clickCount == 2) {
        easeScale2.start()
        bounceSound.play()
    } else if (clickCount == 3) {
        easeScale3.start()
        bounceSound.play()
    }else if (clickCount == 4) {
        circleEase.start()
        plopSound.play()
        circleEase.onEnd = () => {
            window.parent.postMessage("finished", "*")
            noLoop()
        }
    }

    let to;
    move = !move;
    if (move) {
        to = -posY/2
    } else {
        to =  height/2.47
    }  
   
    easePos.start({
        to: to
    })


}


