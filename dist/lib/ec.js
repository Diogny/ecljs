"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const interfaces_1 = require("./interfaces");
const dab_1 = require("./dab");
const utils_1 = require("./utils");
const point_1 = tslib_1.__importDefault(require("./point"));
const itemSolid_1 = tslib_1.__importDefault(require("./itemSolid"));
const label_1 = tslib_1.__importDefault(require("./label"));
class EC extends itemSolid_1.default {
    constructor(circuit, options) {
        super(circuit, options);
        let createText = (attr, text) => {
            let svgText = utils_1.tag("text", "", attr);
            return svgText.innerHTML = text, svgText;
        };
        //add node labels for DIP packages
        if (this.base.meta.nodes.createLabels) {
            let pins = this.count / 2;
            for (let y = 55, x = 7, i = 0, factor = 20; y > 0; y -= 44, x += (factor = -factor))
                for (let col = 0; col < pins; col++, i++, x += factor)
                    dab_1.aCld(this.g, createText({ x: x, y: y }, i + ""));
        }
        //create label if defined
        if (this.base.meta.labelId) {
            this.settings.boardLabel = new label_1.default({
                fontSize: 15,
                x: this.base.meta.labelId.x,
                y: this.base.meta.labelId.y
            });
            this.boardLabel.setText(this.label);
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
    get type() { return interfaces_1.Type.EC; }
    get boardLabel() { return this.settings.boardLabel; }
    refresh() {
        super.refresh();
        if (this.boardLabel) {
            let pos = point_1.default.plus(this.p, this.boardLabel.p), center = this.origin, attrs = {
                transform: `translate(${pos.x} ${pos.y})`
            };
            this.rotation && (center = point_1.default.minus(point_1.default.plus(this.p, center), pos),
                attrs.transform += ` rotate(${this.rotation} ${center.x} ${center.y})`);
            dab_1.attr(this.boardLabel.g, attrs);
        }
        return this;
    }
    setNode(node, p) {
        //Some code tries to call this, investigate later...
        throw 'somebody called me, not good!';
    }
    setVisible(value) {
        super.setVisible(value);
        this.boardLabel && this.boardLabel.setVisible(value);
        return this;
    }
    remove() {
        var _a;
        //delete label if any first
        this.boardLabel && ((_a = this.g.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(this.boardLabel.g));
        super.remove();
    }
    afterDOMinserted() {
        this.boardLabel && (this.g.insertAdjacentElement("afterend", this.boardLabel.g), this.boardLabel.setVisible(true));
    }
    propertyDefaults() {
        return dab_1.extend(super.propertyDefaults(), {
            class: "ec",
            boardLabel: void 0
        });
    }
}
exports.default = EC;
