const GRAVITY = 0.5;

class WaterDrop {
  constructor({ x, y, last = true }) {
    this.x = x;
    this.y = y - 40;
    this.debugY = y;

    this.vel = GRAVITY;
    this.last = last;

    this.zoom = 0.1;

    this.dropped = false;
  }

  draw() {
    // ellipse(this.x, this.debugY, 100);

    this.vel *= 1.1;

    if (!this.dropped) this.y += this.vel;

    if (this.last) {
      this.x = width / 2;

      if (this.y >= height && !this.dropped) {
        this.dropped = true;
        dropLanded();
        this.y = height;
      }
    }

    this.zoom = lerp(this.zoom, 0.2, 0.05);

    this.drawDrop();
    this.drawDrop(layer);
  }

  drawDrop(layer = window) {
    let sceneSize = min(width, height);

    layer.push();
    layer.fill(liquidColor);
    layer.translate(this.x, this.y);

    layer.scale(this.zoom);
    //   triangle(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
    layer.triangle(
      0,
      -objSize / 2,
      halfWidth,
      objSize / 2,
      -halfWidth,
      objSize / 2
    );
    layer.ellipse(0, objSize / 1.2300242131, objSize / 0.7616191904047976);
    layer.pop();
  }
}
