"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dab_1 = require("./dab");
var Rect = /** @class */ (function () {
    function Rect(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    Object.defineProperty(Rect.prototype, "empty", {
        get: function () { return this.width < 0 || this.height < 0; },
        enumerable: false,
        configurable: true
    });
    Rect.prototype.inside = function (p) {
        return p.x >= this.x && p.y >= this.y && p.x <= (this.x + this.width) && p.y <= (this.y + this.height);
        // Point.inside(Point.minus(p, this.location), this.size)
    };
    //later reverse this, so this is modified, not r
    Rect.prototype.intersect = function (r) {
        var nx = Math.max(this.x, r.x), ny = Math.max(this.y, r.y);
        r.width = Math.min((this.x + this.width), (r.x + r.width)) - nx;
        r.height = Math.min((this.y + this.height), (r.y + r.height)) - ny;
        r.x = nx;
        r.y = ny;
        return !r.empty;
    };
    Rect.prototype.clone = function () { return Rect.create(this); };
    Rect.prototype.contains = function (r) {
        return r.x >= this.x
            && r.y >= this.y
            && (r.x + r.width <= this.x + this.width)
            && (r.y + r.height <= this.y + this.height);
    };
    Rect.prototype.add = function (r) {
        var nx = Math.min(this.x, r.x), ny = Math.min(this.y, r.y);
        this.x = nx;
        this.y = ny;
        this.width = Math.max(this.x + this.width, r.x + r.width) - nx;
        this.height = Math.max(this.y + this.height, r.y + r.height) - ny;
        return this;
    };
    Rect.prototype.move = function (x, y) {
        this.x = x | 0;
        this.y = y | 0;
    };
    /**
     * @description grow/shrink rectangle
     * @param dx left & right growth
     * @param dy top & bottom growth
     */
    Rect.prototype.grow = function (dx, dy) {
        this.x -= (dx = dx | 0);
        this.y -= (dy = dy | 0);
        this.width += dx * 2;
        this.height += dy * 2;
        return this;
    };
    Rect.prototype.translate = function (tx, ty) {
        this.x -= (tx = tx | 0);
        this.y -= (ty = ty | 0);
        return this;
    };
    Rect.prototype.equal = function (r) { return this.x == r.x && this.y == r.y && this.width == r.width && this.height == r.height; };
    Rect.create = function (rect, toInt) {
        var r = new Rect(rect.x, rect.y, rect.width, rect.height);
        toInt && (r.x = r.x | 0, r.y = r.y | 0, r.width = r.width | 0, r.height = r.height | 0);
        return r;
    };
    Object.defineProperty(Rect, "empty", {
        get: function () { return new Rect(0, 0, 0, 0); },
        enumerable: false,
        configurable: true
    });
    /**
     * @description parse an string into an (x,y) Point
     * @param value string in the for "x, y"
     */
    Rect.parse = function (value) {
        var numbers = dab_1.parse(value, 4);
        return numbers && new Rect(numbers[0], numbers[1], numbers[2], numbers[3]);
    };
    Object.defineProperty(Rect.prototype, "str", {
        get: function () { return this.x + ", " + this.y + ", " + this.width + ", " + this.height; },
        enumerable: false,
        configurable: true
    });
    return Rect;
}());
exports.default = Rect;
