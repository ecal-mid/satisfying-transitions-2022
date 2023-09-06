class Edge {
    constructor(from, to) {
        this.start = from.copy();
        this.end = to.copy();
    }

    collide(pos, radius) {
        push();

        const { start, end } = this

        const vec = p5.Vector.sub(end, start);
        const secondV = p5.Vector.sub(pos, start)

        const projection = createProjection(vec, secondV);
        const projectionClamp = createProjection(vec, secondV, true);
        const subtraction = p5.Vector.sub(secondV, projectionClamp);
        const distance = subtraction.mag();

        noFill()
        stroke(255)

        translate(start.x, start.y);

        const normalVector = createNormalTo(vec);

        push();
        translate(projectionClamp.x, projectionClamp.y);

        // drawGrayVector(subtraction, 1, 20);
        pop()

        if (subtraction.mag() < 0.0001) {
            subtraction.set(projectionClamp.copy().rotate(-HALF_PI).setMag(radius))
        }

        const isVisible = (projectionClamp.mag() > 0 && projection.mag() < vec.mag())
        const isInside = secondV.dot(normalVector) > 1
        const isTouching = subtraction.mag() < radius

        if (isInside && isVisible) {
            subtraction.setMag(radius);
            subtraction.reflect(normalVector);
        }

        if (isTouching) {
            subtraction.setMag(radius);
        }

        pop();
        return { pos: p5.Vector.add(subtraction, projectionClamp).add(start), distance }
    }
}

function createProjection(base, toProject, clamp) {
    const normalized = base.copy().normalize();
    let angle = toProject.dot(normalized)
    let projection

    if (clamp) {
        angle = max(0, angle);
        projection = normalized.mult(angle).limit(base.mag())
    } else {
        projection = normalized.mult(angle)
    }

    return projection
}

function createNormalTo(vector) {
    const perpAngle = Math.atan2(vector.x, -vector.y)
    return p5.Vector.fromAngle(perpAngle, vector.mag());
}

function getBoundsIntercept(vector) {
    //assumes vector origin is at center of bounds.
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    //console.log("vector", vector.x, vector.y);
    const slope = vector.y / vector.x;
    let testX = halfWidth;
    if (vector.x < 0) {
        testX *= -1;
    }
    const heightIntercept = slope * (testX);
    //console.log(slope, testX, heightIntercept);
    if (heightIntercept <= halfHeight && heightIntercept >= -halfHeight) {
        //console.log("intercepts vertical at",heightIntercept);
        return createVector(testX, heightIntercept);
    }
    let testY = halfHeight;
    if (vector.y < 0) {
        testY *= -1;
    }
    const widthIntercept = testY / slope;
    //console.log(testY, widthIntercept);
    if (widthIntercept <= halfWidth && widthIntercept >= -halfWidth) {
        //console.log("intercepts horizontal at", widthIntercept);
        return createVector(widthIntercept, testY);
    }
    return vector;
}

//----------------------------------------------  DRAWING FUNCTIONS
function drawBoundsInterceptVectors(vector, weight, brightness) {
    let drawThis = getBoundsIntercept(vector);
    drawGrayVector(drawThis, weight, brightness);
    //draw the inverse vector.
    drawGrayVector(createVector(-drawThis.x, -drawThis.y), weight, brightness);
}

function drawVector(vector, weight, hue) {
    push();
    strokeWeight(weight);
    stroke(hue, 60, 80);
    line(0, 0, vector.x, vector.y);
    translate(vector.x, vector.y);
    rotate(vector.heading());
    const arrowTip = 8;
    line(0, 0, -arrowTip, -arrowTip / 2);
    line(0, 0, -arrowTip, arrowTip / 2);
    pop();
}

function drawGrayVector(vector, weight, brightness) {
    push();
    strokeWeight(weight);
    stroke(0, 0, brightness);
    line(0, 0, vector.x, vector.y);
    translate(vector.x, vector.y);
    rotate(vector.heading());
    const arrowTip = 8;
    line(0, 0, -arrowTip, -arrowTip / 2);
    line(0, 0, -arrowTip, arrowTip / 2);
    pop();
}

function drawBackground(baseVector, second) {
    //assume canvas is translated to base of base vector

    //works because canvas is square. 
    let horizonLength = width * Math.SQRT2;
    let horizonHeight = height / 2 * Math.SQRT2;

    let normalVector = createNormalTo(baseVector);

    push();
    rotate(baseVector.heading());

    //If the dot product of the rotating vector("second") and the 
    //normal of the baseVector (the vector pointing 90 deg from it)
    //is negative it means the rotating vector and the normal are
    //facing in opposite directions. In this case it doesn't matter
    //how much. We just want to know what orientation the
    //background should be in. 
    //
    if (second.dot(normalVector) < 0) {
        horizonHeight *= -1;
    }

    //A bit sloppy, rects protrude from canvas. 
    noStroke();
    fill(0, 0, 60);
    rect(-horizonLength / 2, -horizonHeight, horizonLength, horizonHeight);
    fill(0, 0, 70);
    rect(-horizonLength / 2, horizonHeight, horizonLength, -horizonHeight);
    pop();
}
