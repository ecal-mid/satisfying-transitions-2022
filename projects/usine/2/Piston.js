class Piston {
  constructor({ x, y, angle, reach }) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.reach = reach;
    this.delay = 0;
    // random(100, 200)

    this.width = objSize;
    this.height = 50;
    this.armWidth = this.height;

    this.currReach = 0;

    this.ease = new Easing({
      duration: 4000,
      from: 0,
      easing: EASINGS.linear,
    });

    this.ease.onEnd = () => {
      pistonEnded();
    };
  }

  draw() {
    push();
    stroke(0);
    fill(255);
    strokeWeight(strokeThickness);
    rectMode(CENTER);
    translate(this.x, this.y);
    rotate(this.angle);

    const targetReach = mouseIsPressed ? this.reach : 0;

    // this.currReach = lerp(this.currReach, targetReach, 0.05)
    this.currReach = this.ease.value;
    translate(0, -this.currReach);

    const armLength = width * 100;
    // arm
    rect(0, armLength / 2, this.armWidth - strokeThickness, armLength);

    // head
    rect(0, this.height / 2, this.width - strokeThickness, this.height, 10);

    pop();

    this.ease.update(deltaTime);
  }

  crush() {
    this.startDelay((e) => {
      this.ease.start({
        to: this.reach,
      });
    }, 0);
  }

  startDelay(callback, delay) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout((e) => callback(), delay);
  }

  release() {
    this.startDelay((e) => {
      this.ease.start({
        to: 0,
      });
    }, this.delay);
  }

  getPos() {
    const x = this.x + sin(this.angle) * this.currReach;
    const y = this.y + cos(this.angle) * -this.currReach;
    return createVector(x, y);
  }
}
