"use strict";

// let shapeId = 0
let incr = 0;
let incr2 = 0;
let presse;

let started=false
let progress=0

let centerTriangle;
//let Imgup,Imgdown,Imgleft,Imgright

// function preload() {
//     Imgup = loadImage('assets/up.png');
//     Imgdown = loadImage('assets/down.png');
//     Imgleft = loadImage('assets/left.png');
//     Imgright = loadImage('assets/right.png');
//   }

let rectWidth, rectHeight;

const states = {
  IDLE: 0,
  DEZOOM: 1,
  SQUEEZE_1: 2,
  RECT: 3,
};
let currState = states.IDLE;

const pistons = {};

let endedPistons = 0;
let strokeThickness;
// const camZoom

const { SmoothDamper } = MatosebUtils.animation;

const camZoom = new SmoothDamper({
  value: 1,
  smoothness: 400,
});

let sceneSize, centerX, centerY, objSize, halfWidth;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);

  presse = loadSound("./assets/bras.mp3")

  centerTriangle = createVector();

  sceneSize = min(width, height);

  centerX = width / 2;
  centerY = height / 2;
  objSize = sceneSize / 2;
  halfWidth = objSize / tan(60);

  const offset = 200;
  const offsetX = centerX + offset;
  const offsetY = centerY + offset;
  // left

  pistons.left = new Piston({
    x: -offsetX,
    y: 0,
    angle: 90,
    reach: offsetX - objSize / 2,
  });

  // right
  pistons.right = new Piston({
    x: offsetX,
    y: 0,
    angle: -90,
    reach: offsetX - objSize / 2,
  });

  // top
  pistons.top = new Piston({
    x: 0,
    y: -offsetY,
    angle: 180,
    reach: offsetY - objSize / 8,
  });
  // bottom
  pistons.bottom = new Piston({
    x: 0,
    y: offsetY,
    angle: 0,
    reach: offsetY - objSize / 8,
  });
  // pistons.push(new Piston({ x: -width / 2, y: 0, angle: 90 }))
  // pistons.push(new Piston({ x: -width / 2, y: 0, angle: 90 }))
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  push();

  background(255);

  fill(0);
  noStroke();

  translate(centerX, centerY);
  scale(camZoom.update());

  strokeThickness = 5 / camZoom.value;

 

  // debug
  push();
  fill("red");

  // left
  const posLeft = pistons.left.getPos();
  // ellipse(posLeft.x, posLeft.y, 20)
  const posTop = pistons.top.getPos();
  // ellipse(posTop.x, posTop.y, 20)
  const posBottom = pistons.bottom.getPos();
  // ellipse(posBottom.x, posBottom.y, 20)
  const posRight = pistons.right.getPos();
  // ellipse(posRight.x, posRight.y, 20)

  const d = posRight.dist(createVector());

  // console.log(map(d, 0, halfWidth/2, 0, 1, true))
  // console.log(d - halfWidth);

  // rect(0, 0, objSize / 2)

  // console.log(t);

  // if (min(1, (d - objSize / 4) / (objSize / 4)) < 1) {
  //   ellipse(-200, 0, 100)
  // }

  pop();

  const bottomY = min(objSize / 2, posBottom.y);

  const p1 = createVector(0, max(-objSize / 2, posTop.y));
  const p2 = createVector(min(halfWidth, posRight.x), bottomY);
  const p3 = createVector(max(-halfWidth, posLeft.x), bottomY);

  const reachRight = pistons.right.x - pistons.right.reach;
  const reachLeft = pistons.left.x + pistons.left.reach;
  const reachTop = pistons.top.y + pistons.top.reach;
  const reachBottom = pistons.bottom.y - pistons.bottom.reach;

  const crushRight = map(posRight.x, reachRight, halfWidth, 1, 0, true);
  const crushTop = map(posTop.y, reachTop, -objSize / 2, 1, 0, true);
  const crushBottom = map(posBottom.y, objSize / 2, reachBottom, 1, 0, true);
  const crushLeft = map(posLeft.x, reachLeft, -halfWidth, 1, 0, true);

  // console.log(crushBottom);
  rectWidth = reachRight - reachLeft;
  rectHeight = reachBottom - reachTop;

  let p1Offset = (rectWidth / 2) * pow(crushTop, 3);
  let p2Offset = rectHeight * pow(crushRight, 2);
  let p3Offset = rectHeight * pow(crushLeft, 10);

  const p1Right = p1.copy();
  p1Right.x += p1Offset;
  const p1Left = p1.copy();
  p1Left.x -= p1Offset;

  const p2Top = p2.copy();
  p2Top.y -= p2Offset;
  const p3Top = p3.copy();
  p3Top.y -= p3Offset;

  if (currState === states.DEZOOM || currState === states.IDLE) {
    strokeWeight(pow(crushTop, 2) * 100);
    strokeJoin(ROUND);
    stroke(0);
    beginShape();
    vertex(p1Left.x, p1Left.y);
    // vertex(p1.x, p1.y)
    vertex(p1Right.x, p1Right.y);
    vertex(p2Top.x, p2Top.y);
    vertex(p2.x, p2.y);
    vertex(p3.x, p3.y);
    vertex(p3Top.x, p3Top.y);
    endShape(CLOSE);
  }

  centerTriangle.set((p1.x + p2.x + p3.x) / 3, (p1.y + p2.y + p3.y) / 3);

  // drawTrigo(p1)

  // fill('blue')
  // stroke('blue')
  // strokeJoin(ROUND);
  // // roundedTriangle(p1, p2, p3, 10)
  // fill('red')
  // ellipse(0, 0, 10)

  // ellipse(centerTriangle.x, centerTriangle.y, 10)

  // drawTrigo(p3)
  // triangle(
  //   p1.x,
  //   p1.y,
  //   p2.x,
  //   p2.y,
  //   p3.x,
  //   p3.y,

  // );

  if (currState === states.RECT) {
    rectMode(CENTER);
    noStroke();
    rect(0, 0, objSize, objSize / 4);

    if (1 - camZoom.value < 0.01) {
      started=true
      console.log("FINISHED!");
    }
    // rect(centerX, centerY, objSize, objSize / 4);
  }

  Object.values(pistons).forEach((piston) => piston.draw());

  pop();

  push();
  // fill(0, )

  pop();



  if (started)
  progress += deltaTime / 500

if (progress >= 1) {
  window.parent.postMessage("finished", "*")
  noLoop()
}
}

function mousePressed() {
  switch (currState) {
    case states.IDLE:
      presse.play()
      changeState(states.DEZOOM);
      startCrush();
      break;
    case states.DEZOOM:
      presse.play()
      // presse.playMode("untilDone")
      startCrush();
      break;
  }
}

function startCrush() {
  Object.values(pistons).forEach((piston) => {
    piston.crush();
  });
}

function mouseReleased() {
  switch (currState) {
    case states.DEZOOM:
      presse.stop()
      Object.values(pistons).forEach((piston) => {
        piston.release();
      });
      console.log(Object.values(pistons));
      break;
  }
}

// function drawTrigo(p1, action) {
//   const c = drawingContext
//   c.save()
//   // fill('red')
//   const p = p5.Vector.sub(centerTriangle, p1)
//   // console.log(p1.x, p1.y);
//   c.translate(p1.x, p1.y)
//   ellipse(0, 0, 10)

//   const angle = p.heading() - 90
//   c.rotate(radians(angle))
//   ellipse(0, 0, 10)
//   // const hyp = 50 / sin(angle + 90)
//   // action(0, abs(hyp))
//   c.restore()
// }

function getAngle(p0, c, p1) {
  var p0c = sqrt(pow(c.x - p0.x, 2) + pow(c.y - p0.y, 2)); // p0->c (b)
  var p1c = sqrt(pow(c.x - p1.x, 2) + pow(c.y - p1.y, 2)); // p1->c (a)
  var p0p1 = sqrt(pow(p1.x - p0.x, 2) + pow(p1.y - p0.y, 2)); // p0->p1 (c)
  return acos((p1c * p1c + p0c * p0c - p0p1 * p0p1) / (2 * p1c * p0c));
}

function drawTrigo(p1, _angle, thickness, action) {
  const c = drawingContext;
  c.save();
  // fill('red')
  // const p =
  // console.log(p1.x, p1.y);
  // ellipse(centerTriangle.x, centerTriangle.y, 10)
  translate(p1.x, p1.y);
  // ellipse(0, 0, 10)

  let v = p5.Vector.sub(centerTriangle, p1);
  const angle = v.heading() - 90;
  c.rotate(radians(angle));
  const hyp = thickness / sin(_angle);
  // ellipse(0, hyp, 30)
  action(0, hyp);
  c.restore();
}

function changeState(newState) {
  currState = newState;

  switch (currState) {
    case states.DEZOOM:
      camZoom.setTarget(0.8);
      break;
    case states.RECT:
      presse.stop()
      Object.values(pistons).forEach((piston) => {
        piston.release();
      });
      setTimeout(() => {
        camZoom.settings.smoothness = 1200;
        camZoom.setTarget(1);
      }, 2000);
      break;
  }
}

function pistonEnded() {
  endedPistons++;
  if (endedPistons === Object.values(pistons).length) {
    // console.log('ENDED');
    // setTimeout(() => {
    //   changeState(states.RECT);
    // }, 500);

    changeState(states.RECT);
  }
}
