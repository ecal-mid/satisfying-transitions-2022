let IDLE = 0;
let CUT = 1;
let HALFCUT = 2;

class Fruit {
  constructor() {
    this.halfCut = false;
    this.animation = null;
    this.state = IDLE;
    this.x = 0;
    this.y = 0;
    this.way = 1;
  }

  loadVideo() {
    let src = this.halfCut
      ? random(["videos/renders/renders-final/cut-bottom-stay.mp4"])
      : random(["videos/renders/renders-final/cut-nostay.mp4", "videos/renders/renders-final/cut-nostay-var2.mp4"]);

    this.animation = createVideo(src);
    this.animation.volume(0);
    this.animation.hide(0);
    this.animation.time(0.001); // fix frame flicker on play
  }

  draw(x, y) {
    // fill("red");
    // const way =
    const d = dist(mouseX, mouseY, x, y);

    switch (this.state) {
      case IDLE:
        this.way = movedX > 0 ? 1 : -1;
        fill("#0037FF");
        circle(x, y, size);
        // if collision
        if (d < size / 2) {
          this.state = CUT;
          this.animation.play();
          this.animation.onended(() => {
            fruitCut();
            if (this.halfCut) this.state = HALFCUT;
          });
          sliceSound.play();
        }
        break;
      case CUT:
        push();
        translate(x, y);
        scale(0.5);
        scale(this.way, 1);
        image(this.animation, 0, 0);
        pop();
        break;
      case HALFCUT:
        arc(x, y, size, size, 0, 180);
        break;
    }

    this.x = x;
    this.y = y;
    // top

    // arc(x, y, size, size, 0, 180);
    // // bottom
    // this.animation.loop()
  }
}
