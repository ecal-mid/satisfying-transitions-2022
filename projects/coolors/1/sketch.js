"use strict";

let progress = 0;
let started = false;

let sounds = [];
// let soundOne;
// let soundTwo;
// let soundThree;
// let soundFour;
// let soundFive;

// let shapeId = 0;

let ease;
let easeScale;
let easeFill;
let grow = false;

let fillY = 0;

let states = {
  RAINBOW: 0,
  BLACK: 1,
  MOVE: 2,
  // ARC: 3,
};

let currState = states.RAINBOW;
let completeCircles = 0;
let circles = [];
const dotDiameter = 30;

function preload() {
  sounds.push(loadSound("sounds/soundOne.mp3"));
  sounds.push(loadSound("sounds/soundTwo.mp3"));
  sounds.push(loadSound("sounds/soundThree.mp3"));
  sounds.push(loadSound("sounds/soundFour.mp3"));
  sounds.push(loadSound("sounds/soundFive.mp3"));
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  angleMode(DEGREES);
  strokeCap(SQUARE);

  // le premier
  circles.push(
    new RainbowSlider({
      color: color(215, 64, 67),
      way: -1,
      sound: sounds[0],
    })
  );

  // le troisieme
  circles.push(
    new RainbowSlider({ color: color(155, 187, 91), sound: sounds[2] })
  );

  // le dernier
  circles.push(
    new RainbowSlider({ color: color(90, 54, 133), sound: sounds[4] })
  );

  // l'avant dernier
  circles.push(
    new RainbowSlider({
      color: color(73, 166, 217),
      way: 1,
      sound: sounds[3],
    })
  );

  //  le deuxieme
  circles.push(
    new RainbowSlider({ color: color(247, 207, 106), sound: sounds[1] })
  );

  calcFill();
  easeFill = new Easing({
    duration: 1000,
    from: fillY,
  });

  ease = new Easing({
    duration: 2000,
    from: 1,
    to: 180,
    easing: EASINGS.easeOutElastic,
  });

  easeScale = new Easing({
    duration: 3000,
    from: 1,
    to: 1.2,
    easing: EASINGS.easeOutElastic,
  });

  ease.onEnd = function () {
    console.log("ended!");
  };

  // ease.onUpdate = function (value) {
  //   // console.log(value);‚
  // };
}

function calcFill() {
  const sceneSize = 960; // min(width, height);

  const objSize = sceneSize / 3;

  fillY = height / 4 - objSize + objSize;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(255);
  fill(0);
  noStroke();
  // cursor("");

  const sceneSize = 960; // min(width, height);

  const centerX = width / 2;
  const centerY = height / 2;
  const objSize = sceneSize / 3;

  switch (currState) {
    case states.RAINBOW:
      push();
      translate(centerX, centerY);
      circles[0].draw(-objSize, 0);
      circles[1].draw(-objSize / 2, 0);
      circles[2].draw(0, 0);
      circles[3].draw(objSize / 2, 0);
      circles[4].draw(objSize, 0, 1);

      pop();
      break;

    case states.BLACK:
      translate(centerX, centerY);

      push();
      circles[0].draw(-objSize, 0);
      circles[1].draw(-objSize / 2, 0);
      circles[2].draw(0, 0);
      circles[3].draw(objSize / 2, 0);
      circles[4].draw(objSize, 0, 1);
      pop();

      arc(0 + 30, 0, sceneSize / 1.2, sceneSize / 1.2, 180, 360);

      onFinishedBlack();
      break;

    case states.MOVE:
      // clear();
      const value = ease.update(deltaTime);
      const gros = easeScale.update(deltaTime);

      translate(width / 2, height / 2);
      rotate(value);
      translate(-36, 280);
      scale(gros);

      calcFill();

      easeFill.start({
        to: fillY,
      });
      console.log("yee");

      arc(0 + 30, 0, sceneSize / 1.2, sceneSize / 1.2, 180, 360);

      started = true;
      break;

    // case states.ARC:
    //   arc(centerX, centerY * 0.5, sceneSize, sceneSize, 0, 180);
    //   console.log("arc dessiner");
    //   break;
  }
  if (started) progress += deltaTime / 1000;

  if (progress >= 1) {
    window.parent.postMessage("finished", "*");
    noLoop();
  }
}

function onCompleteCircle() {
  completeCircles++;

  if (completeCircles === circles.length) {
    currState = states.BLACK;
    console.log("all circles complete!");
  }
}

function onFinishedBlack() {
  currState = states.MOVE;

  grow = !grow;

  let to = grow ? 180 : 0;
  let toto = grow ? 1 : 0;

  // setTimeout(() => {
  ease.start({
    to: to,
  });

  easeScale.start({
    toto: toto,
  });
  // }, 1000);

  console.log("black");
}
