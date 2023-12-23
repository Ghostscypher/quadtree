
let qt = null;

function setup() {
    createCanvas(windowWidth, windowHeight);

    qt = new QuadTree(new Rectangle(0, 0, width, height), 4);

    for (let i = 0; i < 100; i++) {
        let p = new Point(random(width), random(height));
        qt.insert(p);
    }

    background(51);
    qt.show();

    noLoop();
}

function draw() {
    // background(51);
}

