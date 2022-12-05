'use strict';

const physics = new VerletPhysics()
physics.gravityY = 1000

const dragManager = new DragManager()

let chain

function setup() {
  createCanvas(windowWidth, windowHeight);


  /*

  // TWO CONNECTED OBJECTS
  const b1 = physics.createBody({
    positionX: width / 2,
    positionY: 0,
    isFixed: true
  })

  const b2 = physics.createBody({
    positionX: width / 2,
    positionY: height / 2
  })

  const link2 = physics.createLink({
    bodyA: b1,
    bodyB: b2,
    mode: VerletMode.Pull
  })

  dragManager.createDragObject({
    target: b2,
    onStartDrag: o => {
      o.isFixed = true
    },
    onStopDrag: o => {
      o.isFixed = false
    }
  })
*/

  // CHAIN
  chain = physics.createChain({

    startPositionX: width / 2,
    startPositionY: 0,
    endPositionX: width / 2 + 40,
    endPositionY: height / 2,
    elementCount: 16,
    linkOptions: {
      //mode: VerletMode.Pull,
      stiffness: 1
    },
    bodyOptions: {
      drag: 1,
      radius: 10,
      radius: 50
    }
  })

  for (const o of chain.bodies) {

    dragManager.createDragObject({
      target: o,
      onStartDrag: o => {
        o.isFixed = true
      },
      onStopDrag: o => {
        o.isFixed = false
      }
    })
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


function draw() {

  physics.bounds = {
    bottom: height
  }

  dragManager.update()
  physics.update()

  background(255);

  strokeWeight(10)

  // draw the chain
  beginShape()
  const firstBody = chain.bodies[0]
  vertex(firstBody.positionX, firstBody.positionY)
  for (const body of chain.bodies) {
    curveVertex(body.positionX, body.positionY)
  }
  const lastBody = chain.bodies[chain.bodies.length - 1]
  vertex(lastBody.positionX, lastBody.positionY)
  endShape()

  // debug visualization
  //physics.displayDebug()
}
