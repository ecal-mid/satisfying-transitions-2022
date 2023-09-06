// For compiled sketchs
let started = false
let progress = 0

let sceneSize = 0;
let centerX = 0;
let centerY = 0;
let objSize = 0;
let halfWidth = 0;

let evoY = 0;

// SLICES
let shapes = [];
let stepHeight = 0;
let nStep = 10;
let strokeWght = 5;
let countSlice = 0;

// BURGER
// bottom
let w;
let bottomBurgerWidth;
let h = 0;
let y;
let minThickness;
let maxThickness;
let squeeze = 0;

// top
let topBurgerY = -100;
let topBurgerWidth
let topBurgerX
let widthFinalRect = 200
let heightFinalRect = 0

// EASINGS
let easeMarioToBottom
let easePos;
let easingsSlicesX = [];
let easingsSlicesY = [];
let slicePos;
let easeBottomBurger;

let states = {
  IDLE: 0,
  TRANSITION: 1,
  MOVING_DOWN: 2,
  COMPRESSED: 3,
  TOPPING: 4,
  FALL: 5,
  FINAL: 6
};

let currState = states.IDLE;

function preload() {
  move = createAudio("assets/movement-1.mp3");
  popi = createAudio("assets/fall.mp3");
  air = createAudio("assets/air.mp3");
  xylo = createAudio("assets/xylo.mp3")
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  angleMode(DEGREES);
  noStroke();

  stepHeight = height/nStep;
  easeMarioToBottom = new Easing({
    duration: 1500,
    from: centerY*0.5,
    easing: EASINGS.easeInOutCubic,
  });

  easeMarioToBottom.onEnd = function () {
    changeState(states.MOVING_DOWN)
  }

  // console.log(currState);

}

function changeState(newState) {
  currState = newState;
  // console.log(currState);

  switch (currState) {
    case states.TRANSITION:
      move.play()
      break;
    case states.FALL:
      xylo.play();
      break;
    case states.FINAL:
      started = true
      
    break;

  }
}

function draw() {
  sceneSize = min(width, height);

  centerX = width / 2;
  centerY = height / 2 + evoY;
  objSize = sceneSize / 2;
  halfWidth = objSize / tan(60);

  for (let i = 0; i < easingsSlicesY.length; i++) {
    shapes[i].easePosY = easingsSlicesY[i].update(deltaTime);
  }
  for (let i = 0; i < easingsSlicesX.length; i++) {
    shapes[i].easePosX = easingsSlicesX[i].update(deltaTime);
  }
  
  background(255);

  fill(0);
  switch (currState) {
    case states.IDLE:
      drawBurger();
      break;
    
    case states.TRANSITION:
      // move.play()
      const easeMarioToBottomValue = easeMarioToBottom.update(deltaTime);
      drawMarioToBottom(easeMarioToBottomValue);
      break;

    case states.MOVING_DOWN:
      updateBurger();
      drawBurger();
      updateSlices();
      drawSlices();
  
      break;

    case states.COMPRESSED:
      drawBurger();
      updateSlices();
      drawSlices();
      break;

    case states.TOPPING:
      drawBurger();
      updateSlices();
      drawSlices();
      updateTopBread();
      drawTopBread();
      
      
      break;

    case states.FALL:
      drawBurger();
      drawSlices();
      drawTopBread();
      wipeSlices();
      easeBottomBurger.update(deltaTime);
      break;

    case states.FINAL:
        finalUpdateBurger();
        drawBurger();
        drawTopBread();
        break;
  }

  if (shapes.length == nStep - 2) {
    nStep = 0
    changeState(states.TOPPING);
  }

  if (countSlice == 9) {
    countSlice = 0
    changeState(states.FALL);
  }

  // For compiled sketchs
  if (started){
    progress += deltaTime / 1000

  }

  if (progress >= 1) {
    window.parent.postMessage("finished", "*")
    noLoop()
  }

}

function mousePressed() {
  switch (currState) {
    case states.MOVING_DOWN:
        addAShape();
        break;
    case states.COMPRESSED:
        addAShape();
        break;
  }

    if(currState != states.IDLE && currState != states.TRANSITION){
      // Update la position y des slices
    if (countSlice < 4) {
      for (let i = 0; i < shapes.length; i++) {
        shapes[i].stopY = y - i * stepHeight + stepHeight / 2;
      }
    } else {
      for (let i = 0; i < shapes.length; i++) {
        shapes[i].stopY = y - i * stepHeight - stepHeight / 2;
      }
    }

      // Créé et démarre les easings de toutes les slices
    if (countSlice == 8) {
      for (let i = 0; i < shapes.length; i++) {
        let easeSliceY = new Easing({
          duration: 2000,
          from: shapes[i].stopY,
          easing: EASINGS.easeInOutCubic,
        });
        easingsSlicesY.push(easeSliceY);

        let easeSliceX = new Easing({
          duration: 500,
          from: shapes[i].x,
          easing: EASINGS.easeInOutCubic,
        });
        easingsSlicesX.push(easeSliceX);
      }
  
      for (let i = 0; i < shapes.length; i++) {
        easingsSlicesX[i].start({to: width/2});
        setTimeout(() => {
            easingsSlicesY[i].start({
                to: -width * 2,
              });
        }, 100 * i);
      }
  
      easeBottomBurger.start({
        to: h,
      });
    }
  
    if (squeeze >= 0.8 && countSlice == 4) {
      changeState(states.COMPRESSED);
    }
  
    countSlice++;
    evoY += stepHeight;
    }
    
    switch (currState) {
      case states.IDLE:
        changeState(states.TRANSITION)
        easeMarioToBottom.start({
          to: centerY*0.5,
        });
        break;
      // case states.TRANSITION:
      //   changeState(states.MOVING_DOWN)
      //   break;
    }
}

function addAShape() {
      
  popi.play();
  let rdnSizeIncr = random(-50, 50);
  let shape1 = {
    x: width/2 + rdnSizeIncr,
    y: 0,
    stopY: y,
    easePosY: 0,
    easePosX: 0,
    size: sceneSize + 7,
    shapeType: random([ "tomato", "cheese", "cheese", "salad", "salad", "steak"])
  };

  shapes.push(shape1);
}

function bottomBun(x, y, w, h, roundness) {
  drawingContext.beginPath();
  drawingContext.roundRect(x, y, w, h, [0, 0, roundness, roundness]);
  drawingContext.fill();
}

function updateBurger() {
  minThickness = 50;
  maxThickness = sceneSize / 2;

  y = min(centerY, height - minThickness);
  h = min(maxThickness, height - y);
  squeeze = 1 - (h - minThickness) / (maxThickness - minThickness);

  w = lerp(sceneSize, sceneSize + 10, squeeze);

  easeBottomBurger = new Easing({
    duration: 1500,
    from: y,
    easing: EASINGS.easeInOutCubic,
  });

  easeBottomBurger.onEnd = function () {
    changeState(states.FINAL)
  }
}

function drawBurger() {
  if(currState != states.FALL){
      bottomBurgerWidth = w;
  }

  if(currState == states.IDLE || currState == states.TRANSITION){
    push()
    fill('black')
    translate()
    arc(centerX, centerY * 0.5, sceneSize, sceneSize, 0, 180)
    pop()
  }else{
    push();
    translate(width / 2, easeBottomBurger.value);
    bottomBun(-w / 2, 0, bottomBurgerWidth, h, lerp(w / 2, 0, squeeze));
    pop();
  }

}

function drawMarioToBottom(ease) {
    push()
    // fill('red')
    translate(centerX, ease)
    arc(0, centerY * 0.5, sceneSize, sceneSize, 0, 180)
    pop()
}

function updateSlices() {
  for (let i = 0; i < shapes.length; i++) {
    if (shapes[i].y < shapes[i].stopY) {
      shapes[i].y += 10;
    }else{
      shapes[i].y = shapes[i].stopY
    }
  }
}

function wipeSlices() {
  for (let i = 0; i < shapes.length; i++) {
    const easeNormalized = map(shapes[i].easePosY, shapes[i].stopY, -width*2, 1, 0)
    shapes[i].size = sceneSize*easeNormalized;
    shapes[i].y = shapes[i].easePosY;
    shapes[i].x = shapes[i].easePosX;
  }
}

function drawSlices() {
  // SLICES
  for (let i = 0; i < shapes.length; i++) {
    switch (shapes[i].shapeType) {
      case "tomato":
        fill("rgb(214, 37, 51)");
        // strokeWeight(strokeWght);
        // stroke("white");
        rect(shapes[i].x, shapes[i].y, shapes[i].size, stepHeight);
        break;

      case "steak":
        fill("rgb(103, 50, 50)");
        // strokeWeight(strokeWght);
        // stroke("white");
        rect(shapes[i].x, shapes[i].y, shapes[i].size, stepHeight);
        break;

      case "cheese":
        fill("rgb(255, 202, 68)");
        // strokeWeight(strokeWght);
        // stroke("white");
        rect(shapes[i].x, shapes[i].y, shapes[i].size, stepHeight);
        break;

      case "salad":
        fill("rgb(95, 187, 93)");
        // strokeWeight(strokeWght);
        // stroke("white");
        rect(shapes[i].x, shapes[i].y, shapes[i].size, stepHeight);
        break;
    }
  }
}

function updateTopBread() {
    if(topBurgerY < 0){
        topBurgerY+= 3
    }else{
        topBurgerY = 0
    }
}

function drawTopBread() {
    if(currState != states.FINAL){
        topBurgerX = width / 2 - sceneSize / 1.98;
    }
    push()
    topBun(width / 2 - sceneSize / 1.98, topBurgerY, w, h, lerp(w / 2, 0, squeeze))
    pop()
}

function topBun(x, y, w, h, roundness) {

  drawingContext.beginPath();
  drawingContext.fillStyle = "black";
  drawingContext.roundRect(x, y, w, h, [roundness, roundness, 0, 0]);
  drawingContext.fill();
}

function finalUpdateBurger(){
    push()
    rectMode(CENTER)
    fill('black')
    noStroke()
    translate(width/2, heightFinalRect/2)
    rect(0, 0, widthFinalRect, heightFinalRect)
    pop()    
        // if(heightFinalRect < height/2){
        //     heightFinalRect+=5
        //     widthFinalRect = w
        // }
    
        // if(widthFinalRect < width && heightFinalRect > height/2){
        //     widthFinalRect+=20
        // }

        if(widthFinalRect < width){
            widthFinalRect+=25
            heightFinalRect = h*2
        }
        
        // console.log(widthFinalRect, " > ", width, heightFinalRect, " < ", height/2);

        if(heightFinalRect < height/2 && widthFinalRect >= width){
            heightFinalRect+=15
        }
}
