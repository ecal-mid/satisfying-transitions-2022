'use strict';


let shapeId = 0

let sceneSize;;
let centerY;
let objSize;

let posY;
let radius;


let easePos, easePos2, easePos3, easePos4, easeXScale, easeXScale2, easeLeftRec, easeRightRec;
let move = false;

let clickCount = 0;
let clickTimeout = null; 

let sFactor = 1


let started = false
let progress = 0

let stackSound;
let scaleSound;
let swooshSound;

function preload() {
    stackSound = loadSound('./stack-sound2.wav');
    scaleSound = loadSound('./scale-sound1.mp3');
    swooshSound = loadSound('./swoosh-sound1.wav');
}

function setup() {
	createCanvas(windowWidth, windowHeight)

	angleMode(DEGREES)
    rectMode(CENTER)

    let sceneSize = min(width, height)
    const objSize = sceneSize / 2
    const centerX = width / 2
    const halfWidth = objSize / tan(60)
    let tWidth = (centerX+halfWidth) - (centerX-halfWidth)

    easePos = new Easing({
        duration: 1000,
        from: height / 2,
        to: (height / 2 + sceneSize / 4) - sceneSize / 16,
        easing: EASINGS.bounceOut
    })

    easePos2 = new Easing({
        duration: 1000,
        from: - sceneSize / 8,
        to: (height / 2 + sceneSize / 4) - sceneSize / 16- sceneSize / 8,
        easing: EASINGS.bounceOut
    })

    easePos3 = new Easing({
        duration: 1000,
        from: - sceneSize / 8,
        to: (height / 2 + sceneSize / 4) - sceneSize / 16 - (sceneSize / 8*2),
        easing: EASINGS.bounceOut
    })

    easePos4 = new Easing({
        duration: 1000,
        from: - sceneSize / 8,
        to: (height / 2 + sceneSize / 4) - sceneSize / 16 - (sceneSize / 8*3),
        easing: EASINGS.bounceOut
    })

    easeXScale = new Easing({
        duration: 1000,
        from: 0,
        to: ((objSize/4) * tan(30)) * 2,
        easing: EASINGS.bounceOut,
    })

    easeXScale2 = new Easing({
        duration: 1000,
        from: 0,
        to: tWidth - objSize,
        easing: EASINGS.bounceOut,
    })

    easeLeftRec = new Easing({
        duration: 1000,
        from: -350,
        to: -86.5,
        easing: EASINGS.easeOutCubic,
    })

    easeRightRec = new Easing({
        duration: 1000,
        from: 350,
        to: 86.5,
        easing: EASINGS.easeOutCubic,
    })

}

function draw() {

	background(0);
    fill("#0037FF")
    noStroke()

    const sceneSize = min(width, height)

    const centerX = width / 2
    const centerY = height / 2
    const objSize = sceneSize / 2
    const halfWidth = objSize / tan(60)

    posY = centerY;
    radius = objSize;

    const pos = easePos.update(deltaTime) 
    const posRect2 = easePos2.update(deltaTime) 
    const posRect3 = easePos3.update(deltaTime) 
    const posRect4 = easePos4.update(deltaTime) 
    const scaleX = easeXScale.update(deltaTime) 
    const scaleX2 = easeXScale2.update(deltaTime) 
    const shiftLeft = easeLeftRec.update(deltaTime) 
    const shiftRight = easeRightRec.update(deltaTime) 

    let tWidth = (centerX+halfWidth) - (centerX-halfWidth)
    let diff1 = tWidth - objSize;


    // 4 rectangles 
    rect(centerX, pos, radius + scaleX2, radius/4)
    rect(centerX, posRect2, radius + scaleX2 - scaleX, radius/4)
    rect(centerX, posRect3, radius + scaleX2 - 2*(scaleX), radius/4)
    rect(centerX, posRect4, radius + scaleX2 - 3*(scaleX), radius/4)
    
    // push lines 
    stroke(0)
    strokeWeight(150)
    strokeCap(PROJECT);
    line(centerX + shiftRight, centerY - radius / 2, centerX + halfWidth+shiftRight, centerY + radius / 2)
    line(centerX + shiftLeft, centerY - radius / 2, centerX - halfWidth + shiftLeft, centerY + radius / 2)


	const bg = sin(progress * PI)
	
}

function mousePressed() {
    
	clickCount++;

	if (clickCount == 1) {
		easePos.start()
        stackSound.play()
	} else if (clickCount == 2) {
		easePos2.start()
        stackSound.play()
	} else if (clickCount == 3) {
		easePos3.start()
        stackSound.play()
	}else if (clickCount == 4) {
		easePos4.start()
        stackSound.play()
	} else if (clickCount == 5) {
		easeXScale.start()
		easeXScale2.start()
        scaleSound.play()
	} else if (clickCount == 6) {
		easeLeftRec.start()
		easeRightRec.start()
        swooshSound.play()
        easeRightRec.onEnd = () => {
            window.parent.postMessage("finished", "*")
            noLoop()
        }
	}

}
