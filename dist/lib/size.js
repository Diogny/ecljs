"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dab_1 = require("./dab");
var Size = /** @class */ (function () {
    function Size(width, height) {
        this.width = parseFloat(width); //ensure it's a number
        this.height = parseFloat(height);
    }
    Size.prototype.clone = function () { return new Size(this.width, this.height); };
    Size.prototype.round = function () {
        this.width = Math.round(this.width);
        this.height = Math.round(this.height);
        return this;
    };
    Size.create = function (size) {
        return new Size(size.width, size.height);
    };
    /**
     * @description parse an string into an (x,y) Size
     * @param value string in the for "width, height"
     */
    Size.parse = function (value) {
        var arr = value.split(",");
        if (arr.length == 2 && dab_1.isNumeric(arr[0]) && dab_1.isNumeric(arr[1])) {
            return new Size(parseInt(arr[0]), parseInt(arr[1]));
        }
        //invalid size
    };
    /**
     * returns string of a Size oobject
     * @param options  0 = width,height	1 = parenthesis	2 = short variables w: width, h: height	4 = long variables (width: width, height: height)
     */
    Size.prototype.toString = function (options) {
        var pars = ((options = options | 0) & 1) != 0, shortVars = (options & 2) != 0, longVars = (options & 4) != 0, width = function () { return shortVars ? "w: " : longVars ? "width: " : ""; }, height = function () { return shortVars ? "h: " : longVars ? "height: " : ""; };
        return "" + (pars ? "(" : "") + width() + dab_1.round(this.width, 1) + ", " + height() + dab_1.round(this.height, 1) + (pars ? ")" : "");
    };
    Size.empty = new Size(0, 0);
    return Size;
}());
exports.default = Size;
