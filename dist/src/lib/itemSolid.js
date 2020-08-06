"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const dab_1 = require("./dab");
const utils_1 = require("./utils");
const rect_1 = tslib_1.__importDefault(require("./rect"));
const size_1 = tslib_1.__importDefault(require("./size"));
const point_1 = tslib_1.__importDefault(require("./point"));
const itemsBoard_1 = tslib_1.__importDefault(require("./itemsBoard"));
//ItemBoard->ItemSolid->EC
class ItemSolid extends itemsBoard_1.default {
    constructor(container, options) {
        super(container, options);
        this.g.innerHTML = this.base.data;
        //I've to set new properties always, because super just copy defaults()
        //later override method propertyDefaults()
        this.settings.rotation = point_1.default.validateRotation(options.rotation);
        let createText = (attr, text) => {
            let svgText = utils_1.tag("text", "", attr);
            return svgText.innerHTML = text, svgText;
        };
        //for labels in N555, 7408, Atmega168
        if (this.base.meta.label) {
            dab_1.aCld(this.g, createText({
                x: this.base.meta.label.x,
                y: this.base.meta.label.y,
                "class": this.base.meta.label.class
            }, this.base.meta.label.text));
        }
    }
    get last() { return this.base.meta.nodes.list.length - 1; }
    get count() {
        return this.base.meta.nodes.list.length;
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
        return this.refresh();
    }
    move(x, y) {
        super.move(x, y);
        return this.refresh();
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
    valid(node) {
        return !!this.getNode(node);
    }
    nodeHighlightable(name) {
        return this.valid(name); //for now all valid nodes are highlightables
    }
    findNode(p) {
        let dx = p.x - this.x, dy = p.y - this.y, rotation = -this.rotation, origin = this.origin;
        for (let i = 0, list = this.base.meta.nodes.list, meta = list[i], len = list.length; i < len; meta = list[++i]) {
            let nodePoint = this.rotation
                ? point_1.default.prototype.rotateBy.call(meta, origin.x, origin.y, rotation)
                : meta;
            //radius 5 =>  5^2 = 25
            if ((Math.pow(dx - nodePoint.x, 2) + Math.pow(dy - nodePoint.y, 2)) <= 81)
                return i;
        }
        return -1;
    }
    overNode(p, ln) {
        for (let i = 0, len = this.count; i < len; i++) {
            let pin = this.getNode(i);
            if (this.rotation) {
                pin.x = Math.round(pin.rot.x);
                pin.y = Math.round(pin.rot.y);
            }
            //radius 5 =>  5^2 = 25
            if ((Math.pow((p.x - this.x) - pin.x, 2) + Math.pow((p.y - this.y) - pin.y, 2)) <= 81)
                return i;
        }
        return -1;
    }
    nodeRefresh(node) {
        let bond = this.nodeBonds(node), pos = this.getNode(node);
        pos && bond && bond.to.forEach((d) => {
            let ic = this.container.get(d.id), p = point_1.default.plus(this.p, this.rotation ? pos.rot : pos).round();
            ic && ic.setNode(d.ndx, p); //no transform
        });
        return this;
    }
    refresh() {
        let attrs = {
            transform: `translate(${this.x} ${this.y})`
        }, center = this.origin;
        if (this.rotation) {
            attrs.transform += ` rotate(${this.rotation} ${center.x} ${center.y})`;
        }
        dab_1.attr(this.g, attrs);
        utils_1.each(this.bonds, (b, key) => {
            this.nodeRefresh(key);
        });
        return this;
    }
    //this returns (x, y) relative to the EC location
    getNode(pinNode) {
        let pin = this.base.meta.nodes.list[pinNode], rotate = (obj, rotation, center) => {
            if (!rotation)
                return obj;
            let rot = obj.rotateBy(center.x, center.y, -rotation);
            return new point_1.default(rot.x, rot.y);
        };
        if (!pin)
            return null;
        pin.rot = rotate(new point_1.default(pin.x, pin.y), this.rotation, this.origin);
        //
        return dab_1.obj(pin);
    }
    getNodeRealXY(node) {
        let pos = this.getNode(node);
        return pos ? point_1.default.plus(this.p, this.rotation ? pos.rot : pos).round() : null;
    }
}
exports.default = ItemSolid;
