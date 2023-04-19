"use strict";

let springSound, tend;
let img, img2;

let started = false;
let progress = 0;

let rad = 50;
let rad2 = 27;

const states = {
  START: 4,
  IDLE: 0,
  STRETCHING: 1,
  LAUNCHED: 3,
  RELEASED: 2,
  GLOBAL: 5,
};
let sceneSize, centerX, centerY, objSize, halfWidth, thickness;

const springY = new Spring({
  position: 0, // start position
  frequency: 4.5, // oscillations per second (approximate)
  halfLife: 0.15, // time until amplitude is halved
});

const springX = new Spring({
  position: 0, // start position
  frequency: 4.5, // oscillations per second (approximate)
  halfLife: 0.15, // time until amplitude is halved
});

const sideY = new Spring({
  position: 0, // start position
  frequency: 4.5, // oscillations per second (approximate)
  halfLife: 0.15, // time until amplitude is halved
});
const sideX = new Spring({
  position: 0, // start position
  frequency: 4, // oscillations per second (approximate)
  halfLife: 0.25, // time until amplitude is halved
});

let pos;
let currState = states.START;
let smoothThickness;

function preload() {
  img = loadImage("./assets/pinceOpen.png");
  img2 = loadImage("./assets/pinceClosed.png");
}

function setup() {
  springSound = loadSound("./spring.mp3");

  tend = loadSound("./tend.mp3");

  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  pos = createVector();

  sceneSize = min(width, height);
  centerX = width / 2;
  centerY = height / 2;
  objSize = sceneSize / 2;
  halfWidth = objSize / tan(60);
  thickness = objSize / 4;
  smoothThickness = thickness;

  sideY.position = sideY.target = centerY;
  sideX.position = sideX.target = objSize / 2;
  springY.position = centerY;
  springX.position = centerX;
}

function changeState(newState) {
  currState = newState;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function collidingRect() {
  let collideX = false;
  let collideY = false;

  if (mouseX > centerX - objSize / 2 && mouseX < centerX + objSize / 2) {
    collideX = true;
  }

  if (mouseY > centerY - thickness / 2 && mouseY < centerY + thickness / 2) {
    collideY = true;
  }

  return collideY && collideX;
}

function draw() {
  if (started) progress += deltaTime / 500;

  const bg = sin(progress * PI);
  background(0, 0, bg * 255);

  if (progress >= 1) {
    window.parent.postMessage("finished", "*");
    noLoop();
  }
  push();
  background(255);

  // noFill()
  //   push()
  //   strokeCap(ROUND);
  //   stroke("black");
  //   strokeWeight(20)
  //   ellipse(mouseX, mouseY+rad, rad);
  //   pop()

  switch (currState) {
    case states.START:
      rectMode(CENTER);
      fill(0);
      rect(centerX, centerY, objSize, thickness);
      translate(centerX, centerY);
      if (mouseIsPressed) {
        changeState(states.IDLE);
      }
      break;
    case states.IDLE:
      springY.target = centerY;
      noCursor();

      push();
      strokeCap(ROUND);
      stroke("black");
      strokeWeight(20);
      line(
        width / 2,
        height,
        mouseX,
        mouseY + thickness / 2 + img.height / 2 + 5
      );
      pop();

      push();
      strokeCap(ROUND);
      stroke("white");
      strokeWeight(10);
      line(
        width / 2,
        height,
        mouseX,
        mouseY + thickness / 2 + img.height / 2 + 5
      );
      pop();

      if (!mouseIsPressed) {
        noFill();
        push();
        strokeCap(ROUND);
        stroke("black");
        strokeWeight(20);
        arc(mouseX, mouseY + thickness / 2, rad, rad, 0, 180);
        pop();

        push();
        strokeCap(ROUND);
        stroke("white");
        strokeWeight(10);
        arc(mouseX, mouseY + thickness / 2, rad, rad, 0, 180);
        pop();
      }

      if (mouseIsPressed) {
        //imageMode(CENTER);
        // image(img2, mouseX, mouseY+thickness/2);

        noFill();
        push();
        strokeCap(ROUND);
        stroke("black");
        strokeWeight(20);
        arc(mouseX, mouseY + thickness / 2, rad2, rad, 0 - 60, 180 + 60);
        pop();

        push();
        strokeCap(ROUND);
        stroke("white");
        strokeWeight(10);
        arc(mouseX, mouseY + thickness / 2, rad2, rad, 0 - 60, 180 + 60);
        pop();
      }

      if (mouseIsPressed && collidingRect()) {
        changeState(states.STRETCHING);
      }

      pos.set(centerX, springY.position);

      spring();
      break;
    case states.STRETCHING:
      noCursor();

      if (mouseIsPressed) {
        push();
        strokeCap(ROUND);
        stroke("black");
        strokeWeight(20);
        line(
          width / 2,
          height,
          mouseX,
          mouseY + thickness / 2 + img.height / 2
        );
        pop();

        push();
        strokeCap(ROUND);
        stroke("white");
        strokeWeight(10);
        line(
          width / 2,
          height,
          mouseX,
          mouseY + thickness / 2 + img.height / 2
        );
        pop();
        noFill();
        push();
        strokeCap(ROUND);
        stroke("black");
        strokeWeight(20);
        arc(mouseX, mouseY + thickness / 2, rad2, rad, 0 - 60, 180 + 60);
        pop();

        push();
        strokeCap(ROUND);
        stroke("white");
        strokeWeight(10);
        arc(mouseX, mouseY + thickness / 2, rad2, rad, 0 - 60, 180 + 60);
        pop();

        // imageMode(CENTER);
        //  image(img2, mouseX, mouseY+thickness/2);
      }

      pos.set(mouseX, mouseY);

      const d = dist(centerX, centerY, pos.x, pos.y);
      thickness = map(d, 10, height / 2, objSize / 4, objSize / 6, true);
      smoothThickness = thickness;

      springY.position = mouseY;

      if (!mouseIsPressed) {
        if (mouseY > centerY + height / 3) {
          springSound.play();
          changeState(states.RELEASED);

          thickness = height;
          springY.target = 0;
          sideY.target = 0;
          springX.position = pos.x;
          sideX.target = centerX * 2;
          springX.target = centerX - (pos.x - centerX);
        } else {
          changeState(states.IDLE);
        }
      }
      spring();
      tinyArm();

      break;
    case states.RELEASED:
      cursor(ARROW);
      //   console.log("RELEASED");
      pos.y = springY.position;
      pos.x = springX.position;

      if (abs(smoothThickness - thickness) < 2) {
        window.location.reload();
      }

      //   if(abs(smoothThickness - thickness) < 0.01) {
      //     console.log('STOPPED');
      //   }

      spring();
      tinyArm();
      changeState(states.LAUNCHED);

      break;

    case states.LAUNCHED:
      spring();
      pos.y = springY.position;
      pos.x = springX.position;
      if (mouseIsPressed) {
        started = true;
      }
      break;
  }

  return;
}

function tinyArm() {
  if (mouseIsPressed) {
    push();
    strokeCap(ROUND);
    stroke("black");
    strokeWeight(20);
    line(width / 2, height, mouseX, mouseY + thickness / 2 + img.height / 2);
    pop();
    push();
    strokeCap(ROUND);
    stroke("white");
    strokeWeight(10);
    line(width / 2, height, mouseX, mouseY + thickness / 2 + img.height / 2);
    pop();

    noFill();
    push();
    strokeCap(ROUND);
    stroke("black");
    strokeWeight(20);
    arc(mouseX, mouseY + thickness / 2, rad2, rad, 180 - 60 - 30, 180 + 60);
    pop();

    noFill();
    push();
    strokeCap(ROUND);
    stroke("white");
    strokeWeight(10);
    arc(mouseX, mouseY + thickness / 2, rad2, rad, 180 - 60 - 30, 180 + 60);
    pop();
  }
}

function spring() {
  springY.step(deltaTime / 1000);
  springX.step(deltaTime / 1000);
  sideY.step(deltaTime / 1000);
  sideX.step(deltaTime / 1000);

  fill(0);
  noStroke();
  rectMode(CENTER);
  //   rect(centerX, centerY, objSize, thickness);

  stroke("black");
  noFill();

  smoothThickness = lerp(smoothThickness, thickness, 0.05);
  strokeWeight(smoothThickness);

  strokeCap(SQUARE);
  strokeJoin(ROUND);

  beginShape();
  //   curveVertex(centerX - sideX.position, sideY.position);
  vertex(centerX - sideX.position, sideY.position);
  vertex(pos.x, pos.y);
  vertex(centerX + sideX.position, sideY.position);
  //   curveVertex(centerX + sideX.position, sideY.position);
  endShape();
  noStroke();
  pop();
}