"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const dab_1 = require("./dab");
const utils_1 = require("./utils");
const types_1 = require("./types");
const point_1 = tslib_1.__importDefault(require("./point"));
const itemSolid_1 = tslib_1.__importDefault(require("./itemSolid"));
const label_1 = tslib_1.__importDefault(require("./label"));
class EC extends itemSolid_1.default {
    constructor(circuit, options) {
        super(circuit, options);
        this.g.innerHTML = this.base.data;
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
        //add node labels for DIP packages
        if (this.base.meta.nodes.createLabels) {
            let pins = this.count / 2;
            for (let y = 55, x = 7, i = 0, factor = 20; y > 0; y -= 44, x += (factor = -factor))
                for (let col = 0; col < pins; col++, i++, x += factor)
                    dab_1.aCld(this.g, createText({ x: x, y: y }, i + ""));
        }
        //create label if defined
        if (this.base.meta.labelId) {
            this.labelSVG = new label_1.default({
                fontSize: 15,
                x: this.base.meta.labelId.x,
                y: this.base.meta.labelId.y
            });
            this.labelSVG.setText(this.label);
        }
        this.refresh();
        //signal component creation
        this.onProp && this.onProp({
            id: `#${this.id}`,
            args: {
                id: this.id,
                name: this.name,
                x: this.x,
                y: this.y,
                rotation: this.rotation
            },
            method: 'create',
            where: 1 //signals it was a change inside the object
        });
    }
    get last() { return this.base.meta.nodes.list.length - 1; }
    get type() { return types_1.Type.EC; }
    get count() {
        return this.base.meta.nodes.list.length;
    }
    rotate(value) {
        super.rotate(value);
        return this.refresh();
    }
    move(x, y) {
        super.move(x, y);
        return this.refresh();
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
        if (this.labelSVG) {
            let pos = point_1.default.plus(this.p, this.labelSVG.p);
            attrs = {
                transform: `translate(${pos.x} ${pos.y})`
            };
            this.rotation && (center = point_1.default.minus(point_1.default.plus(this.p, center), pos),
                attrs.transform += ` rotate(${this.rotation} ${center.x} ${center.y})`);
            dab_1.attr(this.labelSVG.g, attrs);
        }
        return this;
    }
    nodeRefresh(node) {
        let bond = this.nodeBonds(node), pos = this.getNode(node);
        pos && bond && bond.to.forEach((d) => {
            let ic = this.circuit.get(d.id), p = point_1.default.plus(this.p, this.rotation ? pos.rot : pos).round();
            ic && ic.setNode(d.ndx, p); //no transform
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
    setNode(node, p) {
        //Some code tries to call this, investigate later...
        throw 'somebody called me, not good!';
    }
    valid(node) {
        return !!this.getNode(node);
    }
    nodeHighlightable(name) {
        return this.valid(name); //for now all valid nodes are highlightables
    }
    setVisible(value) {
        super.setVisible(value);
        this.labelSVG && this.labelSVG.setVisible(value);
        return this;
    }
    remove() {
        var _a;
        //delete label if any first
        this.labelSVG && ((_a = this.g.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(this.labelSVG.g));
        super.remove();
    }
    afterDOMinserted() {
        this.labelSVG && (this.g.insertAdjacentElement("afterend", this.labelSVG.g), this.labelSVG.setVisible(true));
    }
    propertyDefaults() {
        return dab_1.extend(super.propertyDefaults(), {
            class: "ec",
        });
    }
}
exports.default = EC;