const nStates = {
  APPEAR: -1,
  IDLE: 0,
  GRABBED: 1,
  RELEASED: 2,
  OFFSCREEN: 3,
};

let grabbedNachos = false;

const GRAVITY = 0.7;

class Nachos {
  constructor() {
    this.angle = 0;

    this.zoom = 1;

    this.pos = createVector(width / 2, height / 2);

    this.velocity = createVector();
    this.state = nStates.IDLE;
  }

  appear() {
    this.changeState(nStates.APPEAR);
    this.zoom = 0.3;
    this.pos.y = 200;
    this.pos.x = width;
  }

  draw() {
    push();

    let centerX = 0;
    let centerY = 0;

    const p1 = { x: centerX, y: centerY - objSize / 2 };
    const p2 = { x: centerX + halfWidth, y: centerY + objSize / 2 };
    const p3 = { x: centerX - halfWidth, y: centerY + objSize / 2 };

    translate(this.pos.x, this.pos.y);

    switch (this.state) {
      case nStates.GRABBED: {
        this.pos.x = mouseX;
        this.pos.y = mouseY;

        this.angle = lerp(this.angle, 180 + movedX, 0.08);
        this.zoom = lerp(this.zoom, 0.3, 0.08);

        break;
      }

      case nStates.RELEASED: {
        // this.velocity.set(this.throwForce);

        this.velocity.y += GRAVITY;
        // this.throwForce.mult(0.7);
        this.pos.add(this.velocity);
        this.pos.add(this.throwForce);

        if (this.pos.y > height * 2) this.changeState(nStates.OFFSCREEN);

        break;
      }

      case nStates.APPEAR: {
        this.pos.x = lerp(this.pos.x, width / 2, 0.08);
      }
    }

    scale(this.zoom);
    rotate(this.angle);

    triangle(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);

    pop();
  }

  changeState(newState) {
    this.state = newState;

    switch (this.state) {
      case nStates.GRABBED:
        nachosGrabbed();
        break;
      case nStates.RELEASED:
        this.throwForce = averageMove.copy();
        this.throwForce.mult(0.5);
      

        break;
      case nStates.OFFSCREEN:
        nachosFell();
        break;
    }
  }

  pressed() {
    const d = dist(this.pos.x, this.pos.y, mouseX, mouseY);
    if (d < (objSize / 2) * this.zoom) {
      this.changeState(nStates.GRABBED);
      grabbedNachos = true;
    }
  }

  released() {
    if (this.state === nStates.GRABBED) {
      grabbedNachos = false;
      this.changeState(nStates.RELEASED);
    }
  }
}

class _Nachos {
  constructor(posX, posY, width, height) {
    this.posX = posX;
    this.posY = posY;
    this.width = width;
    this.height = height;
    this.angle = 0;

    this.x1 = width / 2;
    this.y1 = 0;
    this.x2 = width;
    this.y2 = height;
    this.x3 = 0;
    this.y3 = height;

    this.color = "rgb(231, 188, 108)";

    this.clicked = false;
    this.used = false;
  }

  draw() {
    push();
    if (
      !this.clicked &&
      this.posX > innerWidth / 2 - this.width / 2 &&
      !this.used
    ) {
      this.come();
    }
    if (this.clicked) {
      this.follow();
    }
    if (this.used) {
      this.fall();
    }
    translate(this.posX, this.posY);
    fill(this.color);
    triangle(this.x1, this.y1, this.x2, this.y2, this.x3, this.y3);
    pop();
  }

  come() {
    this.angle += 10;
    this.posX -= 10;
  }

  follow() {
    this.posX = mouseX - this.width / 2;
    this.posY = mouseY - this.height / 2;
  }

  fall() {
    this.posY += 10;
  }

  getArea(a, b, c) {
    return abs(
      (a[0] * (b[1] - c[1]) + b[0] * (c[1] - a[1]) + c[0] * (a[1] - b[1])) / 2
    );
  }

  mouseInTriangle(x1, y1, x2, y2, x3, y3) {
    let point = [mouseX, mouseY];
    let area = this.getArea([x1, y1], [x2, y2], [x3, y3]);
    let areaA = this.getArea([x1, y1], [x2, y2], point);
    let areaB = this.getArea(point, [x2, y2], [x3, y3]);
    let areaC = this.getArea([x1, y1], point, [x3, y3]);
    return abs(areaA + areaB + areaC - area) < 0.001;
  }
}
