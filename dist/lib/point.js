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
    Point.prototype.distance = function (p) {
        var dx = this.x - p.x;
        var dy = this.y - p.y;
        return Math.sqrt(dx * dx + dy * dy);
    };
    Point.prototype.clone = function () { return new Point(this.x, this.y); };
    Point.prototype.add = function (x, y) { return new Point(this.x + x, this.y + y); };
    Point.prototype.mul = function (x, y) { return new Point(this.x * x, this.y * y); };
    /**
     * @description returns string of a Point oobject
     * @param options 0 = x,y	1 = parenthesis; 	2 = variables x: x, y: y
     */
    Point.prototype.toString = function (options) {
        var vars = ((options = options | 0) & 2) != 0, pars = (options & 1) != 0;
        return "" + (pars ? "(" : "") + (vars ? "x: " : "") + dab_1.round(this.x, 1) + ", " + (vars ? "y: " : "") + dab_1.round(this.y, 1) + (pars ? ")" : "");
    };
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
     * @description rotate (x,y) through center (x,y) by an angle
     * @param {number} cx center x
     * @param {number} cy center y
     * @param {number} angle angle to rotate
     */
    Point.prototype.rotateBy = function (cx, cy, angle) {
        var radians = (Math.PI / 180) * angle, cos = Math.cos(radians), sin = Math.sin(radians), nx = (cos * (this.x - cx)) + (sin * (this.y - cy)) + cx, ny = (cos * (this.y - cy)) - (sin * (this.x - cx)) + cy;
        return new Point(nx, ny); //round(nx, 3), round(ny, 3)
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
        var arr = value.split(",");
        if (arr.length == 2 && dab_1.isNumeric(arr[0]) && dab_1.isNumeric(arr[1])) {
            return new Point(parseInt(arr[0]), parseInt(arr[1]));
        }
        //invalid point
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
