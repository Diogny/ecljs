"use strict";
//Point class is adapted from:
//https://github.com/Microsoft/TypeScriptSamples/blob/master/raytracer/raytracer.ts
Object.defineProperty(exports, "__esModule", { value: true });
var dab_1 = require("./dab");
/**
 * @description a 2 dimension integer point class
 */
var Point = /** @class */ (function () {
    function Point(x, y) {
        this.x = Math.round(x);
        this.y = Math.round(y);
    }
    /**
     * @description calculates distance from this point to another
     * @param p point
     */
    Point.prototype.distance = function (p) {
        var dx = this.x - p.x;
        var dy = this.y - p.y;
        return Math.sqrt(dx * dx + dy * dy);
    };
    /**
     * @description clones point
     */
    Point.prototype.clone = function () { return new Point(this.x, this.y); };
    /**
     * @description returns a new point shifted by (x,y) vector
     * @param x vector x
     * @param y vector y
     */
    Point.prototype.add = function (x, y) { return new Point(this.x + x, this.y + y); };
    /**
     * @description scales this point by a multiple (x,y)
     * @param x mul x
     * @param y mul y
     */
    Point.prototype.mul = function (x, y) { return new Point(this.x * x, this.y * y); };
    /**
     * @description equality comparer
     * @param p point
     */
    Point.prototype.equal = function (p) { return this.x == p.x && this.y == p.y; };
    /**
     * @description returns string of a Point oobject
     * @param options 0 = x,y	1 = parenthesis; 	2 = variables x: x, y: y
     */
    Point.prototype.toString = function (options) {
        var vars = ((options = options | 0) & 2) != 0, pars = (options & 1) != 0;
        return "" + (pars ? "(" : "") + (vars ? "x: " : "") + dab_1.round(this.x, 1) + ", " + (vars ? "y: " : "") + dab_1.round(this.y, 1) + (pars ? ")" : "");
    };
    Object.defineProperty(Point.prototype, "str", {
        get: function () { return this.x + ", " + this.y; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Point.prototype, "quadrant", {
        /**
         * @description returns quadrant of this point
         * @returns 0 (0,0); -1 (x==0 or y ==0); 1 (y>0,x>0); 2 (y>0,x<0); 3 (y<0,x<0); 4 (y<0,x>0)
         */
        get: function () {
            if (this.x == 0 || this.y == 0) {
                return (this.x == this.y) ? 0 : -1;
            }
            if (this.y > 0)
                return (this.x > 0) ? 1 : 2;
            else
                return (this.x < 0) ? 3 : 4;
        },
        enumerable: false,
        configurable: true
    });
    //get positive(): boolean { return this.x >= 0 && this.y >= 0 }
    /**
     * @description rotatea a point (x,y) through center (x,y) by an angle
     * @param {number} x x to rotate
     * @param {number} y y to rotate
     * @param {number} cx thru center x
     * @param {number} cy thru center y
     * @param {number} angle angle to rotate
     */
    Point.rotateBy = function (x, y, cx, cy, angle) {
        var radians = (Math.PI / 180) * angle, cos = Math.cos(radians), sin = Math.sin(radians), nx = (cos * (x - cx)) + (sin * (y - cy)) + cx, ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
        return { x: nx | 0, y: ny | 0 }; //round(nx, 3), round(ny, 3)
    };
    //static
    Point.validateRotation = function (val) {
        return (val = (val | 0) % 360, (val < 0) && (val += 360), val);
    };
    Object.defineProperty(Point, "origin", {
        get: function () { return new Point(0, 0); },
        enumerable: false,
        configurable: true
    });
    Point.create = function (p) {
        return new Point(p.x, p.y);
    };
    /**
     * @description parse an string into an (x,y) Point
     * @param value string in the for "x, y"
     */
    Point.parse = function (value) {
        var numbers = dab_1.parse(value, 2);
        return numbers && new Point(numbers[0], numbers[1]);
    };
    Point.scale = function (v, k) { return new Point(k * v.x, k * v.y); };
    Point.translateBy = function (v, dx, dy) { return new Point(v.x + dx, v.y + dy); };
    //static translate(v: Point, k: number): IPoint { return new Point(v.x + k, v.y + k) }
    Point.times = function (v, scaleX, scaleY) { return new Point(v.x * scaleX, v.y * scaleY); };
    Point.minus = function (v1, v2) { return new Point(v1.x - v2.x, v1.y - v2.y); };
    Point.plus = function (v1, v2) { return new Point(v1.x + v2.x, v1.y + v2.y); };
    //
    Point.inside = function (p, s) { return p.x >= 0 && p.x <= s.width && p.y >= 0 && p.y <= s.height; };
    return Point;
}());
exports.default = Point;
