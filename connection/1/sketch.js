// "use strict";

let shapeId = 0;
const fruits = [];
const size = 30;
let stayFruit;
let cutFruit = 0;
let videos = {};
let sliceSound;

const states = {
  IDLE: 0,
  ZOOM: 1,
  END: 2,
};

let duration = 1000;
let t = 0;

let state = states.IDLE;

function preload() {

  sliceSound = loadSound('./slice1.mp3');


  fruits.push(new Fruit());
  fruits.push(new Fruit());
  fruits.push(new Fruit());
  fruits.push(new Fruit());
  fruits.push(new Fruit());

  stayFruit = random(fruits);
  stayFruit.halfCut = true;

  Object.values(fruits).forEach((fruit) => fruit.loadVideo());

}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  angleMode(DEGREES);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mouseClicked() { }

function draw() {
  background(0);
  fill("#0037FF");
  noStroke();

  const sceneSize = min(width, height);

  const centerX = width / 2;
  const centerY = height / 2;
  const objSize = sceneSize / 2;
  const halfWidth = objSize / tan(60);

  if (state === states.ZOOM) {
    let easedT = easeInOutQuad(min(1, t / duration));

    let currSize = lerp(size, sceneSize, easedT);
    let currX = lerp(stayFruit.x, centerX, easedT);
    let currY = lerp(stayFruit.y, centerY * 0.5, easedT);

    if (easedT === 1) {
      state = states.END;
    }

    t += deltaTime;
    arc(currX, currY, currSize, currSize, 0, 180);
  } else if (state === states.IDLE) {
    fruits[0].draw(centerX - objSize, centerY, size);
    fruits[1].draw(centerX - objSize / 2, centerY, size);
    fruits[2].draw(centerX, centerY, size);
    fruits[3].draw(centerX + objSize / 2, centerY, size);
    fruits[4].draw(centerX + objSize, centerY, size);
  } else if (state === states.END) {
    arc(centerX, centerY * 0.5, sceneSize, sceneSize, 0, 180);
    console.log('END');
    window.parent.postMessage("finished", "*")
    noLoop()
  }
}

function fruitCut() {
  cutFruit++;
  if (cutFruit === fruits.length) {
    state = states.ZOOM;

  }
}

function easeInOutQuad(pos) {
  if ((pos /= 0.5) < 1) return 0.5 * Math.pow(pos, 2);
  return -0.5 * ((pos -= 2) * pos - 2);
}
