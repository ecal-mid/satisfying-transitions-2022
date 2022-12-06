function setup() {
  createCanvas(400, 400);
}

function draw() {
  
  let w = 100
  
  background(220);
  translate(width/2, mouseY)
  
  let h = constrain(height-mouseY, 10, w/2)
  
  rect(-w/2, 0, w, h, 0, 0, h, h);
  
}