// "https://gist.github.com/gre/1650294"
class Easing {
  constructor(opts) {
    this.params = {
      from: 0,
      to: 1,
      easing: EASINGS.easeInOutQuad,
      duration: 1000,
    };

    this.start(opts);
    this.value = this.params.from;
    this.finished = true;
  }

  onEnd() {}
  onUpdate() {}

  update(deltaTime) {
    const { from, to, easing, duration } = this.params;

    if (this.finished) return this.value;

    let amt = easing(min(this.time, 1));

    this.value = lerp(from, to, amt);
    this.easedTime = amt;
    this.onUpdate(this.value);

    if (amt === 1) {
      this.finished = true;
      this.onEnd(this.value);
    } else {
      this.time += deltaTime / duration;
    }

    return this.value;
  }

  start(opts) {
    this.time = 0;
    this.finished = false;
    const { params, value } = this;
    this.params = {
      ...params,
      from: value,
      ...opts,
    };
  }
}

const EASINGS = {
  // no easing, no acceleration
  linear: (t) => t,
  // accelerating from zero velocity
  easeInQuad: (t) => t * t,
  // decelerating to zero velocity
  easeOutQuad: (t) => t * (2 - t),
  // acceleration until halfway, then deceleration
  easeInOutQuad: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  // accelerating from zero velocity
  easeInCubic: (t) => t * t * t,
  // decelerating to zero velocity
  easeOutCubic: (t) => --t * t * t + 1,
  // acceleration until halfway, then deceleration
  easeInOutCubic: (t) =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  // accelerating from zero velocity
  easeInQuart: (t) => t * t * t * t,
  // decelerating to zero velocity
  easeOutQuart: (t) => 1 - --t * t * t * t,
  // acceleration until halfway, then deceleration
  easeInOutQuart: (t) =>
    t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t,
  // accelerating from zero velocity
  easeInQuint: (t) => t * t * t * t * t,
  // decelerating to zero velocity
  easeOutQuint: (t) => 1 + --t * t * t * t * t,
  // acceleration until halfway, then deceleration
  easeInOutQuint: (t) =>
    t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t,

  easeOutElastic: (t) =>
    Math.pow(2, -5 * t) * Math.sin(((t * 5 - 0.75) * (2 * Math.PI)) / 3) + 1,

  easeOutBounce(t) {
    const n1 = 7.5625;
    const d1 = 2.75;

    if (t < 1 / d1) {
      return n1 * t * t;
    } else if (t < 2 / d1) {
      return n1 * (t -= 1.5 / d1) * t + 0.75;
    } else if (t < 2.5 / d1) {
      return n1 * (t -= 2.25 / d1) * t + 0.9375;
    } else {
      return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
  },
};
