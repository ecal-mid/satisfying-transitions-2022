'use strict';

let sceneSize
let objSize
let lineFound

const dragManager = new DragManager()

let topCorner
let handle
let handleSpring

const endLinePoints = []
let endTime = 0

function setup() {
  createCanvas(windowWidth, windowHeight);

  updateSize()

  topCorner = {
    positionX: width / 2,
    positionY: height / 2 - objSize * 0.666,
  }
  handle = {

    positionX: width / 2,
    positionY: height / 2 + objSize * 0.333,
    radius: 200
  }
  handleSpring = new Spring({
    frequency: 3,
    halfLife: 0.3,
    position: height / 2 + objSize * 0.333
  })

  dragManager.createDragObject({
    target: handle
  })

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function updateSize() {

  sceneSize = min(width, height)
  objSize = sceneSize / 2
}

function draw() {
  updateSize()

  const centerX = width / 2
  const centerY = height / 2

  dragManager.update()

  if (!dragManager.currentDragObject) {
    handleSpring.target = height / 2 + objSize * 0.333
    handleSpring.step(deltaTime / 1000)
    handle.positionY = handleSpring.position
  }
  else {
    handleSpring.position = handle.positionY
  }

  handle.positionX = width / 2
  //handle.positionY = max(height / 2 - objSize * 0.666 + 0.001, handle.positionY)
  //handle.positionY = max(height / 2 + objSize * 0.333, handle.positionY)

  // START: TRIANGLE
  const halfWidth = objSize * 0.5773502692 // = 0.5773502692 = 1 / tan(60°) to keep side lengths equal

  const distBetween = abs(topCorner.positionY - handle.positionY)

  const widthMulti = lineFound ? 0 : map(distBetween, objSize, objSize + 200, 1, 0, true)
  const lineAppear = lineFound ? 1 : map(widthMulti, 1, 0, 0, 1, true)

  if (widthMulti === 0 && !lineFound) {
    lineFound = true

    const pointCount = 12
    const freq = 5
    const halfLife = 0.25
    for (let i = 0; i < pointCount; i++) {
      const x = width / 2
      const y = map(i, 0, pointCount - 1, topCorner.positionY + distBetween, topCorner.positionY)
      endLinePoints.push({
        positionX: x,
        positionY: y
      })
    }


  }
  const maxDist = objSize / endLinePoints.length


  if (lineFound) {
    if (mouseIsPressed) {

      endLinePoints[0].positionX = lerp(endLinePoints[0].positionX, mouseX, 0.5)
      endLinePoints[0].positionY = lerp(endLinePoints[0].positionY, mouseY, 0.5)

      for (let i = 1; i < endLinePoints.length; i++) {

        const prevPos = createVector(endLinePoints[i - 1].positionX, endLinePoints[i - 1].positionY)
        const pos = createVector(endLinePoints[i].positionX, endLinePoints[i].positionY)
        const vecFromPrev = p5.Vector.sub(pos, prevPos).limit(maxDist)
        const targetPos = p5.Vector.add(prevPos, vecFromPrev)
        const finalPos = p5.Vector.lerp(pos, targetPos, 0.7)
        endLinePoints[i].positionX = finalPos.x
        endLinePoints[i].positionY = finalPos.y
      }
      endTime = 0
    }
    else {
      endTime += deltaTime / 1000

      for (let i = 0; i < endLinePoints.length; i++) {

        const endPosX = centerX
        const endPosY = map(i, 0, endLinePoints.length - 1, topCorner.positionY + distBetween, topCorner.positionY)

        const lerpSpeed = constrain(endTime * 1 - i * 0.1, 0, 1)
        endLinePoints[i].positionX = lerp(endLinePoints[i].positionX, endPosX, lerpSpeed)
        endLinePoints[i].positionY = lerp(endLinePoints[i].positionY, endPosY, lerpSpeed)
      }
    }
  }


  background(255);

  stroke(0)
  strokeWeight(8 * lineAppear)
  strokeCap("round")
  strokeJoin("round")

  if (!lineFound) {

    fill(0)

    push()
    translate(topCorner.positionX, topCorner.positionY)
    triangle(
      0, 0,
      halfWidth * widthMulti, objSize,
      - halfWidth * widthMulti, objSize)

    if (distBetween < objSize)
      fill(255)

    triangle(
      0, distBetween,
      -halfWidth * widthMulti, objSize,
      halfWidth * widthMulti, objSize)

    // line
    line(0, 4, 0, distBetween - 4)
    pop()
  }
  else {

    noFill()
    beginShape()

    for (let i = 0; i < endLinePoints.length; i++) {
      const p = endLinePoints[i]
      if (i === 0 || i === endLinePoints.length - 1)
        vertex(p.positionX, p.positionY)

      curveVertex(p.positionX, p.positionY)
    }
    endShape()
  }


  // END: LINE
  stroke(0)
  strokeWeight(8)
  //line(centerX, centerY - objSize / 2, centerX, centerY + objSize / 2)

}
