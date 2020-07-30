"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Rect {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    get empty() { return this.width < 0 || this.height < 0; }
    inside(p) {
        return p.x >= this.x && p.y >= this.y && p.x <= (this.x + this.width) && p.y <= (this.y + this.height);
        // Point.inside(Point.minus(p, this.location), this.size)
    }
    //later reverse this, so this is modified, not r
    intersect(r) {
        let nx = Math.max(this.x, r.x), ny = Math.max(this.y, r.y);
        r.width = Math.min((this.x + this.width), (r.x + r.width)) - nx;
        r.height = Math.min((this.y + this.height), (r.y + r.height)) - ny;
        r.x = nx;
        r.y = ny;
        return !r.empty;
    }
    clone() { return Rect.create(this); }
    contains(r) {
        return r.x >= this.x
            && r.y >= this.y
            && (r.x + r.width <= this.x + this.width)
            && (r.y + r.height <= this.y + this.height);
    }
    add(r) {
        let nx = Math.min(this.x, r.x), ny = Math.min(this.y, r.y);
        this.x = nx;
        this.y = ny;
        this.width = Math.max(this.x + this.width, r.x + r.width) - nx;
        this.height = Math.max(this.y + this.height, r.y + r.height) - ny;
    }
    move(x, y) {
        this.x = x | 0;
        this.y = y | 0;
    }
    grow(dx, dy) {
        this.x -= (dx = dx | 0);
        this.y -= (dy = dy | 0);
        this.width += dx * 2;
        this.height += dy * 2;
    }
    static create(r) { return new Rect(r.x, r.y, r.width, r.height); }
    static empty() { return new Rect(0, 0, 0, 0); }
}
exports.default = Rect;
