// For compiled sketchs
let started = false
let progress = 0

//sounds
let eat = [];

let centerX = 0;
let centerY = 0;

let sceneSize, objSize, halfWidth;
let img;
let pg;
let isdrawn = false;

let states = {
  IDLE: 0,
  EATING: 1,
  WAIT_FOR_LAST_NACHOS: 1.5,
  BOWL_MOVE: 2,
  ENDED: 3,
};

let easeCamera;
let zoomFactor = 0.8;
let averageMove;

let nachos = [];
let easeZoom, easePos;

let currState = states.IDLE;
const buffer = new Array(10);

function preload() {
  img = loadImage("Assets/guac.png");

  eat.push(createAudio("Assets/sounds/eat.mp3"));
  eat.push(createAudio("Assets/sounds/eat2.mp3"));
  eat.push(createAudio("Assets/sounds/eat3.mp3"));
  bowl = createAudio("Assets/sounds/bowl.wav");
  fall = createAudio("Assets/sounds/fall.mp3");
  move = createAudio("Assets/sounds/movement-1.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pg = createGraphics(windowWidth, windowHeight);
  angleMode(DEGREES);
  pg.imageMode(CENTER);

  sceneSize = min(width, height);
  objSize = sceneSize / 2;
  halfWidth = objSize / tan(60);
  centerX = width / 2;
  centerY = height * 2;

  averageMove = createVector();

  easeCamera = new Easing({
    from: 0,
    to: 1,
    duration: 1000,
  });
  easeZoom = new Easing({
    duration: 1000,
    from: 0.8,
  });
  easePos = new Easing({
    duration: 1000,
    from: centerY,
  });

  easePos.onEnd = () => {
    // console.log("PLATE");
  };

  // pg.push()
  pg.push();

  pg.imageMode(CENTER);
  pg.translate(pg.width / 2, pg.height / 2);

  pg.scale(((sceneSize - 10) / img.width) * zoomFactor);
  pg.noFill();
  pg.stroke(255);

  pg.image(img, 0, -img.height / 2, sceneSize * 2.3, sceneSize * 0.8);
  pg.pop();

  nachos.push(new Nachos());

  for (let i = 0; i < buffer.length; i++) {
    buffer[i] = { x: 0, y: 0 };
  }
  // pg.translate(pg.width/2, pg.height/2)
  // pg.scale(0.3)
  // pg.image(img, sceneSize, sceneSize + 110);
  // pg.pop()
}

function changeState(newState) {
  currState = newState;

  switch (currState) {
    case states.EATING:
      easePos.start({ to: height / 2 });

      setTimeout(() => {
        bowl.play();
        bowl.volume(0.1);
      }, 250);
      break;

    case states.BOWL_MOVE:
      // easeCamera.start({ to: 1 });
      easeZoom.start({ to: 1 });
      easePos.start({ to: height / 4 });

      move.play();
     //move.volume(0.5);

      easePos.onEnd = () => {
        // console.log("end");
        changeState(states.ENDED);
      };

      break;
  }
}

function draw() {
  background(255);
  fill(0);
  noStroke();

  switch (currState) {
    case states.IDLE:
      break;

    case states.EATING:
      checkEmpty();
      break;

    case states.BOWL_MOVE:
      break;

    case states.ENDED:
      started = true
      break;
  }

  easeCamera.update(deltaTime);
  easeZoom.update(deltaTime);
  easePos.update(deltaTime);

  showPlate();

  calcMouseSpeed();
  nachos.forEach((e) => e.draw());


  // For compiled sketchs
  if (started)
  progress += deltaTime / 1000

  if (progress >= 1) {
    window.parent.postMessage("finished", "*")
    noLoop()
  }
}

function calcMouseSpeed() {
  buffer.shift();
  buffer.push({ x: movedX, y: movedY });

  let totalX = 0;
  let totalY = 0;

  buffer.forEach(({ x, y }) => {
    totalX += x;
    totalY += y;
  });

  averageMove.x = totalX / buffer.length;
  averageMove.y = totalY / buffer.length;
}

function showPlate() {
  push();
  fill(0);
  translate(centerX, easePos.value);
  scale(easeZoom.value);
  updateSauce();
  arc(0, 0, sceneSize, sceneSize, 0, 180);
  pop();
}

function updateSauce() {
  push();
  translate(-pg.width / 2, -pg.height / 2);
  image(pg, 0, 0);

  const pworldMouse = screenToWorld(pmouseX, pmouseY);
  const worldMouse = screenToWorld(mouseX, mouseY);
  
  if (grabbedNachos) {
    pg.erase();
    pg.strokeWeight(100);
    pg.line(worldMouse.x, worldMouse.y, pworldMouse.x, pworldMouse.y);
    pg.noErase();
  }

  pop();
}

function nachosGrabbed() {
  if (currState === states.IDLE) changeState(states.EATING);
}

function checkEmpty() {
  pg.loadPixels();
  // console.log(pg.pixels);
  const { pixels } = pg; // destructuring
  // const pixels = pg.pixels;

  let count = 0;

  for (let i = 0; i < pixels.length; i += 4) {
    const alpha = pixels[i + 3];
    if (alpha > 0) count++;
  }
  // console.log(count);

  const isEmpty = count < 100;

  if (isEmpty) {
    changeState(states.WAIT_FOR_LAST_NACHOS);
  }
}

function mousePressed() {
  nachos.forEach((nacho) => nacho.pressed());
}

function mouseReleased() {
  nachos.forEach((nacho) => nacho.released());
  fall.volume(0.2);
  fall.play();
}

function nachosFell() {
  let randSound = random(eat);
  randSound.volume(1);
  randSound.play();

  switch (currState) {
    case states.WAIT_FOR_LAST_NACHOS:
      changeState(states.BOWL_MOVE);
      break;

    case states.EATING:
      const newNachos = new Nachos();
      nachos.push(newNachos);
      newNachos.appear();
      break;

    default:
  }
}
