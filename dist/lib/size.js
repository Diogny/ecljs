"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dab_1 = require("./dab");
class Size {
    constructor(width, height) {
        this.width = parseFloat(width); //ensure it's a number
        this.height = parseFloat(height);
    }
    clone() { return new Size(this.width, this.height); }
    round() {
        this.width = Math.round(this.width);
        this.height = Math.round(this.height);
        return this;
    }
    static create(size) {
        return new Size(size.width, size.height);
    }
    /**
     * @description parse an string into an (x,y) Size
     * @param value string in the for "width, height"
     */
    static parse(value) {
        let arr = value.split(",");
        if (arr.length == 2 && dab_1.isNumeric(arr[0]) && dab_1.isNumeric(arr[1])) {
            return new Size(parseInt(arr[0]), parseInt(arr[1]));
        }
        //invalid size
    }
    /**
     * returns string of a Size oobject
     * @param options  0 = width,height	1 = parenthesis	2 = short variables w: width, h: height	4 = long variables (width: width, height: height)
     */
    toString(options) {
        let pars = ((options = options | 0) & 1) != 0, shortVars = (options & 2) != 0, longVars = (options & 4) != 0, width = () => shortVars ? "w: " : longVars ? "width: " : "", height = () => shortVars ? "h: " : longVars ? "height: " : "";
        return `${pars ? "(" : ""}${width()}${dab_1.round(this.width, 1)}, ${height()}${dab_1.round(this.height, 1)}${pars ? ")" : ""}`;
    }
}
exports.default = Size;
Size.empty = new Size(0, 0);
