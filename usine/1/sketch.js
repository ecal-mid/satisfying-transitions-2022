"use strict";

let circleDiameter;

let ease, easePos;
let pg, cv;

let started = false
let progress = 0

let razorNoise, success, chutte, bump, final;
let angle;
let move;

let centerX, centerY, sceneSize, objSize, halfWidth;
let circlePos, pcirclePos;

let pcollision;
let pCount;

const states = {
  START: 0,
  TRIM: 1,
  ROTATE: 2,
  TRANSLATE: 3,
  NEXT_TRANSITION: 4,
};

let currState = states.START;

const svg = {
  icon: null,
  anchor: 0,
  width: 0,
}

function preload() {
  svg.icon = loadStrings("./assets/saw.svg");
}

function setup() {

  // svg string to dom
  const parser = new DOMParser();
  const svgElem = parser.parseFromString(svg.icon.join('\n'), 'image/svg+xml').querySelector('svg');
  // set svg width
  svgElem.setAttribute('width', 100);
  svgElem.setAttribute('height', 100);
  document.body.appendChild(svgElem);
  const path = svgElem.querySelector('path')
  const bb = path.getBBox()
  svgElem.style.display = 'none'

  svg.width = bb.width;
  svg.anchor = bb.x + svg.width / 2;
  svg.icon = new Path2D(path.getAttribute('d'))

  razorNoise = loadSound("./assets/razor_sound.mp3");
  success = loadSound("./assets/success.wav");
  bump = loadSound("./assets/bump.wav");
  chutte = loadSound("./assets/chutte.wav");
  final = loadSound("./assets/triangleMove.wav");

  circlePos = createVector();
  pcirclePos = createVector();

  // pixelDensity(1);
  cv = createCanvas(windowWidth, windowHeight);
  pg = createGraphics(width, height);

  ease = new Easing({
    duration: 500,
    from: 0,
    to: 60,
    easing: EASINGS.easeInQuint,
  });

  easePos = new Easing({
    duration: 1000,
    from: 0,
    to: 200,
    easing: EASINGS.easeInOutCubic,
  });

  ease.onEnd = function () {
    console.log("ended!");
  };

  angle = 0;
  move = 0;

  //imageMode(CENTER);
  angleMode(DEGREES);

  noStroke();
  background(255);
  fill(0);
  calculateDims();
  pg.background(255);
  pg.fill(0);
  pg.angleMode(DEGREES);
  pg.arc(centerX, centerY * 0.5, sceneSize, sceneSize, 0, 180);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  pg.resizeCanvas(width, height);
}



function drawTriangle(x, y, layer = window) {
  const cX = centerX + x;
  const cY = centerY + y;
  layer.triangle(
    cX - halfWidth,
    cY - objSize / 2,
    cX + halfWidth,
    cY - objSize / 2,
    cX,
    cY + objSize / 2
  );
}

function calculateDims() {
  centerX = width / 2;
  centerY = height / 2;
  sceneSize = min(width, height);
  objSize = sceneSize / 2;
  halfWidth = objSize / tan(60);
  circleDiameter = objSize / 3.33;
}

let pHasTouched = false
function getCollision(mouse) {

  const edges = [];
  const points = [
    createVector(centerX - halfWidth, centerY - objSize / 2),
    createVector(centerX + halfWidth, centerY - objSize / 2),
    createVector(centerX, centerY + objSize / 2),
  ]

  points.forEach((vertex, index) => {
    const nextIndex = (index + 1) % points.length
    edges.push(new Edge(vertex, points[nextIndex]))
  });

  const collisions = edges.map((edge, index) => {
    return { index, ...edge.collide(mouse, circleDiameter / 2) }
  });
  const collider = collisions.sort((a, b) => a.distance - b.distance)[0]


  // beginShape()
  // stroke('red')
  // ellipse(collider.pos.x, collider.pos.y, circleDiameter);
  // points.forEach((v) => {
  //   vertex(v.x, v.y)
  // })
  // endShape(CLOSE)
  const nHasTouched = collider.distance < circleDiameter / 2

  const hasTouched = nHasTouched && !pHasTouched;

  pHasTouched = nHasTouched;

  return { position: collider.pos, hasTouched };
}

function draw() {
  push();

  background(255);
  calculateDims();

  pcirclePos.set(circlePos);
  const { position, hasTouched } = getCollision(createVector(mouseX, mouseY))
  circlePos.set(position)

  if (currState === states.START) {

    push();
    fill(0);
    arc(centerX, centerY * 0.5, sceneSize, sceneSize, 0, 180);
    pop();

  } else if (currState === states.TRIM) {

    fill(0);
    noStroke();
    image(pg, 0, 0);
    stroke(0);
    noStroke();
    drawTriangle(0, 0);
    drawTriangle(-0.5, 0);
    drawTriangle(0.5, 0);

    pg.push();
    pg.noStroke();
    pg.fill(255);
    drawTriangle(0, 0, pg);
    pg.pop();

    pg.loadPixels();

    const px = pg.pixels;
    let count = 0;

    const skip = 20;
    for (let i = 0; i < px.length; i += 4 * skip) {
      const value = px[i] + px[i + 1] + px[i + 2] + px[i + 3];
      if (value < 1000) count++;
    }

    if (pCount - count > 1 && pCount !== undefined) {
      razorNoise.setVolume(1, 0.1);
    } else {
      razorNoise.setVolume(0.2, 0.1);
    }

    pCount = count

    if (count <= 10 / skip) {
      changeState(states.ROTATE);
    }

    if (mouseIsPressed === true) {
      angle -= 10;

      pg.push();
      // pg.noStroke();
      pg.stroke(255);
      pg.strokeWeight(circleDiameter);
      pg.line(circlePos.x, circlePos.y, pcirclePos.x, pcirclePos.y);
      // pg.ellipse(mouseX, mouseY, );
      pg.pop();
      razorNoise.play();
      razorNoise.playMode("untilDone");
      // onOff = true;
    } else {
      razorNoise.stop();
    }

    noCursor();

    push()
    translate(circlePos.x, circlePos.y);
    rotate(angle)
    const scaleFactor = circleDiameter / svg.width
    scale(scaleFactor)
    strokeWeight(10 / scaleFactor);
    translate(-svg.anchor, -svg.anchor);
    drawingContext.stroke(svg.icon);
    drawingContext.fillStyle = 'white'
    drawingContext.fill(svg.icon);
    pop()



    if (hasTouched) {
      bump.play();
      bump.playMode("untilDone");
      console.log("bim");
    }

  } else if (currState === states.ROTATE) {
    cursor();

    const value = ease.update(deltaTime);
    const pos = easePos.update(deltaTime);
    // console.log(value);
    razorNoise.stop();
    bump.stop

    success.play();
    success.playMode("untilDone");

    push();
    translate(centerX - pos, centerY + objSize / 2);
    rotate(value);
    triangle(0 - halfWidth, 0 - objSize, 0 + halfWidth, 0 - objSize, 0, 0);
    pop();

    if (value >= 3) {
      success.stop();
    }
    if (value >= 10) {
      chutte.play();
      chutte.playMode("untilDone");
    }
    if (value >= 60) {
      chutte.stop();
    }
  }


  if (started)
    progress += deltaTime / 1000




  pop();

  if (progress >= 1) {
    window.parent.postMessage("finished", "*")
    noLoop()
  }

}

function mousePressed() {
  if (currState === states.START) changeState(states.TRIM);
}

function changeState(newState) {
  currState = newState;
  console.log(newState);

  circlePos.set(mouseX, mouseY);
  pcirclePos.set(mouseX, mouseY);

  switch (currState) {
    case states.START:
      break;
    case states.TRIM:
      break;
    case states.ROTATE:
      setTimeout(() => {
        ease.start({
          to: 60,
        });
      }, 1000);

      ease.onEnd = () => {
        setTimeout(() => {
          final.play();
          easePos.start({ to: halfWidth });
        }, 500);
      };
      easePos.onEnd = () => {
        started = true
        console.log(started)
      }

      break;
  }
}