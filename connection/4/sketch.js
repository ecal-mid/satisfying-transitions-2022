"use strict";

let shapeId = 0;

let circle1, circle2, circle3;
let radius = 30;

let easePos, easePosCirc1, easePosCirc2, easePosCirc3, easePosCirc4;
let hitSize, sceneSize, size, centerX, centerY, objSize, halfWidth;
let smoothSize = 0;

let slurpSound;
let whooshSound;

let grabbedCircle

function preload() {
  slurpSound = loadSound('./slurp-sound.mp3');
  whooshSound = loadSound('./whoosh-sound.wav');

}

let amt = 0

function setup() {
  createCanvas(windowWidth, windowHeight);

  angleMode(DEGREES);

  sceneSize = min(width, height);
  size = 30;
  centerX = width / 2;
  centerY = height / 2;
  objSize = sceneSize / 2;
  halfWidth = objSize / tan(60);

  easePos = new Easing({
    duration: 1000,
    from: height / 2,
    to: height / 2 + sceneSize / 4 - sceneSize / 16,
    easing: EASINGS.bounceOut,
  });

  easePosCirc1 = new Easing({
    duration: 500,
    from: 0,
    to: objSize / 2,
    easing: EASINGS.easeOutQuart,
  });

  easePosCirc2 = new Easing({
    duration: 500,
    from: centerX,
    to: centerX - objSize / 2,
    easing: EASINGS.easeOutQuart,
  });

  easePosCirc3 = new Easing({
    duration: 500,
    from: centerX,
    to: centerX + objSize / 2,
    easing: EASINGS.easeOutQuart,
  });
  easePosCirc4 = new Easing({
    duration: 500,
    from: 0,
    to: objSize / 2,
    easing: EASINGS.easeOutQuart,
  });

  circle1 = new Anchor(centerX, centerY - objSize / 2, radius);
  circle2 = new Anchor(centerX + halfWidth, centerY + objSize / 2, radius);
  circle3 = new Anchor(centerX - halfWidth, centerY + objSize / 2, radius);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mouseMoved() {
  if(grabbedCircle?.dragging) return
  grabbedCircle = [circle1, circle2, circle3].find((circle) => circle.collides())
}

function draw() {
  background(0);
  fill("#0037FF");
  noStroke();

  const pos = easePos.update(deltaTime);
  const posCirc1 = easePosCirc1.update(deltaTime);
  const posCirc2 = easePosCirc2.update(deltaTime);
  const posCirc3 = easePosCirc3.update(deltaTime);
  const posCirc4 = easePosCirc4.update(deltaTime);
  hitSize = size * 4;


  circle1.over();
  circle1.update();
  circle1.draw();
  circle2.over();
  circle2.update();
  circle2.draw();
  circle3.over();
  circle3.update();
  circle3.draw();

  push();
  fill("#0037FF");
  stroke("#0037FF");
  strokeJoin(ROUND);
  strokeCap(ROUND);
  smoothSize = lerp(smoothSize, size, amt);
  strokeWeight(smoothSize);
  beginShape();
  vertex(circle1.x, circle1.y);
  vertex(circle2.x, circle2.y);
  vertex(circle3.x, circle3.y);
  endShape(CLOSE);
  pop();


  fill("#0037FF");
  circle(posCirc2 - posCirc1, centerY, size);
  circle(posCirc2, centerY, size);
  circle(centerX, centerY, size);

  circle(posCirc3, centerY, size);
  circle(posCirc3 + posCirc4, centerY, size);

  if(grabbedCircle) {
    if(grabbedCircle.dragging) {
      cursor('grabbing')
    } else {
      cursor('grab')
    }
  } else {
    cursor('default')
  }

}

function mousePressed() {
  amt = 0.05
  circle1.pressed();
  circle2.pressed();
  circle3.pressed();
}

function mouseReleased() {
  circle1.released();
  circle2.released();
  circle3.released();

  grabbedCircle = null
}

let reachedCircles = 0;
function hasReached() {
  reachedCircles++;

  if (reachedCircles >= 3) {
    console.log("TRIANGLE DONE");
    easePosCirc2.start();
    whooshSound.play()
    easePosCirc3.start();
    easePosCirc2.onEnd = () => {
      easePosCirc1.start();
      whooshSound.play()
    };
    easePosCirc3.onEnd = () => {
      easePosCirc4.start();
    };
    easePosCirc4.onEnd = () => {
      window.parent.postMessage("finished", "*")
      noLoop()
    }
  }
}
