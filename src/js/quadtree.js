class Point {
    constructor(x, y) {
        this.x = x; // x coordinate
        this.y = y; // y coordinate
    }

    show() {
        stroke(255);
        strokeWeight(4);
        point(this.x, this.y);
    }
}

class Rectangle {
    
    constructor(x, y, w, h) {
        this.x = x; // center x
        this.y = y; // center y
        this.w = w; // half width
        this.h = h; // half height

        this.left = x - w;
        this.right = x + w;
        this.top = y - h;
        this.bottom = y + h;
    }

    contains(point) {
        return (point.x >= this.left && point.x <= this.right && point.y >= this.top && point.y <= this.bottom);
    }
    

    intersects(range) {
        return !(range.left > this.right || range.right < this.left || range.top > this.bottom || range.bottom < this.top);
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
        rectMode(CENTER);
        rect(this.boundary.x, this.boundary.y, this.boundary.w * 2, this.boundary.h * 2);

        if (this.divided) {
            this.northeast.show();
            this.northwest.show();
            this.southeast.show();
            this.southwest.show();
        }

        for (let p of this.points) {
            strokeWeight(2);
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

        if (this.northeast.insert(point)) {
            return true;
        }
        
        if (this.northwest.insert(point)) {
            return true;
        }
        
        if (this.southeast.insert(point)) {
            return true;
        }
        
        if (this.southwest.insert(point)) {
            return true;
        }
    }
}
