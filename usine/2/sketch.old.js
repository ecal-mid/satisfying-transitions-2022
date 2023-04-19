"use strict";

// let shapeId = 0
let incr = 0;
let incr2 = 0;
//let Imgup,Imgdown,Imgleft,Imgright

// function preload() {
//     Imgup = loadImage('assets/up.png');
//     Imgdown = loadImage('assets/down.png');
//     Imgleft = loadImage('assets/left.png');
//     Imgright = loadImage('assets/right.png');
//   }

function setup() {
  createCanvas(windowWidth, windowHeight);

  angleMode(DEGREES);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(255);
  fill(0);
  noStroke();

  const sceneSize = min(width, height);

  const centerX = width / 2;
  const centerY = height / 2;
  const objSize = sceneSize / 2;
  const halfWidth = objSize / tan(60);

  // arc(centerX, centerY * 0.5, sceneSize, sceneSize, 0, 180)

  triangle(
    centerX,
    centerY - objSize / 2,
    centerX + halfWidth,
    centerY + objSize / 2,
    centerX - halfWidth,
    centerY + objSize / 2
  );

  //rectangle blanc qui cache
  rectMode(CENTER);
  fill("white");
  //haut
  let posRectH = -objSize / 2 - 25 + incr;
  rect(centerX, posRectH, objSize, objSize);
  //gauche
  rect(incr2 - objSize / 2 - 25, centerY, objSize, objSize);
  //droite
  rect(windowWidth - incr2 + objSize / 2 + 25, centerY, objSize, objSize);

  //bas
  rect(centerX, centerY * 2 + objSize / 2 + 25 - incr, objSize * 2, objSize);

  let sticksize = 1000;
  let rectSize = 50;
  fill("white");
  stroke("black");
  strokeWeight(3);

  rectMode(CENTER);

  //tige du piston

  //haut
  rect(centerX, posRectH, 10, objSize, 10);

  //gauche
  rect(incr2 - sticksize / 2 - 25, centerY, sticksize, 10, 10);

  //droite
  rect(centerX * 2 - incr2 + sticksize / 2 + 25, centerY, sticksize, 10, 10);

  //bas
  rect(centerX, centerY * 2 + sticksize / 2 + 25 - incr, 10, sticksize, 10);

  //base du piston

  //haut
  let pos = -rectSize + incr;
  rect(centerX, pos, 90, rectSize, 10);

  //gauche
  let posX = incr2 - rectSize;
  rect(posX, centerY, rectSize, 90, 10);

  //droite
  rect(centerX * 2 + rectSize - incr2, centerY, rectSize, 90, 10);

  //bas
  rect(centerX, centerY * 2 + rectSize - incr, 90, rectSize, 10);

  let stop = centerY - objSize / 8;
  let stopX = centerX - objSize / 4 - rectSize / 2;

  fill("black");
  rect(centerX, centerY, objSize / 2, objSize / 8);

  if (mouseIsPressed) {
    if (pos >= stop) {
      incr += 0;
    } else {
      incr += 2;
    }

    if (posX >= stopX) {
      incr2 += 0;
    } else {
      incr2 += 4;
    }
  }

  console.log("incr", incr);
  console.log("incr2", incr2);

  // switch (shapeId) {
  //     case 0:
  //         rectMode(CORNER)
  //         rect(0, 0, width, height / 2)
  //         break;

  //     case 1:
  //         arc(centerX, centerY * 0.5, sceneSize, sceneSize, 0, 180)
  //         break;

  //     case 2:

  //         triangle(centerX, centerY - objSize / 2, centerX + halfWidth, centerY + objSize / 2, centerX - halfWidth, centerY + objSize / 2)
  //         break;

  //     case 3:

  //         const size = 30
  //         circle(centerX - objSize, centerY, size)
  //         circle(centerX - objSize / 2, centerY, size)
  //         circle(centerX, centerY, size)
  //         circle(centerX + objSize / 2, centerY, size)
  //         circle(centerX + objSize, centerY, size)
  //         break;

  //     case 4:

  //         rectMode(CENTER)
  //         rect(centerX, centerY, objSize,objSize/4)
  //         break;
  // }
}
