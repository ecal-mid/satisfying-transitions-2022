"use strict";

let ground, mouse, world;
const bricks = [];

let sceneSize, centerX, centerY, objSize, halfWidth, triangleWidth;

let thickness, groundLevel, rectWidth;

let ease;
let grow;

let swoosh;

let progress = 0;
let started = false;

let states = {
  PYRAMID: 0,
  SCALING: 1,
  RECTANGLE: 2,
};

let currState = states.PYRAMID;

function preload() {
  swoosh = loadSound("sfx/swoosh.mp3");
}

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);

  sceneSize = min(width, height);
  centerX = width / 2;
  centerY = height / 2;
  objSize = sceneSize / 2;
  halfWidth = objSize / tan(60);
  triangleWidth = halfWidth * 2;

  //   rect(centerX, centerY, objSize,objSize/4)

  // rect(
  //     centerX - (objSize / 4.46 * 4 / 2),
  //     centerY + objSize / 2 - objSize / 4.46,
  //     objSize/ 4.46 * 4,
  //     objSize/ 4.46
  // //   );

  let engine = Matter.Engine.create();

  // console.log((engine.enableSleeping = true));

  world = engine.world;

  const groundThick = 1000;

  thickness = objSize / 4.46;
  rectWidth = thickness * 4;

  ease = new Easing({
    duration: 4000,
    from: 0,
    to: 1,
    easing: EASINGS.easeOutElastic,
  });

  ease.onEnd = function () {
    console.log("ended!");
  };

  ground = new Block(
    world,
    {
      x: centerX,
      y: centerY + objSize / 2 + groundThick / 2,
      w: width,
      h: groundThick,
      color: "white",
    },
    { isStatic: true, angle: 0 }
  );

  groundLevel = centerY + objSize / 2;

  // rect(centerX - rectWidth / 2, groundLevel - thickness, rectWidth, thickness)

  // centerX
  // groundLevel
  addBrick(
    //  le rectangle qui reste statique
    centerX - rectWidth / 2,
    groundLevel,

    [
      { x: -rectWidth / 2, y: -thickness },
      { x: rectWidth / 2, y: -thickness },
      { x: rectWidth / 2, y: 0 },
      { x: -rectWidth / 2, y: 0 },
    ],
    true
  );

  const smallTriangle = (triangleWidth - rectWidth) / 2;

  // petit triangle niveau du bas gauche
  addBrick(centerX - halfWidth, groundLevel, [
    { x: 0 / 2, y: -thickness },
    { x: 0, y: 0 },
    { x: -smallTriangle, y: 0 },
  ]);

  //   petit triangle niveau du bas à droite
  addBrick(centerX + halfWidth - smallTriangle, groundLevel, [
    { x: 0 / 2, y: -thickness },
    { x: 0, y: 0 },
    { x: smallTriangle, y: 0 },
  ]);

  //   rectangle niveau intermediaire
  addBrick(centerX, groundLevel - thickness, [
    { x: rectWidth / 2, y: -thickness },
    { x: rectWidth - smallTriangle, y: -thickness },
    { x: rectWidth / 2, y: 0 },
    { x: rectWidth - smallTriangle, y: 0 },
  ]);

  //   petit triangle du milieu intermédiaire
  addBrick(centerX + halfWidth - smallTriangle * 2, groundLevel - thickness, [
    { x: 0 / 2, y: -thickness },
    { x: 0, y: 0 },
    { x: smallTriangle, y: 0 },
  ]);

  //  triangle en haut à droite
  addBrick(centerX, groundLevel - thickness * 2, [
    { x: 0 / 2, y: -objSize / 3 - thickness },
    { x: 0, y: 0 },
    { x: halfWidth - smallTriangle * 2 + 1, y: 0 },
  ]);

  //   le grand triangle à gauche
  addBrick(centerX - (halfWidth - smallTriangle), groundLevel - thickness, [
    { x: 0, y: thickness - centerY - 3 },
    { x: 0, y: 0 },
    { x: -(triangleWidth - smallTriangle * 2) / 2, y: 0 },
  ]);

  // add a mouse to manipulate Matter objects
  mouse = new Mouse(engine, canvas, { stroke: "magenta", strokeWeight: 0 });

  // console.log(
  //   mouse.mouse.mousedown(() => {
  //     console.log("yes");
  //   })
  // );
  // run the engine
  Matter.Runner.run(engine);
}

function addBrick(centerX, centerY, points, isStatic) {
  const polygon = new PolygonFromPoints(
    world,
    {
      x: 0,
      y: 0,
      points,
      color: "black",
    },
    { isStatic }
  );

  const { min, max } = polygon.body.bounds;

  Matter.Body.set(polygon.body, "position", {
    x: centerX - min.x,
    y: centerY - max.y,
  });
  bricks.push(polygon);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function changeState(newState) {
  currState = newState;

  switch (currState) {
    case states.PYRAMID:
      // colorTarget = color("black");
      // easeTriangle.start({});
      break;
  }
}

// function mouseClicked() {
// }

function checkFinish() {
  const onScreenbricks = bricks.filter((brick) => {
    if (brick.body.isStatic) return false;
    return brick.body.position.y < height;
  });

  return onScreenbricks.length === 0;
}

function changeSecondState(newState) {
  currState = newState;

  switch (currState) {
    case states.SCALING:
      ease.start({});
      break;
  }
}

function mouseClicked() {
  swoosh.play();
}

function draw() {
  background("white");
  // const isVisible = window.frameElement?.className === "selected";
  // if(!isVisible) return clear();

  switch (currState) {
    case states.PYRAMID:
      //   fill(0, 10);
      //   noStroke();
      //   triangle(
      //     centerX,
      //     centerY - objSize / 2,
      //     centerX + halfWidth,
      //     centerY + objSize / 2,
      //     centerX - halfWidth,
      //     centerY + objSize / 2
      //   );

      noStroke();
      fill(255);
      ground.draw();

      stroke(0);
      fill(0);
      bricks.forEach((brick) => brick.draw());
      mouse.draw();

      const isFinished = checkFinish();

      if (isFinished) {
        changeSecondState(states.SCALING);

        // grow = !grow;

        // let to = grow ? 1.15 : 1;

        // ease.start({
        //   to: to,
        // });
      } //   push();
      // stroke(0)
      // line(0, groundLevel, width, groundLevel)
      // rectMode(CENTER)
      //   fill(255, 0, 0, 100);
      // rect(centerX - rectWidth / 2, groundLevel - thickness / 2, rectWidth, thickness)
      // rect(centerX, centerY, objSize, objSize / 4)
      //   pop();

      break;

    case states.SCALING:
      // const value = ease.update(deltaTime);

      fill("black");

      // translate(-width / 18, -height / 4);
      // translate(-100, 0);

      // scale(value);

      rect(
        centerX - rectWidth / 2,
        groundLevel - thickness,
        rectWidth,
        thickness
      );

      changeState(states.RECTANGLE);

      break;

    case states.RECTANGLE:
      ease.update(deltaTime);

      let t = ease.value;

      let x = lerp(centerX - rectWidth / 2, centerX - objSize / 2 - 70, t);
      let y = lerp(groundLevel - thickness, centerY - 2 - objSize / 8, t);
      let widthsize = lerp(rectWidth, objSize + 60 + 80, t);
      let heightsize = lerp(thickness, objSize / 4 + 4, t);

      // if (mouseIsPressed === true) {
      //   swoosh.play();
      // }

      rect(x, y, widthsize, heightsize);

      // rect(
      //   centerX - objSize / 2 - 60,
      //   centerY - 2 - objSize / 8,
      //   objSize + 60,
      //   objSize / 4 + 4
      // );

      started = true;

      break;
  }

  if (started) progress += deltaTime / 1500;

  if (progress >= 1) {
    window.parent.postMessage("finished", "*");
    noLoop();
  }
}
