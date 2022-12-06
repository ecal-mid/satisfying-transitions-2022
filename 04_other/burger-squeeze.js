function setup() {
  createCanvas(400, 400);
}

function draw() {
  
  
  
  background(220);
  
  let minThickness = 20;
  let maxThickness = 50

  let y = min(mouseY, height - minThickness)
  translate(width/2, y)
  let h = min(maxThickness, height-y)
  let squeeze = 1-(h-minThickness)/(maxThickness-minThickness)
  
  //console.log(squeeze)
  let w = lerp(100, 110, squeeze)
  bottomBun(-w/2, 0, w, h, lerp(w/2, 0, squeeze))
  //rect(, 0, w, h, 0, 0, h, h);
  
  
  
}

function bottomBun(x, y, w, h, roundness) {
  drawingContext.beginPath();
  drawingContext.roundRect(x, y, w, h, [0,0,roundness,roundness]);
  drawingContext.fill();
}
