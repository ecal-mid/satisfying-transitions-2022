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
	background(bg * 255, 0, 0)

	if (progress >= 1) {
		window.parent.postMessage("finished", "*")
		noLoop()
	}

}
