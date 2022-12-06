let ease, easePos;
let grow = false



function setup() {
    createCanvas(windowWidth, windowHeight)

    ease = new Easing({
        duration: 1000,
        from: 1,
        // to: 3,
        easing: EASINGS.easeInOutQuad
    })

    easePos = new Easing({
        duration: 1000,
        from: 0,
        to: 300,
        easing: EASINGS.easeInOutQuad
    })

    ease.onEnd = function () {
        console.log('ended!');
    }

    ease.onUpdate = function (value) {
        // console.log(value);‚
    }
}

function draw() {
    clear()
    const value = ease.update(deltaTime)
    const pos = easePos.update(deltaTime)


    translate(width / 2 + pos, height / 2)
    scale(value)

    ellipse(0, 0, 100)
}

function mousePressed() {

    grow = !grow;

    let to
    if (grow) {
        to = 3
    } else {
        to = 1
    }
    // let to = grow ? 3 : 1

    ease.start({
        to: to,
    })

    easePos.start()


    // console.log(ease.params.from);
}