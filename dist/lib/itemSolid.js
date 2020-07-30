"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const itemsBoard_1 = tslib_1.__importDefault(require("./itemsBoard"));
const rect_1 = tslib_1.__importDefault(require("./rect"));
const size_1 = tslib_1.__importDefault(require("./size"));
const point_1 = tslib_1.__importDefault(require("./point"));
//ItemBoard->ItemSolid->EC
class ItemSolid extends itemsBoard_1.default {
    constructor(circuit, options) {
        super(circuit, options);
        //I've to set new properties always, because super just copy defaults()
        //later override method propertyDefaults()
        this.settings.rotation = point_1.default.validateRotation(options.rotation);
    }
    get rotation() { return this.settings.rotation; }
    rotate(value) {
        if (this.settings.rotation != (value = point_1.default.validateRotation(value))) {
            //set new value
            this.settings.rotation = value;
            //trigger property changed if applicable
            this.onProp && this.onProp({
                id: `#${this.id}`,
                value: this.rotation,
                prop: "rotate",
                where: 1 //signals it was a change inside the object
            });
        }
        return this;
    }
    rect() {
        let size = size_1.default.create(this.box), p = this.p;
        if (this.rotation) {
            //rotate (0,0) (width,0) (width,height) (0,height) and get the boundaries respectivelly to the location (x,y)
            let origin = this.origin, angle = -this.rotation, points = [[0, 0], [size.width, 0], [0, size.height], [size.width, size.height]]
                .map(p => new point_1.default(p[0], p[1]).rotateBy(origin.x, origin.y, angle)), x = Math.min.apply(Math, points.map(a => a.x)), y = Math.min.apply(Math, points.map(a => a.y)), w = Math.max.apply(Math, points.map(a => a.x)), h = Math.max.apply(Math, points.map(a => a.y));
            return new rect_1.default(Math.round(p.x + x), Math.round(p.y + y), Math.round(w - x), Math.round(h - y));
        }
        return new rect_1.default(p.x, p.y, size.width, size.height);
    }
}
exports.default = ItemSolid;
