"use strict";
let layer;

let sceneSize, centerX, centerY, objSize, halfWidth;

let waterdrops = [];

let fillAmount = 1;
let waterDropped = 0;
let totalWaterDrops = 5;
let fillY = 0;
let easeFill, easeTriangle;

let liquidColor;
let colorTarget;

let progress = 0;
let started = false;

let sound;
let boing;

let states = {
  WATER_DROP: 0,
  TRIANGLE: 1,
};

let colorPalette;

let currState = states.WATER_DROP;

function setup() {
  createCanvas(windowWidth, windowHeight);

  angleMode(DEGREES);

  sound = loadSound("water.mp3");
  boing = loadSound("boing.mp3");

  colorPalette = [
    color(215, 64, 67),
    color(155, 187, 91),
    color(90, 54, 133),
    color(73, 166, 217),
    color(247, 207, 106),
  ];

  liquidColor = color("black");
  colorTarget = color("black");

  layer = createGraphics(width, height);

  sceneSize = min(width, height);

  centerX = width / 2;
  centerY = height / 2;
  objSize = sceneSize / 2;
  halfWidth = objSize / tan(60);

  layer.angleMode(DEGREES);

  calcFill();
  easeFill = new Easing({
    duration: 1000,
    from: fillY,
  });

  easeTriangle = new Easing({
    from: 0,
    to: 1.05,
    duration: 1000,
    easing: EASINGS.easeOutElastic,
  });

  easeTriangle.onEnd = () => {
    console.log("transition NOW");
    // window.location.reload();
  };
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function changeState(newState) {
  currState = newState;

  switch (currState) {
    case states.TRIANGLE:
      colorTarget = color("black");
      easeTriangle.start({});
      break;
  }
}

function draw() {
  background(255);

  // bottomWave();

  liquidColor = lerpColor(liquidColor, colorTarget, 0.05);

  switch (currState) {
    case states.WATER_DROP:
      layer.push();

      layer.clear();
      layer.fill(liquidColor);
      layer.noStroke();

      sceneSize = 960; //min(width, height);

      centerX = width / 2;
      centerY = height / 2;
      objSize = sceneSize / 2;
      halfWidth = objSize / tan(60);

      drawArc(layer);
      drawArc();

      fill(liquidColor);
      noStroke();

      waterdrops.forEach((waterdrop) => waterdrop.draw());

      drawingContext.filter = "url(#metaball)";
      image(layer, 0, 0);
      drawingContext.filter = "none";
      //   drawArc();
      //   centerX/2
      //   let y = centerY / 2;

      push();
      fill("white");

      //   const y = lerp( - objSize, centerY / 2, fillAmount);

      //   console.log(y);

      rect(0, easeFill.value - objSize, width, objSize);

      // let offsetWave = 0;
      // let strum = 4;
      // // angleMode(RADIANS);

      // fill("white");

      // beginShape();
      // vertex(width, 0);
      // vertex(0, 0);

      // for (let waveX = 0; waveX < width; waveX++) {
      //   let angleWave = offsetWave + waveX * 0.01;
      //   let waveY = map(sin(angleWave), -strum, strum, 15, 300);

      //   vertex(waveX, waveY + easeFill.value);
      //   vertex(waveX, waveY + easeFill.value);
      // }

      // endShape(CLOSE);
      // offsetWave += 0.1;

      pop();
      //   ellipse(centerX, centerY, sceneSize);

      easeFill.update(deltaTime);
      //   ellipse(mouseX, y, 100);

      layer.pop();
      break;

    case states.TRIANGLE:
      easeTriangle.update(deltaTime);

      const t = easeTriangle.value;

      fill(liquidColor);

      let x = centerX;
      let y = lerp(height, centerY + 35, t);
      let s = lerp(1, 1.155, t);

      translate(x, y);
      scale(s);

      triangle(
        0,
        -objSize / 2,
        halfWidth,
        objSize / 2,
        -halfWidth,
        objSize / 2
      );

      if (!boing.isPlaying()) {
        boing.play();

        started = true;
        break;
      }
  }

  if (started) progress += deltaTime / 1500;

  if (progress >= 1) {
    window.parent.postMessage("finished", "*");
    noLoop();
    boing.stop();
  }
}

function checkCollision() {
  return (
    dist(mouseX, mouseY, centerX, centerY * 0.5) < sceneSize / 2 &&
    mouseY > fillY
  );
}

function drawArc(layer = window) {
  layer.fill(liquidColor);
  layer.arc(centerX, centerY * 0.5, sceneSize, sceneSize, 0, 180);
}

function calcFill() {
  fillY = centerY / 2 - fillAmount * objSize + objSize;
}

function mousePressed() {
  const collided = checkCollision();

  //   fillAmount = totalWaterDrops - waterDropped;

  //   const angle = atan2(mouseY - y, mouseX - centerX);
  //   translate(centerX, y);
  //   rotate(angle);
  //   ellipse(sceneSize / 3, 0, 100);

  if (collided) {
    colorTarget = colorPalette[waterDropped];
    waterDropped++;
    fillAmount = pow(map(waterDropped, 0, totalWaterDrops, 1, 0), 0.6);

    // console.log(fillAmount, pow(fillAmount, 0.5));

    calcFill();
    // console.log(fillAmount);
    const isLast = fillAmount === 0;

    easeFill.start({
      to: fillY,
    });

    sound.play();

    const radius = sceneSize / 2;
    const x = centerX;

    let innerRadius = radius - 10;

    let distX = constrain(x - mouseX, -innerRadius, innerRadius);

    const y = Math.sqrt(innerRadius ** 2 - distX ** 2);

    //   let angle = map(mouseX, x - radius, x + radius, 180, 0, true);

    //   const x1 = x + cos(angle) * radius;
    //   const y1 = y + sin(angle) * radius;

    waterdrops.push(
      new WaterDrop({
        x: mouseX,
        y: y + centerY / 2,
        last: isLast,
      })

      // sound.stop()
    );
  }
}

function dropLanded() {
  setTimeout(() => {
    changeState(states.TRIANGLE);
  }, 1000);
}

// function bottomWave() {
//   angleMode(RADIANS);

//   var offset = 0;
//   var strum = 4;

//   layer.stroke(4);
//   layer.noFill();
//   layer.beginShape();
//   layer.vertex(0, height);
//   for (var x = 0; x < width; x++) {
//     var angle = offset + x * 0.01;
//     var y = map(sin(angle), -strum, strum, 150, 250);
//     layer.vertex(x, y);
//   }
//   layer.vertex(width, height);
//   layer.endShape();
//   offset += 0.05;

//   console.log(bottomWave);
// }
