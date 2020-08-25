"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dab_1 = require("./dab");
var Size = /** @class */ (function () {
    function Size(width, height) {
        this.width = Math.round(width);
        this.height = Math.round(height);
    }
    Size.prototype.clone = function () { return new Size(this.width, this.height); };
    Size.prototype.equal = function (size) { return this.width == size.width && this.height == size.height; };
    Object.defineProperty(Size.prototype, "positive", {
        /**
         * @description returns true if both width & height are positive
         */
        get: function () { return this.width >= 0 && this.height >= 0; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Size, "empty", {
        get: function () { return new Size(0, 0); },
        enumerable: false,
        configurable: true
    });
    Size.create = function (size) {
        return new Size(size.width, size.height);
    };
    /**
     * @description parse an string into an (x,y) Size
     * @param value string in the for "width, height"
     */
    Size.parse = function (value) {
        var numbers = dab_1.parse(value, 2);
        return numbers && new Size(numbers[0], numbers[1]);
    };
    /**
     * returns string of a Size oobject
     * @param options  0 = width,height	1 = parenthesis	2 = short variables w: width, h: height	4 = long variables (width: width, height: height)
     */
    Size.prototype.toString = function (options) {
        var pars = ((options = options | 0) & 1) != 0, shortVars = (options & 2) != 0, longVars = (options & 4) != 0, width = function () { return shortVars ? "w: " : longVars ? "width: " : ""; }, height = function () { return shortVars ? "h: " : longVars ? "height: " : ""; };
        return "" + (pars ? "(" : "") + width() + dab_1.round(this.width, 1) + ", " + height() + dab_1.round(this.height, 1) + (pars ? ")" : "");
    };
    Object.defineProperty(Size.prototype, "str", {
        get: function () { return this.width + ", " + this.height; },
        enumerable: false,
        configurable: true
    });
    return Size;
}());
exports.default = Size;
