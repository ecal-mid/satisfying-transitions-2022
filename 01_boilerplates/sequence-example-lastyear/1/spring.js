
class Spring {
    /**
     * @param {Number} omega - The angular frequency in radians per second.
     * @param {Number} zeta - The damping ratio of the spring.
     */
    constructor(omega = 0, zeta = 0) {
        this.omega = omega;
        this.zeta = zeta;
    }


    setup({ frequency, halfLife }) {

        this.frequency = frequency
        this.halfLife = halfLife
        return this
    }

    /**
     * The oscillation frequency in hertz.
     * Directly linked to omega.
     * @type {Number}
     */
    get frequency() {
        return this.omega / (2 * Math.PI);
    }

    set frequency(freq) {
        this.omega = 2 * Math.PI * freq;
    }

    /**
     * Sets the damping as the time over which the oscillation is reduced by half.
     * Directly linked to zeta and depending on omega.
     * @type {Number}
     */
    get halfLife() {
        return -Math.log(0.5) / (this.omega * this.zeta);
    }

    set halfLife(hf) {
        this.zeta = -Math.log(0.5) / (this.omega * hf);
    }
}


class SpringVector extends Spring {
    /**
     * @param {Number} omega - The angular frequency in radians per second.
     * @param {Number} zeta - The damping ratio of the spring.
     */
    constructor(omega = 0, zeta = 0) {
        super(omega, zeta)

        this.position = createVector();
        this.velocity = createVector();
        this.target = createVector();

        this.detX = createVector();
        this.detV = createVector();
    }

    step(deltaTime) {
        // Implicit method
        var f = 1 + 2 * deltaTime * this.zeta * this.omega;
        var oo = this.omega * this.omega;
        var hoo = deltaTime * oo;
        var hhoo = deltaTime * hoo;
        var detInv = 1 / (f + hhoo);

        this.detX.set(this.position).mult(f);
        this.detX.add(p5.Vector.mult(this.velocity, deltaTime));
        this.detX.add(p5.Vector.mult(this.target, hhoo));

        this.detV.set(this.target).sub(this.position).mult(hoo);
        this.detV.add(this.velocity);

        this.detX.mult(detInv);
        this.position.set(this.detX);

        this.detV.mult(detInv);
        this.velocity.set(this.detV);

        return this.position;
    }
}

class SpringNumber extends Spring {
    /**
     * @param {Number} omega - The angular frequency in radians per second.
     * @param {Number} zeta - The damping ratio of the spring.
     */
    constructor(omega = 0, zeta = 0) {
        super(omega, zeta)

        this.position = 0;
        this.velocity = 0;
        this.target = 0;
    }

    step(deltaTime) {
        // Implicit method
        var f = 1 + 2 * deltaTime * this.zeta * this.omega;
        var oo = this.omega * this.omega;
        var hoo = deltaTime * oo;
        var hhoo = deltaTime * hoo;
        var detInv = 1 / (f + hhoo);
        var detX = f * this.position + deltaTime * this.velocity + hhoo * this.target;
        var detV = this.velocity + hoo * (this.target - this.position);
        this.position = detX * detInv;
        this.velocity = detV * detInv;

        return this.position;
    }
}