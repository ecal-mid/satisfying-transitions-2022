'use strict';

let started = false
let progress = 0

function setup() {
	createCanvas(windowWidth, windowHeight)
}
function mouseClicked() {
	started = true
}

function draw() {

	if (started)
		progress += deltaTime / 1000

	const bg = sin(progress * PI)
	background(0, 0, bg * 255)

	if (progress >= 1) {
		window.parent.postMessage("finished", "*")
		noLoop()
	}

}
