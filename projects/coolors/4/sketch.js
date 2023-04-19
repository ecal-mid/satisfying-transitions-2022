const path = [
  { x: 3, y: 3 },
  { x: 7, y: 3 },
  { x: 7, y: 2 },
  { x: 9, y: 2 },
  { x: 9, y: 0 },
  { x: 8, y: 0 },
  { x: 8, y: 1 },
  { x: 7, y: 1 },
  { x: 7, y: 0 },
  { x: 6, y: 0 },
  { x: 6, y: 2 },
  { x: 5, y: 2 },
  { x: 5, y: 0 },
  { x: 4, y: 0 },
  { x: 4, y: 2 },
  { x: 3, y: 2 },
  { x: 3, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 1 },
  { x: 2, y: 1 },
  { x: 2, y: 2 },
  { x: 0, y: 2 },
  { x: 0, y: 6 },
  { x: 1, y: 6 },
  { x: 1, y: 5 },
  { x: 2, y: 5 },
  { x: 2, y: 6 },
  { x: 3, y: 6 },
  { x: 3, y: 5 },
  { x: 4, y: 5 },
  { x: 4, y: 6 },
  { x: 9, y: 6 },
  { x: 9, y: 3 },
  { x: 8, y: 3 },
  { x: 8, y: 5 },
  { x: 7, y: 5 },
  { x: 7, y: 4 },
  { x: 6, y: 4 },
  { x: 6, y: 5 },
  { x: 5, y: 5 },
  { x: 5, y: 4 },
  { x: 1, y: 4 },
  { x: 1, y: 3 },
  { x: 2, y: 3 },
];

let columns = 10;
let ranges = 7;
let totalD = 0;
let direction;

let progress = 3;
let oldProgress;
let oldDirection;
let hasMoved;
let bigDiam = 30;

let apples = [];

let ratio;

let snakecroc;
let snakedie;

const states = {
  IDLE: -1,
  PLAYING: 0,
  DONE: 1,
  BALLS: 2,
};

const doneEase = new Easing({
  from: 0,
  to: 1,
  duration: 1000,
});
const ballEase = new Easing({
  from: 0,
  to: 1,
  duration: 1000,
});

const startEase = new Easing({
  from: 0,
  to: 1,
  duration: 1000,
});

let currState = states.PLAYING;

let sceneSize, centerX, centerY, objSize;

function preload() {
  snakecroc = loadSound('sfx/snakecroc.mp3');
  snakedie = loadSound('sfx/snakedie.mp3');
}


function setup() {
  createCanvas(windowWidth, windowHeight);

  stroke(0);
  strokeWeight(2);
  fill(0);
  angleMode(DEGREES);

  sceneSize = 960; // min(width, height);

  centerX = width / 2;
  centerY = height / 2;
  objSize = sceneSize / 3;

  oldProgress = progress;

  // push(new Apple({ color: color("red"), way: -1 }));

  for (let i = 0; i < path.length - 1; i++) {
    const p1 = path[i];
    const p2 = path[i + 1];

    const d = dist(p1.x, p1.y, p2.x, p2.y);
    totalD += d;
  }
  ratio = columns / ranges;

  // console.log(ratio);
  strokeJoin(ROUND);

  //strokeJoin(ROUND)
  strokeCap(PROJECT);

  const diameter = bigDiam / (width / columns);

  push();

  applyZoom();

  // const p = screenToWorld(0, 0)

  const target1 = screenToWorld(centerX - objSize, centerY);
  const target2 = screenToWorld(centerX - objSize / 2, centerY);
  const target3 = screenToWorld(centerX, centerY);
  const target4 = screenToWorld(centerX + objSize / 2, centerY);
  const target5 = screenToWorld(centerX + objSize, centerY);

  apples.push(
    new Apple({
      x: 9,
      y: 2,

      diameter,
      col: color(215, 64, 67),
      target: createVector(3, 3),
      target2: target1,
    })
  );

  apples.push(
    new Apple({
      x: 3,
      y: 0,
      diameter,
      col: color(155, 187, 91),
      target: createVector(4, 3),
      target2: target2,
    })
  );
  apples.push(
    new Apple({
      x: 1,
      y: 5,
      diameter,
      col: color(90, 54, 133),
      target: createVector(5, 3),
      target2: target3,
    })
  );
  apples.push(
    new Apple({
      x: 6,
      y: 4,
      diameter,
      col: color(73, 166, 217),
      target: createVector(6, 3),
      target2: target4,
    })
  );
  apples.push(
    new Apple({
      x: 2,
      y: 3,
      diameter,
      col: color(247, 207, 106),
      target: createVector(7, 3),
      target2: target5,
    })
  );

  pop();

  startEase.start();
  //stroke
}

function changeState(state) {
  currState = state;

  switch (currState) {
    case states.PLAYING:
      break;
    case states.DONE:
      // console.log("SCRUNCH");
      doneEase.start();
      doneEase.onEnd = () => {
        changeState(states.BALLS);
      };
      break;
    case states.BALLS:
      ballEase.start();

      apples.forEach((e) => {
        e.changeState(pStates.ALIGN);
      });

      ballEase.onEnd = () => {
        // console.log("END");
      };

      break;
  }
}

function getAngle(progress) {
  let reachD = 0;
  let p1, p2;

  for (let i = 0; i < path.length - 1; i++) {
    p1 = path[i];
    p2 = path[i + 1];

    const d = dist(p1.x, p1.y, p2.x, p2.y);
    reachD += d;

    if (reachD > progress) {
      break;
    }
  }

  const angle = atan2(p2.y - p1.y, p2.x - p1.x);
  // console.log(angle)
  return angle;
}

function getProgress(x, y) {
  let reachD = 0;

  for (let i = 0; i < path.length - 1; i++) {
    p1 = path[i];
    p2 = path[i + 1];

    const d = dist(p1.x, p1.y, p2.x, p2.y);
    p1 = createVector(p1.x, p1.y);
    p2 = createVector(p2.x, p2.y);

    for (let a = 0; a < d; a++) {
      let v = p5.Vector.sub(p2, p1);
      v.setMag(a);
      v.add(p1);
      if (x === v.x && y === v.y) {
        return reachD;
      }
      reachD++;
    }
    // console.log(v);
    // for(let i = 0; i < d)
    // reachD += d;

    // if (reachD > progress) {

    //   break;
    // }
  }

  return reachD;
}

const keyMap = {
  ArrowLeft: 180,
  ArrowUp: -90,
  ArrowDown: 90,
  ArrowRight: 0,
};

function applyZoom() {
  scale(width / columns, height / ranges);
  translate(0.5, 0.5);
}

function draw() {
  clear();
  stroke(255);
  noFill();

  // fill(0);
  // translate(centerX, centerY);
  // ellipse(-objSize, 0, bigDiam);
  // ellipse(-objSize / 2, 0, bigDiam);
  // ellipse(0, 0, bigDiam);
  // ellipse(objSize / 2, 0, bigDiam);
  // ellipse(objSize, 0, bigDiam);

  // return;

  let thickness = lerp(1 - 0.1, 0, doneEase.value);
  strokeWeight(thickness);

  // const p = getProgress(3,0);
  // progress = p;

  // fill(215, 64, 67);
  // stroke(215, 64, 67);
  // ellipse(width / 1.05, height / 3, 30);

  // fill(155, 187, 91);
  // stroke(155, 187, 91);
  // ellipse(width / 2.9, height / 10, 30);

  // fill(90, 54, 133);
  // stroke(90, 54, 133);
  // ellipse(width / 6.9, height / 1.25, 30);

  // fill(73, 166, 217);
  // stroke(73, 166, 217);
  // ellipse(width / 1.55, height / 1.5, 30);

  // fill(247, 207, 106);
  // stroke(247, 207, 106);
  // ellipse(width / 4, height / 2, 30);

  // console.log(cRadius);
  //const isPointInPath = drawingContext.isPointInPath(circle, event.offsetX, event.offsetY);

  ratio = height / ranges / (width / columns);
  applyZoom();

  noStroke();
  fill("red");
  // const cRadius = 0.3

  // console.log(progress);
  apples.forEach((apple) => apple.draw());

  direction = getAngle(progress);

  let speed = 0;
  if (direction === keyMap[key]) {
    oldDirection = direction;
    speed = 0.1;
  }

  if (oldDirection === direction) speed = 0.1;

  //progress = map(mouseX, 0, width, 0, totalD)

  progress += speed;
  // progress += 0.5;

  hasMoved = oldProgress !== progress;

  // console.log(hasMoved);

  setLineDash([progress, totalD]);

  const c = drawingContext;

  const firstPos = path[0];
  c.beginPath();

  c.moveTo(firstPos.x, firstPos.y);

  path.forEach((pos) => {
    c.lineTo(pos.x, pos.y);
  });

  // c.lineJoin = "round";
  // c.lineCap = "round";
  c.strokeStyle = "black";
  c.stroke();

  setLineDash();

  c.lineWidth = thickness * startEase.value;
  if(startEase.value >= 1) {

    if (startEase) {
      c.globalCompositeOperation = "destination-in";
      c.strokeStyle = "rgba(0, 0, 0, 1)";
      c.stroke();
    }
  }
  c.globalCompositeOperation = "source-over";
  c.strokeStyle = "rgba(0, 0, 0, 0.01)";
  c.stroke();

  const isPointInPath = c.isPointInStroke(
    mouseX * pixelDensity(),
    mouseY * pixelDensity()
  );
  //console.log(isPointInPath)

  if (isPointInPath) fill("red");

  noStroke();
  //ellipse(pos.x, pos.y, 1)

  switch (currState) {
    case states.PLAYING:
      if (progress >= totalD) {
        changeState(states.DONE);
      }
      break;
    case states.DONE:

      if (!snakedie.isPlaying()) {
        snakedie.play();
        // console.log("DONE");

        started = true;
        break;
      }
  }

  // console.log(totalD, progress);

  oldProgress = progress;

  doneEase.update(deltaTime);
  ballEase.update(deltaTime);
  startEase.update(deltaTime);
  // return;
  // background('black')
  // const thickness = 20
  // strokeWeight(thickness)
  // setLineDash([0, mouseX, 1, width]); //another dashed line pattern
  // line(0, height/2, width, height/2);

  // ellipse(width/2, height/2, width)
}

function setLineDash(list = []) {
  drawingContext.setLineDash(list);
}

function screenToWorld(x, y) {
  const ctxOrMatrix = drawingContext.getTransform();
  const imatrix = ctxOrMatrix.invertSelf();

  x *= pixelDensity();
  y *= pixelDensity();

  return {
    x: x * imatrix.a + y * imatrix.c + imatrix.e,
    y: x * imatrix.b + y * imatrix.d + imatrix.f,
  };
}
