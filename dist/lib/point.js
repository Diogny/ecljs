"use strict";
//Point class is adapted from:
//https://github.com/Microsoft/TypeScriptSamples/blob/master/raytracer/raytracer.ts
Object.defineProperty(exports, "__esModule", { value: true });
const dab_1 = require("./dab");
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    distance(p) {
        var dx = this.x - p.x;
        var dy = this.y - p.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    clone() { return new Point(this.x, this.y); }
    round() {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        return this;
    }
    add(x, y) {
        this.x += Math.round(x);
        this.y += Math.round(y);
        return this;
    }
    toString(options) {
        let noVars = ((options = options | 0) & 4) != 0, noPars = (options & 2) != 0;
        return `${noPars ? "" : "("}${noVars ? "" : "x: "}${dab_1.round(this.x, 1)}, ${noVars ? "" : "y: "}${dab_1.round(this.y, 1)}${noPars ? "" : ")"}`;
    }
    //get positive(): boolean { return this.x >= 0 && this.y >= 0 }
    /**
     * @description rotate (x,y) through center (x,y) by an angle
     * @param {number} cx center x
     * @param {number} cy center y
     * @param {number} angle angle to rotate
     */
    rotateBy(cx, cy, angle) {
        var radians = (Math.PI / 180) * angle, cos = Math.cos(radians), sin = Math.sin(radians), nx = (cos * (this.x - cx)) + (sin * (this.y - cy)) + cx, ny = (cos * (this.y - cy)) - (sin * (this.x - cx)) + cy;
        return new Point(nx, ny); //round(nx, 3), round(ny, 3)
    }
    //static
    static validateRotation(val) {
        return (val = (val | 0) % 360, (val < 0) && (val += 360), val);
    }
    static get origin() { return new Point(0, 0); }
    static create(p) {
        return new Point(p.x, p.y);
    }
    /**
     * @description parse an string into an (x,y) Point
     * @param value string in the for "x, y"
     */
    static parse(value) {
        let arr = value.split(",");
        if (arr.length == 2 && dab_1.isNumeric(arr[0]) && dab_1.isNumeric(arr[1])) {
            return new Point(parseInt(arr[0]), parseInt(arr[1]));
        }
        //invalid point
        return void 0;
    }
    static distance(p1, p2) {
        return p1.distance(p2);
    }
    static scale(v, k) { return new Point(k * v.x, k * v.y); }
    static translateBy(v, dx, dy) { return new Point(v.x + dx, v.y + dy); }
    //static translate(v: Point, k: number): IPoint { return new Point(v.x + k, v.y + k) }
    static times(v, scaleX, scaleY) { return new Point(v.x * scaleX, v.y * scaleY); }
    static minus(v1, v2) { return new Point(v1.x - v2.x, v1.y - v2.y); }
    static plus(v1, v2) { return new Point(v1.x + v2.x, v1.y + v2.y); }
    //
    static inside(p, s) { return p.x >= 0 && p.x <= s.width && p.y >= 0 && p.y <= s.height; }
}
exports.default = Point;
