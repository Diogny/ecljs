"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const dom_1 = require("dabbjs/dist/lib/dom");
const misc_1 = require("dabbjs/dist/lib/misc");
const point_1 = (0, tslib_1.__importDefault)(require("dabbjs/dist/lib/point"));
const size_1 = (0, tslib_1.__importDefault)(require("dabbjs/dist/lib/size"));
const rect_1 = (0, tslib_1.__importDefault)(require("dabbjs/dist/lib/rect"));
const itemsBoard_1 = (0, tslib_1.__importDefault)(require("./itemsBoard"));
const extra_1 = require("./extra");
//ItemBoard->ItemSolid->EC
class ItemSolid extends itemsBoard_1.default {
    constructor(container, options) {
        options.rot = point_1.default.validateRotation(options.rot);
        super(container, options);
    }
    get last() { return this.base.meta.nodes.list.length - 1; }
    get count() { return this.base.meta.nodes.list.length; }
    get rot() { return this.$.rot; }
    /**
     * @description sets rotation of this component to this amount 0-360°
     * @param value 0-360° number value
     */
    rotate(value) {
        if (this.$.rot != (value = point_1.default.validateRotation(value))) {
            this.$.rot = value;
            this.onProp && this.onProp({
                id: `#${this.id}`,
                code: 4 // "rotate" code: 4
            });
        }
        return this.refresh();
    }
    rect() {
        let size = size_1.default.create(this.box), p = this.p;
        if (this.rot) {
            //rotate (0,0) (width,0) (width,height) (0,height) and get the boundaries respectivelly to the location (x,y)
            let origin = this.origin, angle = -this.rot, points = [[p.x, p.y], [p.x + size.width, p.y], [p.x, p.y + size.height], [p.x + size.width, p.y + size.height]]
                .map(p => point_1.default.rotateBy(p[0], p[1], origin.x, origin.y, angle)), x = Math.min.apply(Math, points.map(a => a.x)), y = Math.min.apply(Math, points.map(a => a.y)), w = Math.max.apply(Math, points.map(a => a.x)), h = Math.max.apply(Math, points.map(a => a.y));
            return new rect_1.default(Math.round(x), Math.round(y), Math.round(w - x), Math.round(h - y));
        }
        return new rect_1.default(p.x, p.y, size.width, size.height);
    }
    refresh() {
        let attrs = {
            transform: `translate(${this.x} ${this.y})`
        }, center = this.origin;
        if (this.rot) {
            attrs.transform += ` rotate(${this.rot} ${center.x} ${center.y})`;
        }
        (0, dom_1.attr)(this.g, attrs);
        //check below
        (0, misc_1.each)(this.bonds, (_b, key) => {
            this.nodeRefresh(key);
        });
        return this;
    }
    /**
     * @description returns the node information
     * @param node 0-based pin/node number
     * @param onlyPoint true to get internal rotated point only without transformations
     *
     * this returns (x, y) relative to the EC location
     */
    node(node, nodeOnly) {
        let pin = (0, extra_1.pinInfo)(this.base.meta.nodes.list, node);
        if (!pin)
            return;
        if (!nodeOnly) {
            if (this.rot) {
                let center = this.origin, rot = point_1.default.rotateBy(pin.x, pin.y, center.x, center.y, -this.rot);
                pin.x = rot.x;
                pin.y = rot.y;
            }
            pin.x += this.x;
            pin.y += this.y;
        }
        return pin;
    }
    defaults() {
        return (0, misc_1.extend)(super.defaults(), {
            rot: 0,
        });
    }
}
exports.default = ItemSolid;
//# sourceMappingURL=itemSolid.js.map