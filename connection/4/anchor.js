class Anchor {
  constructor(x, y, diameter) {
    this.dragging = false; // Is the object being dragged?
    this.rollover = false; // Is the mouse over the ellipse?
    this.blackHoled = false
    this.x = x;
    this.y = y;

    this.diameter = diameter;
    // this.h = h;
    this.offsetX = 0;
    this.offsetY = 0;
  }

  over() {
    // Is mouse over object
    if (
      mouseX > this.x - this.diameter &&
      mouseX < this.x + this.diameter &&
      mouseY > this.y - this.diameter &&
      mouseY < this.y + this.diameter
    ) {
      this.rollover = true;
    } else {
      this.rollover = false;
    }
  }

  update() {
    // Adjust location if being dragged
    const d = dist(centerX, centerY, this.x, this.y);
    let fieldForce = map(d, hitSize / 16, hitSize, 0.8, 0, true);
    if (this.dragging) {
      const oldX = this.x;
      const oldY = this.y;
      const forceX = mouseX + this.offsetX - oldX;
      const forceY = mouseY + this.offsetY - oldY;

      this.x += forceX;
      this.y += forceY;

      fieldForce *= 0.9;
    }

    this.x = lerp(this.x, centerX, fieldForce);
    this.y = lerp(this.y, centerY, fieldForce);
  }

  draw() {
    // Different fill based on state
    if (this.dragging) {
      fill(50);
    } else if (this.rollover) {
      fill(100);
    } else {
      fill(175, 200);
    }
    //rectMode(CENTER)

    push();
    const d = dist(centerX, centerY, this.x, this.y);
    if (d < 1 && !this.blackHoled) {
      this.blackHoled = true
      slurpSound.play()

      hasReached()
    }
    // circle(this.x, this.y, this.diameter);
    pop();
  }

  pressed() {
    // Did I click on the rectangle?
    if (this.collides()) {
      this.dragging = true;
      // If so, keep track of relative location of click to corner of rectangle
      this.offsetX = this.x - mouseX;
      this.offsetY = this.y - mouseY;
    }
  }

  collides() {
    const d = dist(this.x, this.y, mouseX, mouseY);
    return d <= this.diameter * 1.5
  }

  released() {
    // Quit dragging
    this.dragging = false;
  }
}
