// Constants
const POINT_SIZE = 4;
const MAX_POINTS = 5;

let q_tree = null;
let points_to_highlight = [];
let display_co_ordinates = false;
let modes = {
    INSERT: false,
    DELETE: false,
    QUERY: false,
};

let rect_points = {
    x: 0,
    y: 0,
    x1: 0,
    y1: 0,
};

function setup() {
    createCanvas(windowWidth, windowHeight);
    // createCanvas(600, 600);

    q_tree = new QuadTree(new Rectangle(0, 0, width, height), POINT_SIZE);

    for (let i = 0; i < MAX_POINTS; i++) {
        let p = new Point(random(width), random(height));

        p, q_tree.insert(p);
    }
}


function drawRect() {
    stroke(214, 255, 200);
    strokeWeight(2);
    noFill();
    rectMode(CORNER);

    rect(rect_points.x,
        rect_points.y,
        rect_points.x1 - rect_points.x,
        rect_points.y1 - rect_points.y);
}

let mouse_pressed = false;

function mousePressed() {
    if (mouseButton == LEFT && modes.INSERT) {
        // Add a new point
        let p = new Point(mouseX, mouseY);

        q_tree.insert(p);
    }

    // If the right mouse button is pressed, remove the point
    if (mouseButton == LEFT && modes.DELETE) {
        let p = new Point(mouseX, mouseY);

        q_tree.remove(p);
    }


    // Highlight points
    points_to_highlight = [];

    if (modes.QUERY) {
        if (mouse_pressed) {
            rect_points.x = 0;
            rect_points.y = 0;
            rect_points.x1 = 0;
            rect_points.y1 = 0;

            return;
        }

        rect_points.x = mouseX;
        rect_points.y = mouseY;
        mouse_pressed = true;
    }
}

function mouseDragged() {
    points_to_highlight = [];

    if (modes.QUERY) {
        if (!mouse_pressed) {
            rect_points.x = 0;
            rect_points.y = 0;
            rect_points.x1 = 0;
            rect_points.y1 = 0;

            return;
        }

        rect_points.x1 = mouseX;
        rect_points.y1 = mouseY;
    }
}

function mouseReleased() {

    if (modes.QUERY) {
        points_to_highlight = [];
        rect_points.x1 = mouseX;
        rect_points.y1 = mouseY;

        mouse_pressed = false;

        // Make sure the points are in the right order
        if (rect_points.x > rect_points.x1) {
            let tmp = rect_points.x;
            rect_points.x = rect_points.x1;
            rect_points.x1 = tmp;
        }

        if (rect_points.y > rect_points.y1) {
            let tmp = rect_points.y;
            rect_points.y = rect_points.y1;
            rect_points.y1 = tmp;
        }

        // Query the quadtree
        let range = new Rectangle(
            rect_points.x,
            rect_points.y,
            rect_points.x1 - rect_points.x,
            rect_points.y1 - rect_points.y
        );

        points_to_highlight = q_tree.query(range);
    }
}

function mouseMoved() {
    points_to_highlight = [];

    if (modes.QUERY) {
        if (mouse_pressed) {
            rect_points.x1 = mouseX;
            rect_points.y1 = mouseY;
        }

        // Query the quadtree
        let range = new Rectangle(
            rect_points.x,
            rect_points.y,
            rect_points.x1 - rect_points.x,
            rect_points.y1 - rect_points.y
        );

        points_to_highlight = q_tree.query(range);
    }
}


// Add key interactions
function keyPressed() {
    if (key == 'r' || key == 'R') {
        // Reset the quadtree
        q_tree.clear();
        points_to_highlight = [];

        // Reset the rectangle
        rect_points.x = 0;
        rect_points.y = 0;
        rect_points.x1 = 0;
        rect_points.y1 = 0;

        // Add new points
        for (let i = 0; i < MAX_POINTS; i++) {
            let p = new Point(random(width), random(height));

            p, q_tree.insert(p);
        }
    }

    if (key == 't' || key == 'T') {
        // Toggle the display of co-ordinates
        display_co_ordinates = !display_co_ordinates;
    }

    if (key == 'i' || key == 'I') {
        // Toggle the insert mode
        modes.INSERT = !modes.INSERT;

        // Set all the other modes to false
        if (modes.INSERT) {
            modes.QUERY = false;
            modes.DELETE = false;
        }
    }

    if (key == 'q' || key == 'Q') {
        // Toggle the query mode
        modes.QUERY = !modes.QUERY;

        if (!modes.QUERY) {
            points_to_highlight = [];
            mouse_pressed = false;

            // Reset the rectangle
            rect_points.x = 0;
            rect_points.y = 0;
            rect_points.x1 = 0;
            rect_points.y1 = 0;
        }

        // Set all the other modes to false
        if (modes.QUERY) {
            modes.INSERT = false;
            modes.DELETE = false;
        }
    }

    if (key == 'd' || key == 'D') {
        // Toggle the remove mode
        modes.DELETE = !modes.DELETE;

        // Set all the other modes to false
        if (modes.DELETE) {
            modes.INSERT = false;
            modes.QUERY = false;
        }
    }

    // If escape is pressed, set all the modes to false
    if (keyCode == ESCAPE) {
        modes.INSERT = false;
        modes.QUERY = false;
        modes.DELETE = false;

        // Reset the rectangle
        rect_points.x = 0;
        rect_points.y = 0;
        rect_points.x1 = 0;
        rect_points.y1 = 0;

        points_to_highlight = [];
        mouse_pressed = false;
    }

}


function draw() {
    // Set the background
    background(51);

    // Draw the quadtree
    q_tree.show();

    // Draw the rectangle
    drawRect();

    for (let p of points_to_highlight) {
        // Highlight the points
        stroke(255, 0, 255);
        strokeWeight(4);
        point(p.x, p.y);

        if (!display_co_ordinates) {
            continue;
        }

        // Write co-ordinates of the point next to it
        strokeWeight(1);
        stroke(255);
        fill(255);
        textSize(12);
        text(`${Math.round(p.x * 100) / 100}, ${Math.round(p.y * 100) / 100}`, p.x + 10, p.y);
    }

    // Display the current mode by default none is the current mode
    let current_mode = 'None';

    if (modes.INSERT) {
        current_mode = 'Insert';
    } else if (modes.QUERY) {
        current_mode = 'Query';
    } else if (modes.DELETE) {
        current_mode = 'Delete';
    }

    strokeWeight(1);
    stroke(255);
    fill(255);
    textSize(12);
    text(`Mode: ${current_mode}`, 20, 20);

}