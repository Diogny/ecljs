"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const dom_1 = require("dabbjs/dist/lib/dom");
const misc_1 = require("dabbjs/dist/lib/misc");
const point_1 = (0, tslib_1.__importDefault)(require("dabbjs/dist/lib/point"));
const interfaces_1 = require("./interfaces");
const itemSolid_1 = (0, tslib_1.__importDefault)(require("./itemSolid"));
const label_1 = (0, tslib_1.__importDefault)(require("./label"));
const extra_1 = require("./extra");
const size_1 = (0, tslib_1.__importDefault)(require("dabbjs/dist/lib/size"));
class EC extends itemSolid_1.default {
    constructor(circuit, options) {
        super(circuit, options);
        this.$.size = options.size || size_1.default.parse(this.base.meta.size);
        let m = this.base.meta;
        //for labels in N555, 7408, Atmega168
        if (m.label) {
            (0, dom_1.aChld)(this.g, (0, extra_1.createText)({
                x: m.label.x,
                y: m.label.y,
                "class": m.label.class
            }, m.label.text));
        }
        //add node labels for DIP packages
        if (m.nodes.createLabels) {
            let pins = this.count / 2, disp = m.nodes.disp || {
                x: 0,
                y: 0
            };
            for (let y = 48 + disp.y, x = 7 + disp.x, i = 0, factor = 20; y > 0; y -= 44, x += (factor = -factor))
                for (let col = 0; col < pins; col++, i++, x += factor)
                    (0, dom_1.aChld)(this.g, (0, extra_1.createText)({ x: x, y: y }, i + ""));
        }
        //create label if defined
        if (m.labelId) {
            this.$.boardLabel = new label_1.default({
                //fontSize default Label::fontSize = 15
                x: m.labelId.x,
                y: m.labelId.y,
                text: this.id,
                visible: false
            });
        }
        this.refresh();
        //signal component creation
        this.onProp && this.onProp({
            id: `#${this.id}`,
            code: 1 // "create" code = 1
        });
    }
    get type() { return interfaces_1.Type.EC; }
    /**
     * @description returns the read-only size of this component
     */
    get size() { return this.$.size.clone(); }
    /**
     * @description returns then board label outerHTML if any
     */
    get boardLabel() { var _a; return (_a = this.$.boardLabel) === null || _a === void 0 ? void 0 : _a.g.outerHTML; }
    refresh() {
        super.refresh();
        if (this.$.boardLabel) {
            let pos = point_1.default.plus(this.p, this.$.boardLabel.p), center = this.origin, attrs = {
                transform: `translate(${pos.x} ${pos.y})`
            };
            this.rot && (center = point_1.default.minus(point_1.default.plus(this.p, center), pos),
                attrs.transform += ` rotate(${this.rot} ${center.x} ${center.y})`);
            (0, dom_1.attr)(this.$.boardLabel.g, attrs);
        }
        return this;
    }
    setVisible(value) {
        super.setVisible(value);
        this.$.boardLabel && this.$.boardLabel.setVisible(value);
        return this;
    }
    /**
     * removes this electronic component form the board
     */
    remove() {
        var _a;
        //delete label if any first
        this.$.boardLabel && ((_a = this.g.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(this.$.boardLabel.g));
        super.remove();
    }
    /**
     * this happens when this component was inserted in the board
     */
    onDOM() {
        this.$.boardLabel && (this.g.insertAdjacentElement("afterend", this.$.boardLabel.g), this.$.boardLabel.setVisible(true));
    }
    defaults() {
        return (0, misc_1.extend)(super.defaults(), {
            class: "ec",
            boardLabel: void 0,
        });
    }
}
exports.default = EC;
