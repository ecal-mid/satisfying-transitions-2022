'use strict';

/**
 * @param {Number} omega - The angular frequency in radians per second.
 * @param {Number} zeta - The damping ratio of the spring.
 */


class Spring {
    constructor({ frequency, halfLife, position, target, wrap }) {

        this.omega = 0;
        this.zeta = 0;

        if (frequency)
            this.frequency = frequency

        if (halfLife)
            this.halfLife = halfLife

        this.position = position || 0;
        this.velocity = 0;
        this.target = target || position || 0;
        this.wrap = wrap
    }

    step(deltaTime) {

        if (this.wrap !== undefined) {
            let distToTarget = this.target - this.position
            if (distToTarget > this.wrap)
                distToTarget %= this.wrap

            if (distToTarget > this.wrap / 2)
                distToTarget -= this.wrap
            this.target = this.position + distToTarget
        }

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