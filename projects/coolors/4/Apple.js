const pStates = {
  IDLE: -1,
  EATEN: 0,
  ALIGN: 1,
};

class Apple {
  constructor({ x, y, col, diameter, target, target2 }) {
    this.x = x;
    this.y = y;
    this.target = target; // x, y
    this.target2 = target2; // x, y
    this.col = col;
    this.diameter = diameter;

    this.eaten = false;

    this.progress = getProgress(x, y);
    this.variation = random(0.5, 1.5);
    // console.log(this.progress);
    // this.color = color;
    this.changeState(pStates.IDLE);
  }

  changeState(state) {
    this.state = state;

    switch (this.state) {
      case pStates.IDLE:
        break;
      case pStates.EATEN:
        this.x = this.target.x;
        this.y = this.target.y;
        // console.log(this.x, this.y);

        if (!snakecroc.isPlaying()) {
          snakecroc.play();
        
   
          break;
          }
        // console.log("SCRUNCH");
        // break;
      case pStates.ALIGN:
        // this.x = this.target2.x;
        // this.y = this.target2.y;
        break;
    }
  }

  draw() {
    push();
    fill(this.col);

    let diameter = this.diameter * pow(startEase.value, this.variation);
    ellipse(this.x, this.y, diameter, diameter / ratio);
    pop();

    switch (this.state) {
      case pStates.IDLE:
        if (this.progress - 0.5 <= progress) this.changeState(pStates.EATEN);

        break;
      case pStates.ALIGN:
        // console.log(ballEase);
        this.x = lerp(this.target.x, this.target2.x, ballEase.value);
        this.y = lerp(this.target.y, this.target2.y, ballEase.value);
        this.col = lerpColor(this.col, color("black"), pow(ballEase.value, 3));
        break;
    }
  }
}
