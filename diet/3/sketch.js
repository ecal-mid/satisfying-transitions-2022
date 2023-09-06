// For compiled sketchs
let started = false
let progress = 0

const physics = new VerletPhysics();
physics.gravityY = 1000;

const dragManager = new DragManager();

let states = {
  IDLE: 0,
  DROPPED: 1,
  FLEX: 2,
  RIGID: 3,
  RESETPOS: 4,
  RECT: 5
};

let body;
let chain;
let chooseEase
let redValue = 50;
let substraction = 0;
let sausageLength = 3;
let sausageFlex;
let lastPosX, lastPosY, firstPosX, firstPosY;
let easeGrill, easeDrop, easeResetY, easeResetX1, easeResetX2, easeRectL, easeRectR, easeFire;;

let sceneSize
let resize = false;

let centerX
let centerY
let objSize

let currState = states.IDLE;


let lastBody, firstBody;


// FIRE 

let gif
let gif_loadImg
let gifX
let gifY

let fireSound
let grillSound
let moveSound
let cygalleSound

// FIRE

function preload() {
  gif = loadImage('assets/fire.gif');
  fireSound = createAudio('assets/gas.mp3')
  grillSound = createAudio('assets/grill.mp3')
  moveSound = createAudio('assets/movement-1.mp3')
  cygalleSound = createAudio('assets/cygalle.mp3')

}


function setup() {
  createCanvas(windowWidth, windowHeight);

  fireSound.volume(0.3)
  cygalleSound.volume(0.5)
  grillSound.volume(0.7)

  sceneSize = min(width, height)
  centerX = width / 2
  centerY = height / 2
  objSize = sceneSize / 2
  // CHAIN
  chain = physics.createChain({
    startPositionX: width / 2,
    startPositionY: (-2) * height,
    endPositionX: width / 2 + 100,
    endPositionY: (-1.5) * height,
    elementCount: sausageLength,
    linkOptions: {
      //mode: VerletMode.Pull,
      stiffness: 1,
    },
    bodyOptions: {
      drag: 1,
      radius: 10,
      radius: 50,
    },
  });



  for (const o of chain.bodies) {
    dragManager.createDragObject({
      target: o,
      onStartDrag: (o) => {
        o.isFixed = true;
      },
      onStopDrag: (o) => {
        o.isFixed = false;
      },
    });
  }

  easeGrill = new Easing({
    from: 0,
    duration: 500,
    Easing: EASINGS.easeInExpo,
  });

  easeFire = new Easing({

    duration: 1000,
    Easing: EASINGS.easeInExpo,
  });

  easeDrop = new Easing({
    from: height / 1.2,
    duration: 500,
    Easing: EASINGS.easeInExpo,
  });

  easeResetY = new Easing({
    from: height / 1.2,
    duration: 1000,
    Easing: EASINGS.easeInOutQuart,
  });

  easeResetX1 = new Easing({
    from: height / 1.2,
    duration: 1000,
    Easing: EASINGS.easeInOutQuart,
  });

  easeResetX2 = new Easing({
    from: height / 1.2,
    duration: 1000,
    Easing: EASINGS.easeInOutQuart,
  });

  easeRectL = new Easing({
    duration: 1000,
    Easing: EASINGS.easeInOutQuart,
  });

  easeRectR = new Easing({
    duration: 1000,
    Easing: EASINGS.easeInOutQuart,
  });


}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function changeState(newState) {
  currState = newState;
}

function draw() {
  //console.log(currState);
  // console.log(easeRectL.value, easeRectR.value);

  sausageFlex = chain.bodies.length - 1;
  let redToBlack = redValue - 0.2 * substraction;

  clear();
  strokeWeight(objSize / 4);
  strokeJoin(ROUND);
  colorMode(HSL);
  stroke(0, 100, redToBlack);


  switch (currState) {
    case states.IDLE:
      chooseEase = easeGrill.value
      drawGrill();
      break;
    case states.DROPPED:
      fire();
      easeFire.start({
        from: 0,
        to: 1,
        // from: height * 12,
        // to: ((height / 1.2) * 10) - 432
      })
      chooseEase = easeGrill.value
      drawGrill();
      cygalleSound.play()
      // drawButton();
      break;
    case states.FLEX:
      chooseEase = easeGrill.value
      drawChain();
      cygalleSound.play()
      fire();
      drawGrill();

      if (substraction == 130) {
        substraction++;
      }

      break;
    case states.RIGID:
      chooseEase = easeDrop.value
      hardSausage()
      fire();
      cygalleSound.play()
      drawGrill();
      if (substraction > 500) {
        changeState(states.RESETPOS)

      }
      if (substraction == 500) {
        easeDrop.start({ to: height * 1.5 });
        easeResetY.start({ to: centerY })
        easeResetX1.start({ from: firstPosX, to: centerX - objSize / 2 })
        easeResetX2.start({ from: lastPosX, to: centerX + objSize / 2 })
        resize = true
        cygalleSound.play()

      }
      break;
    case states.RESETPOS:
      chooseEase = easeDrop.value
      started = true
      grillSound.pause()
      fireSound.pause()
      cygalleSound.pause()

      drawGrill();
      fakeSausage();
      if (resize == true) {
        console.log("y");
        easeRectL.start({ from: 0, to: centerX - objSize / 2 })
        easeRectR.start({ from: width, to: centerX + objSize / 2 })
        resize = false
        moveSound.play()
        cygalleSound.pause()
      }
      break
    case states.RECT:
      break

  }

  easeGrill.update(deltaTime);
  easeDrop.update(deltaTime);
  easeResetY.update(deltaTime);
  easeResetX1.update(deltaTime);
  easeResetX2.update(deltaTime);
  easeRectL.update(deltaTime);
  easeRectR.update(deltaTime);
  easeFire.update(deltaTime);

  dragManager.update();
  physics.update();


  // For compiled sketchs
  if (started) {
    progress += deltaTime / 1000

  }

  if (progress >= 1) {
    window.parent.postMessage("finished", "*")
    noLoop()
  }
}

function drawSausage() {
  push();
  noFill();
  beginShape();
  firstBody = chain.bodies[0];
  vertex(firstBody.positionX, firstBody.positionY);

  // if (currState !== states.RIGID)
  for (const body of chain.bodies) {
    curveVertex(body.positionX, body.positionY);
  }
  lastBody = chain.bodies[chain.bodies.length - 1];
  vertex(lastBody.positionX, lastBody.positionY);
  endShape();
  pop();
}

function drawChain() {
  physics.bounds = {
    bottom: height / 1.2,
    // top : 0,
    right: width,
    left: 0,
  };

  drawSausage();

  if (
    chain.bodies[0].positionY > physics.bounds.bottom - 70 &&
    chain.bodies[sausageFlex].positionY > physics.bounds.bottom - 70

  ) {
    grillSound.volume(0.6)
    grillSound.play()
    substraction++;
  }

}

function drawGrill() {
  push();
  fill(0);
  noStroke();
  rect(0, chooseEase, width, height / 2);
  pop();

  if (easeGrill.value == height / 1.2) {
    changeState(states.FLEX);
  }

  if (substraction > 130) {
    changeState(states.RIGID)
  }
  if (chooseEase > height / 1.2) {
    changeState(states.RESETPOS)
  }
}

function mousePressed() {
  switch (currState) {
    case states.IDLE:
      changeState(states.DROPPED);
      easeGrill.start({ from: 0, to: height / 1.2 });
      break;
  }
}

function becomeRigid() {
  chain = physics.createChain({
    startPositionX: width / 2,
    startPositionY: -height,
    endPositionX: width / 2 + 100,
    endPositionY: -height / 2,
    elementCount: sausageLength,
    linkOptions: {
      //mode: VerletMode.Pull,
      stiffness: 1,
    },
    bodyOptions: {
      drag: 1,
      radius: 10,
      radius: 50,
    },
  });

  for (const o of chain.bodies) {
    dragManager.createDragObject({
      target: o,
      onStartDrag: (o) => {
        o.isFixed = true;
      },
      onStopDrag: (o) => {
        o.isFixed = false;
      },
    });
  }
}

function hardSausage() {
  lastPosX = lastBody.positionX;
  lastPosY = lastBody.positionY;
  firstPosX = firstBody.positionX;
  firstPosY = firstBody.positionY;
  const [body1, midBody, body2] = chain.bodies;

  const x = (body1.positionX + body2.positionX) / 2;
  const y = (body1.positionY + body2.positionY) / 2;

  midBody.positionX = x;
  midBody.positionY = y;

  drawSausage();
  drawChain();
}

function fakeSausage() {
  push()
  stroke("black")
  strokeWeight(objSize / 4);
  strokeJoin(ROUND);
  strokeCap(ROUND)
  line(easeResetX1.value, easeResetY.value, easeResetX2.value, easeResetY.value)
  pop()

  twoRect();
  // if(easeResetX1.value == centerX-objSize/2){
  // }
}

function twoRect() {
  push()
  //rectMode(CENTER)
  noStroke();
  fill("white")
  rect(0, 0, easeRectL.value, height)
  //rect(easeRectL.value,0,width/2, height)
  // rect(centerX+objSize/2,0,easeRectR.value,height)
  rect(easeRectR.value, 0, width / 2, height)
  pop()
}


function fire() {
  gifX = 300
  gifY = 0
  fireSound.play()

  // console.log()
  push()
  fill('red')

  const bodies = [...chain.bodies].sort((a, b) => a.positionX - b.positionX)


  const lowest = [...chain.bodies].sort((a, b) => a.positionY - b.positionY)[0]

  const left = bodies[0]
  const right = bodies[bodies.length - 1]



  pop()

  const nFlames = 10
  const wFlame = width / nFlames
  const rad = 20
  const groundLevel = height-chooseEase

  // console.log(easeFire.value);
  const yg = (lowest.positionY-groundLevel)/height
  const low = smoothstep(0, groundLevel/height, yg)

  for (let i = 0; i < nFlames; i++) {
    // if (i % 3 === 0) {
    push()
    // gif.setFrame((frameCount+i*5) % gif.gifProperties.numFrames)
    // const frame = gif.gifProperties.frames[0].image
    // drawingContext.putImageData(frame, 0,0)
    const posX = wFlame * i
    translate(posX, height - groundLevel)
    noStroke();
    fill("orange")


    const angle = millis() / 100 + i
    const radius = 20
    const x = wFlame / 2 + sin(angle) * radius
    const y = radius - wFlame + cos(angle) * radius

    const t = (posX + wFlame / 2) / width
    const l = left.positionX / width
    const r = right.positionX / width
    const m = 30 / width


    if (i % 2 == 0)
      drawingContext.globalCompositeOperation = 'destination-over'
    // const rad = lerp(l-1, l+m, t) * 10

    const amt = smoothstep(l - m, l + m, t) * (1 - smoothstep(r - m, r + m, t));

    triangle(0, 0, wFlame, 0, x, lerp(y, y * 2, amt*low) * easeFire.value)

    drawingContext.globalCompositeOperation = 'source-over'
    // image(frame,);
    pop()
  }
  // }
}

function smoothstep(min, max, value) {
  var x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
};