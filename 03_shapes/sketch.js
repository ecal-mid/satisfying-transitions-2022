'use strict';

let shapeId = 0

function setup() {
    createCanvas(windowWidth, windowHeight);

    angleMode(DEGREES)
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function mouseClicked() {
    shapeId++
    shapeId %= 5
}

function draw() {

    background(255);
    fill(0)
    noStroke()

    const sceneSize = min(width, height)

    const centerX = width / 2
    const centerY = height / 2
    const objSize = sceneSize / 2
    const halfWidth = objSize / tan(60)

    switch (shapeId) {
        case 0:
            rectMode(CORNER)
            rect(0, 0, width, height / 2)
            break;

        case 1:
            arc(centerX, centerY * 0.5, sceneSize, sceneSize, 0, 180)
            break;

        case 2:

            triangle(centerX, centerY - objSize / 2, centerX + halfWidth, centerY + objSize / 2, centerX - halfWidth, centerY + objSize / 2)
            break;

        case 3:

            const size = 30
            circle(centerX - objSize, centerY, size)
            circle(centerX - objSize / 2, centerY, size)
            circle(centerX, centerY, size)
            circle(centerX + objSize / 2, centerY, size)
            circle(centerX + objSize, centerY, size)
            break;

        case 4:

            rectMode(CENTER)
            rect(centerX, centerY, objSize,objSize/4)
            break;
    }

}
