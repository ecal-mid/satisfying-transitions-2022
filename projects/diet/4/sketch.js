// For compiled sketchs
let started = false
let progress = 0

let g;

let sceneSize
let centerX
let centerY
let objSize
let halfWidth

let states = {
    IDLE:1,
    FALL:2,
    OUT_OF_SCREEN:3,
    LAST_SLICE_BACK:4,
    TURNING:5,
    BACK_SLICE_APPEAR:6
}

let currState = states.IDLE

// Pizza
const slices = []
let colorPizza
let colorBorder
let backSlice
let easePosLastSlice
let easeRotateLS
let easeRotateLSValue
let easeBackLS
let easeTriangleScale

// Box
let easePosBox
let pizzaBox

// Sound

let eat = []
let slice = []

function preload() {
  eat.push(createAudio("assets/eat-1.mp3"));
  eat.push(createAudio("assets/eat-2.mp3"));
  eat.push(createAudio("assets/eat-3.mp3"));


  ring = createAudio("assets/ring.mp3");
  air = createAudio("assets/air.mp3");
  slice = createAudio("assets/pizzaSlice-3.mp3")
  move = createAudio("assets/movement-1.mp3")
  burp = createAudio("assets/burp.mp3")
}


function setup() {
  createCanvas(0, 0);
  g = createGraphics(0, 0);
  windowResized();

  angleMode(DEGREES)
  rectMode(CENTER) 

  colorPizza = color('rgb(232, 56, 56)')
  colorBorder = color('rgb(205, 144, 90)')

  sceneSize = min(width, height)
  centerX = width / 2
  centerY = height / 2
  objSize = sceneSize / 2
  halfWidth = objSize / tan(60)

  // Box setup
  pizzaBox = new Box();

  easePosBox = new Easing({
      duration: 1000,
      from: objSize/2,
      easing: EASINGS.easeInCubic
      
  })

  // console.log("la boîte est fermée");
  
  easePosBox.onEnd = function () {
     
      changeState(states.OUT_OF_SCREEN)
      // console.log("la boîte est out of screen");
      // setTimeout(() => {console.log("On enlève les parts");}, 1000);
  }

  // Pizza & metaball setup
  g.pixelDensity(0.5);
  g.stroke(0)

  updateLayers([window, g], (l) => {
    l.noStroke();
  });

  g.strokeCap(SQUARE)

  const nSlices = 6;
  const sliceWidth = 360 / nSlices

  for (let i = 0; i < nSlices; i++) {

    slices.push(new PizzaSlice({
      x: width / 2,
      y: height / 2,
      diameter: objSize/1.1,
      angle: i * sliceWidth,
      sliceWidth
    }))

  }

  easePosLastSlice = new Easing({
    duration: 1000,
    from: height,
    easing: EASINGS.easeInOutQuad
  })

  easeRotateLS = new Easing({
    duration: 1000,
    from: 1,
    easing: EASINGS.easeInOutQuad
  })

  easeBackLS = new Easing({
    duration: 1000,
    from: 0,
    easing: EASINGS.easeInOutQuad
  })

  easeTriangleScale = new Easing({
    duration: 500,
    from: 0,
    easing: EASINGS.easeInOutQuad
  })

  easePosLastSlice.onEnd = function () {
    // console.log("la dernière part est de retour");
   
    changeState(states.TURNING)
    setTimeout(() => {
      easeRotateLS.start({
        to: 0,
    })
    }, 200);
  }

  easeRotateLS.onEnd = function () {
    changeState(states.BACK_SLICE_APPEAR)
    backSlice = new BackSlice()
    easeBackLS.start({
      to: 1,
    })
    

  }

  easeBackLS.onEnd = function () {
    // console.log("la dernière part s'est retourné, elle commence à grandir");
    backSlice.easeCoord1X.start()
    backSlice.easeCoord2X.start()
    backSlice.easeCoord3X.start()
    backSlice.easeCoordTopY.start()
    backSlice.easeCoordBottomY.start()
  }

}

function windowResized() {
  updateLayers([window, g], (l) => {
    l.resizeCanvas(windowWidth, windowHeight);
  });
}

function changeState(newState){
  currState = newState
}

function draw() {
  background(255);
  g.clear()

  fill(0)
  
  switch(currState){
      case states.FALL:
  
          const easePosBoxValue = easePosBox.update(deltaTime)
          updatePosBox(easePosBoxValue)
          break;
      case states.OUT_OF_SCREEN:
          break;
      case states.LAST_SLICE_BACK:
          const easePosLastSliceValue = easePosLastSlice.update(deltaTime)
          updatePosLastSlice(easePosLastSliceValue)
          break;
      case states.TURNING:
        easeRotateLSValue = easeRotateLS.update(deltaTime)
        
          // drawBackLS(easeBackLSValue)
          break;
      case states.BACK_SLICE_APPEAR:
        easeTriangleScaleValue = easeTriangleScale.update(deltaTime)
        easeBackLSValue = easeBackLS.update(deltaTime)
        // updateTriangle(easeTriangleScaleValue)
        drawBackLS(easeBackLSValue)
          break;
  }
  if(currState!=states.IDLE){
    push()
    if(currState>=states.LAST_SLICE_BACK || currState>=states.TURNING){
      slices[1].x = 0
      translate(centerX, 0)
      scale(easeRotateLSValue, 1)
    }
    slices.forEach(slice => slice.draw())
    pop()


    // For compiled sketchs
    if (started)
		progress += deltaTime / 1000

    if (progress >= 1) {
      window.parent.postMessage("finished", "*")
      noLoop()
    }
  }

  drawingContext.filter = "url(#metaballs)";
  image(g, 0, 0)
  drawingContext.filter = "none";
  
  pizzaBox.draw(); 
  return;

}

function updateLayers(layers, callback) {
  layers.forEach((layer) => callback(layer));
}

function updatePosBox(easePosBoxValue) {
  air.volume(0.3)
  air.play()
  pizzaBox.posY = easePosBoxValue
}

function updatePosLastSlice(easePosLastSliceValue) {
  slices[1].y = easePosLastSliceValue
}

function drawBackLS(easeBackLSValue){
  push()
  translate(centerX, centerY)
  scale(easeBackLSValue, 1)
  backSlice.draw()
  pop()
}

let pizzaFellCount = 0
function pizzaFell() {
  pizzaFellCount++;

  if(pizzaFellCount >=slices.length) {
    // console.log('DONE');
    move.play()
    changeState(states.LAST_SLICE_BACK)
    easePosLastSlice.start({
      to: centerY - objSize/2,
    })
  }
}

function mousePressed() {
  if(currState == states.IDLE){
      move.play();
      pizzaBox.openBox();
     
  }
}
