"use strict";

let sceneSize, centerX, centerY, objSize, halfWidth;

let g;
let angle = 0;
let oldAngle = 0;
let minAngle = 0;
let maxAngle = 0;

let ponceuse, frut_frut;

let gX;
let gY;

let reach;
let currReach = 0;

let started=false
let progress=0

const states = {
  IDLE: 0,
  GRAB: 1,
  DONE: 2,
};
let currState;
let ease;

function preload() {
  frut_frut = loadSound("./panceuse.wav");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  angleMode(DEGREES);

  sceneSize = min(width, height);
  centerX = width / 2;
  centerY = height / 2;
  objSize = sceneSize / 2;
  halfWidth = objSize / tan(60);

  const mWidth = max(width, height);
  reach = mWidth / 8;
  reach = 0;
  g = createGraphics(mWidth, mWidth + reach * 2);
  g.fill(0);
  g.noStroke();
  g.angleMode(DEGREES);
  // g.background('red')

  gX = g.width / 2;
  gY = g.height / 2;

  g.push();
  g.translate(gX, gY);
  g.rect(-g.width / 2, 0, g.width, mWidth);
  g.pop();

  ease = new Easing({
    from: 0,
    to: 1,
    duration: 1000,
  });

  changeState(states.IDLE);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function changeState(newState) {
  currState = newState;

  switch (currState) {
    case states.IDLE:
      break;

    case states.GRAB:
      break;

    case states.DONE:
      ease.start();
      ease.onEnd = () => {
        console.log("done");
        window.parent.postMessage("finished", "*");
        started=true
      };
      break;
  }
}

function updateReach() {
  currReach = map(mouseY, 0, height / 2, 0, reach, true);
  currReach = reach;
}

function draw() {

  if (started)
  progress += deltaTime / 1000

const bg = sin(progress * PI)
background(0, 0, bg * 255)

if (progress >= 1) {
  window.parent.postMessage("finished", "*")
  noLoop()
}

  background(255);
  fill(0);
  noStroke();
  ease.update(deltaTime);

  // switch (shapeId) {
  //     case 0:
  //         rectMode(CORNER)
  //         rect(0, 0, width, height / 2)
  //         break;

  //     case 1:

  let centerG = -gY + centerY;

  let newAngle = atan2(mouseY - centerG, mouseX - centerX) - 90;
  let deltaAngle = newAngle - oldAngle;
  oldAngle = newAngle;
  cursor("default");

  switch (currState) {
    case states.IDLE:
      updateReach();
      const hover = mouseY < centerY;

      if (hover) cursor("grab");

      if (hover && mouseIsPressed) changeState(states.GRAB);

      break;

    case states.GRAB:
      cursor("grabbing");
      angle += deltaAngle;
      frut_frut.play();
      frut_frut.playMode("untilDone");
      frut_frut.setVolume(0.3);

      // currReach = lerp(currReach, reach, 0.01)

      updateReach();

      // console.log(minAngle < -90);

      if (!mouseIsPressed) {
        if (minAngle < -90 && maxAngle > 90 && abs(currReach - reach) < 1) {
          frut_frut.stop();

          changeState(states.DONE);
        } else {
          frut_frut.stop();
          changeState(states.IDLE);
        }
      }

      break;

    case states.DONE:
      break;
  }

  angle = constrain(angle, -120, 120);

  minAngle = min(angle, minAngle);
  maxAngle = max(angle, maxAngle);

  g.push();
  // g.arc(gX, gY, sceneSize, sceneSize, 0, 180)
  g.translate(gX, gY);
  g.rotate(-angle);
  g.erase();
  g.translate(0, -currReach);
  g.rect(-g.width / 2, g.height / 2, g.width, g.height);
  g.noErase();

  g.pop();

  push();
  stroke("black");
  const thick = 5;
  strokeWeight(thick);

  drawingContext.setLineDash([thick, thick * 1.5]);

  push();
  translate(0, height * pow(ease.value, 0.9));
  line(
    thick * sin(frameCount * 100),
    centerY - thick / 2,
    width,
    centerY - thick / 2
  );
  pop();

  pop();

  if (currState !== states.DONE) {
    push();
    translate(centerX, centerG + currReach);
    rotate(angle);
    imageMode(CENTER);
    image(g, 0, 0);
    pop();
  } else {
    const w = lerp(g.width, sceneSize, pow(ease.value, 4));
    const y = lerp(centerG, centerY * 0.5, ease.value);
    const a = lerp(angle, 0, ease.value);
    // console.log(ease.value);

    push();
    translate(centerX, y);
    rotate(a);
    arc(0, 0, w, w, 0, 180);
    pop();
  }
}
