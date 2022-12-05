'use strict';
const arcs = []

let finished = false
let pressPositionX
let pressPositionY
function setup() {
	createCanvas(windowWidth, windowHeight);

	for (let i = 0; i < 4; i++) {

		const arc = {

			roundness: (new SpringNumber()).setup({
				frequency: 4,
				halfLife: .2
			}),
			rotation: i * 90
		}

		arcs.push(arc)
	}

	angleMode(DEGREES)
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}
function mousePressed() {

	pressPositionX = mouseX
	pressPositionY = mouseY
}


function draw() {

	background(255);
	fill(0)
	noStroke()

	const sceneSize = min(width, height)

	const centerX = width / 2
	const centerY = height / 2
	const rectSize = sceneSize / 2
	const circleSize = rectSize / tan(60) * 2

	const radius = circleSize / 2

	const pressedInside = mouseIsPressed && dist(pressPositionX, pressPositionY, centerX, centerY) < radius


	const mouseVecRelToCenter = createVector(mouseX - centerX, mouseY - centerY)
	const flatDist = radius * 0.707

	translate(centerX, centerY)
	for (const arc of arcs) {

		const arcDir = createVector(1, 0).rotate(arc.rotation)
		const diff = abs(arcDir.angleBetween(mouseVecRelToCenter))
		const near = constrain(map(diff, 90, 45, 0, 1), 0, 1)

		const activeProgress = constrain((mouseVecRelToCenter.mag() - flatDist) / flatDist * 2 * near, 0, 1)
		arc.roundness.target = arc.finished ? 1 : (pressedInside ? activeProgress : 0)
		arc.roundness.step(deltaTime / 1000)

		const arcProgress = arc.roundness.position
		if (arcProgress >= 1 && near >= 1)
			arc.finished = true


		push()
		rotate(arcDir.heading() - 45)
		bezierArc(0, 0, circleSize, arcProgress)
		pop()

	}

	const newFinished = arcs.every(a => a.finished)
	if (newFinished != finished) {
		console.log("ok")

		setTimeout(() => {
			window.parent.postMessage("finished", "*")
		}, 300)

		finished = newFinished
	}
}

function arcCircle(x, y, size) {

	push()
	translate(x, y)
	fill(0, 0, 0)
	arc(0, 0, size, size, 0, 90)
	fill(128, 0, 0)
	arc(0, 0, size, size, 90, 180)
	fill(192, 0, 0)
	arc(0, 0, size, size, 180, 270)
	fill(255, 0, 0)
	arc(0, 0, size, size, 270, 0)
	pop()
}

function bezierArc(x, y, size, roundness) {

	const negWeightBoostStart = -1
	const weightBoostStart = 2
	const baseRoundness = constrain(roundness, negWeightBoostStart, weightBoostStart)

	const radius = size / 2
	const weightBoost = max(roundness - weightBoostStart, 0) - min(roundness - negWeightBoostStart, 0)
	const weight = 0.551915024494 * (1 + weightBoost)

	angleMode(DEGREES)
	const start = createVector(0, radius)
	const cpStart = createVector(radius * weight, 0).rotate(map(baseRoundness, 0, 1, -45, 0))
	const cpEnd = createVector(0, radius * weight).rotate(map(baseRoundness, 0, 1, 45, 0))
	const end = createVector(radius, 0)
	push()
	translate(x, y)
	beginShape();
	vertex(-1, -1) // correction for overlapping arcs
	vertex(start.x, start.y);
	bezierVertex(cpStart.x + start.x, cpStart.y + start.y, cpEnd.x + end.x, cpEnd.y + end.y, end.x, end.y);
	endShape(CLOSE);
	pop()
}

function bezierCircle(x, y, size) {
	const radius = size / 2
	const weight = 0.551915024494
	push()
	translate(x, y)
	beginShape();
	vertex(0, radius);
	bezierVertex(
		radius * weight, radius,
		radius, radius * weight,
		radius, 0);
	bezierVertex(
		radius, - radius * weight,
		radius * weight, -radius,
		0, -radius);
	bezierVertex(
		-radius * weight, -radius,
		-radius, -radius * weight,
		-radius, 0);
	bezierVertex(
		- radius, radius * weight,
		- radius * weight, radius,
		0, radius);

	endShape();
	pop()
}
