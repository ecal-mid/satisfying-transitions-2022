'use strict';

class Circle {

  constructor() {

    this.positionX = width / 2
    this.positionY = height / 2
    this.velocityX = 0
    this.velocityY = 0
    this.scaleSpring = new Spring({
      position: 1,
      frequency: 4,
      halfLife: .4
    })
    this.gravity = false
    this.isGrabbed = false
    this.grabOffsetX = 0
    this.grabOffsetY = 0
    this.radius = 1 // will be set later
  }

  isOverlapping(x, y) {
    return dist(this.positionX, this.positionY, x, y) < this.radius
  }
  draw() {

    push()
    translate(this.positionX, this.positionY)
    scale(this.scaleSpring.position)
    circle(0, 0, this.radius * 2, this.radius * 2)
    pop()

  }

}

class Triangle {

  constructor() {

    this.positionX = 0
    this.positionY = 0
    this.scaleSpring = new Spring({
      position: 0,
      frequency: 3,
      halfLife: .3
    })
    this.rotationSpring = new Spring({
      position: 0,
      frequency: 1.5,
      halfLife: .13,
      wrap: 360
    })

    this.halfWidth = 1
    this.height = 1
  }
  draw() {

    push()
    translate(this.positionX, this.positionY)
    angleMode(DEGREES)
    rotate(this.rotationSpring.position)
    scale(this.scaleSpring.position)
    triangle(
      0, - this.height * 0.666,
      this.halfWidth, this.height * 0.333,
      - this.halfWidth, this.height * 0.333)

    pop()
  }
}

let sceneSize
let objSize
let myTriangle
let myCircle
let isFinished = false
function setup() {
  createCanvas(windowWidth, windowHeight);

  myCircle = new Circle()
  myCircle.positionX = width / 2
  myCircle.positionY = height / 2

  myTriangle = new Triangle()
  myTriangle.positionX = width / 2
  myTriangle.positionY = height / 2

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {

  const centerX = width / 2
  const centerY = height / 2
  sceneSize = min(width, height)
  objSize = sceneSize / 2

  myTriangle.halfWidth = objSize * 0.5773502692
  myTriangle.height = objSize

  myCircle.radius = objSize * 0.5773502692 // magic number, keep it

  if (!myCircle.isGrabbed) {
    if (myCircle.isOverlapping(mouseX, mouseY) && mouseIsPressed) {
      myCircle.isGrabbed = true
      myCircle.grabOffsetX = (myCircle.positionX - mouseX) / myCircle.scaleSpring.position
      myCircle.grabOffsetY = (myCircle.positionY - mouseY) / myCircle.scaleSpring.position
    }
  }
  else {
    if (!mouseIsPressed) {
      myCircle.isGrabbed = false
      myCircle.gravity = true
    }
  }
  const dt = deltaTime / 1000
  if (myCircle.isGrabbed) {
    const lastX = myCircle.positionX
    const lastY = myCircle.positionY
    myCircle.positionX = mouseX + myCircle.grabOffsetX * myCircle.scaleSpring.position
    myCircle.positionY = mouseY + myCircle.grabOffsetY * myCircle.scaleSpring.position
    myCircle.velocityX = (myCircle.positionX - lastX) / dt
    myCircle.velocityY = (myCircle.positionY - lastY) / dt


  }

  if (myCircle.gravity) {
    const gravity = 2000
    myCircle.velocityY += gravity * dt
  }
  if (!myCircle.isGrabbed) {
    myCircle.positionX += myCircle.velocityX * dt
    myCircle.positionY += myCircle.velocityY * dt
  }

  const d = dist(myCircle.positionX, myCircle.positionY, centerX, centerY)
  const isFar = d > myCircle.radius * 2
  const isBig = !myCircle.isGrabbed && isFar

  myTriangle.scaleSpring.target = isBig ? 1 : 0.2

  if (!isBig) {
    const triangleToCircleX = myCircle.positionX - myTriangle.positionX
    const triangleToCircleY = myCircle.positionY - myTriangle.positionY

    myTriangle.rotationSpring.target = atan2(triangleToCircleY, triangleToCircleX) + 90
  }
  else {

    myTriangle.rotationSpring.target = 0
  }

  const isOut = d > max(width / 2, height / 2) + myCircle.radius

  const angleDiff = deltaAngle(myTriangle.rotationSpring.position, myTriangle.rotationSpring.target)
  const rotationReachedTarget = abs(angleDiff) < 0.1
  if (isOut && rotationReachedTarget && !isFinished) {
    isFinished = true
    console.log("finished")
    window.parent.postMessage("finished", "*")
  }

  myTriangle.scaleSpring.step(dt)
  myTriangle.rotationSpring.step(dt)

  myCircle.scaleSpring.target = myCircle.isGrabbed ? .9 : 1
  myCircle.scaleSpring.step(dt)

  background(255);
  fill(0)
  noStroke()

  myTriangle.draw()
  myCircle.draw()

}

const deltaAngle = (a1, a2) => {
  let diff = mod(a2 - a1, 360);
  if (diff > 180)
    diff -= 360;
  return diff;
};

const mod = (n, m) => ((n % m) + m) % m;