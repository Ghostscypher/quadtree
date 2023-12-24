class Point {
    constructor(x, y, data = null) {
        this.x = x; // x coordinate
        this.y = y; // y coordinate
        this.data = data; // additional data, useful for storing values
    }

    show() {
        stroke(255);
        strokeWeight(4);
        fill(255);
        point(this.x, this.y);
    }
}

class Rectangle {

    constructor(x, y, w, h) {
        this.x = x; // corner x
        this.y = y; // corner y
        this.w = w; // width
        this.h = h; // height

        this.left = this.x - this.w;
        this.right = this.x + this.w;
        this.top = this.y - this.h;
        this.bottom = this.y + this.h;
    }

    contains(point) {
        // Center mode
        return (
            point.x >= this.left &&
            point.x <= this.right &&
            point.y >= this.top &&
            point.y <= this.bottom
        );
    }

    contains2(point) {
        // Corner mode
        return (
            point.x >= this.x &&
            point.x <= this.x + this.w &&
            point.y >= this.y &&
            point.y <= this.y + this.h
        );
    }

    intersects(range) {
        // Corner mode
        return !(
            range.left > this.right ||
            range.right < this.left ||
            range.top > this.bottom ||
            range.bottom < this.top
        );
    }

}

class Circle {

    constructor(x, y, r) {
        this.x = x; // center x
        this.y = y; // center y
        this.r = r; // radius
        this.rSquared = this.r * this.r;
    }

    contains(point) {
        // Center mode
        let d = Math.pow((point.x - this.x), 2) + Math.pow((point.y - this.y), 2);
        return d <= this.rSquared;
    }

    contains2(point) {
        // Corner mode
        return this.contains(point);
    }

    intersects(range) {
        // Corner mode
        let xDist = Math.abs(range.x - this.x);
        let yDist = Math.abs(range.y - this.y);

        let r = this.r;

        let w = range.w;
        let h = range.h;

        let edges = Math.pow((xDist - w), 2) + Math.pow((yDist - h), 2);

        // No intersection
        if (xDist > (r + w) || yDist > (r + h)) {
            return false;
        }

        // Intersection within the circle
        if (xDist <= w || yDist <= h) {
            return true;
        }

        // Intersection on the edge of the circle
        return edges <= this.rSquared;
    }

}

class QuadTree {

    constructor(boundary, capacity = 4) {
        this.boundary = boundary;
        this.capacity = capacity;
        this.points = [];
        this.divided = false;
    }

    show() {
        stroke(255);
        strokeWeight(1);
        noFill();
        rectMode(CORNER);
        rect(this.boundary.x, this.boundary.y, this.boundary.w * 2, this.boundary.h * 2);

        if (this.divided) {
            this.northeast.show();
            this.northwest.show();
            this.southeast.show();
            this.southwest.show();
        }

        for (let p of this.points) {
            p.show();
        }
    }

    subdivide() {
        let x = this.boundary.x;
        let y = this.boundary.y;
        let w = this.boundary.w / 2;
        let h = this.boundary.h / 2;

        let ne = new Rectangle(x + w, y - h, w, h);
        this.northeast = new QuadTree(ne, this.capacity);

        let nw = new Rectangle(x - w, y - h, w, h);
        this.northwest = new QuadTree(nw, this.capacity);

        let se = new Rectangle(x + w, y + h, w, h);
        this.southeast = new QuadTree(se, this.capacity);

        let sw = new Rectangle(x - w, y + h, w, h);
        this.southwest = new QuadTree(sw, this.capacity);

        this.divided = true;
    }

    insert(point) {
        // If the point is not in the boundary, return false
        if (!this.boundary.contains(point)) {
            return false;
        }

        if (this.points.length < this.capacity) {
            this.points.push(point);

            return true;
        }

        if (!this.divided) {
            this.subdivide();
        }

        if (this.northeast.insert(point) ||
            this.northwest.insert(point) ||
            this.southeast.insert(point) ||
            this.southwest.insert(point)
        ) {
            return true;
        }

        // If we get here, something went very wrong
        return null;
    }

    remove(point) {
        // Query a circle with radius 5
        let found = this.query(new Circle(point.x, point.y, 10));

        if (found.length == 0) {
            return false;
        }

        let all_points = this.query(new Circle(point.x, point.y, Infinity));

        // Intersect all points with found so that we only have the points that are not in found
        all_points = all_points.filter(x => !found.includes(x));

        // Regenerate the quadtree
        this.clear();

        for (let p of all_points) {
            this.insert(p);
        }

        return false;
    }

    query(range, found = false) {
        if (!found) {
            found = [];
        }

        if (!this.boundary.intersects(range)) {
            return found;
        }

        for (let p of this.points) {
            if (range.contains2(p)) {
                found.push(p);
            }
        }

        if (this.divided) {
            this.northeast.query(range, found);
            this.northwest.query(range, found);
            this.southeast.query(range, found);
            this.southwest.query(range, found);
        }

        return found;
    }

    clear() {
        this.points = [];

        if (this.divided) {
            this.northeast.clear();
            this.northwest.clear();
            this.southeast.clear();
            this.southwest.clear();
        }

        this.divided = false;
    }
}