"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const point_1 = (0, tslib_1.__importDefault)(require("dabbjs/dist/lib/point"));
const interfaces_1 = require("./interfaces");
class Item extends interfaces_1.Base {
    constructor(options) {
        //merge defaults and deep copy
        //all default properties must be refrenced from this or this.$
        // options is for custom options only
        let optionsClass = options.class;
        delete options.class;
        super(options);
        optionsClass && (this.$.class += ` ${optionsClass}`);
        this.$.x = this.$.x || 0;
        this.$.y = this.$.y || 0;
    }
    get name() { return this.$.name; }
    get id() { return this.$.id; }
    get x() { return this.$.x; }
    get y() { return this.$.y; }
    get p() { return new point_1.default(this.x, this.y); }
    get class() { return this.$.class; }
    get visible() { return this.$.visible; }
    setVisible(value) {
        this.$.visible = !!value;
        return this;
    }
    move(x, y) {
        this.$.x = x | 0;
        this.$.y = y | 0;
        return this;
    }
    movePoint(p) {
        return this.move(p.x, p.y);
    }
    translate(dx, dy) {
        return this.move(this.x + (dx | 0), this.y + (dy | 0));
    }
    defaults() {
        return {
            id: "",
            name: "",
            x: 0,
            y: 0,
            class: "",
            visible: true, //defaults is visible
        };
    }
}
exports.default = Item;
//# sourceMappingURL=item.js.map