"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const dom_1 = require("dabbjs/dist/lib/dom");
const rect_1 = (0, tslib_1.__importDefault)(require("dabbjs/dist/lib/rect"));
const flowComp_1 = (0, tslib_1.__importDefault)(require("./flowComp"));
const flowCondLabel_1 = (0, tslib_1.__importDefault)(require("./flowCondLabel"));
class FlowConditional extends flowComp_1.default {
    constructor(flowchart, options) {
        super(flowchart, options);
        this.$.path = this.g.firstElementChild;
        this.$.true = new flowCondLabel_1.default({ text: 'true', node: options["true"] });
        this.$.false = new flowCondLabel_1.default({ text: 'false', node: options["false"] });
        this.onResize(this.size);
    }
    /**
    * contains the main frame body, where full component size can be calculated
    */
    get body() { return this.$.path; }
    /**
     * client rect where text should be safely contained
     */
    get clientRect() {
        let s = this.size, r = new rect_1.default(0, 0, s.width | 0, s.height | 0), sw = r.width / 4 | 0, sh = r.height / 4 | 0;
        return r.grow(-sw - this.$.padding, -sh - this.$.padding);
    }
    /**
     * @description returns then board true label outerHTML if any
     */
    get trueLabel() { var _a; return (_a = this.$.true) === null || _a === void 0 ? void 0 : _a.g.outerHTML; }
    /**
     * @description returns then board false label outerHTML if any
     */
    get falseLabel() { var _a; return (_a = this.$.false) === null || _a === void 0 ? void 0 : _a.g.outerHTML; }
    /**
     * @description this happens after component was inserted in the DOM
     */
    onDOM() {
        this.$.true && this.g.insertAdjacentElement("beforebegin", this.$.true.g);
        this.$.false && this.g.insertAdjacentElement("beforebegin", this.$.false.g);
    }
    setVisible(value) {
        super.setVisible(value);
        this.$.true && this.$.true.setVisible(this.$.true.node == -1 ? false : value);
        this.$.false && this.$.false.setVisible(this.$.false.node == -1 ? false : value);
        return this;
    }
    /**
     * removes this flowchart conditional from the board
     */
    remove() {
        var _a, _b;
        //delete label if any first
        this.$.true && ((_a = this.g.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(this.$.true.g));
        this.$.false && ((_b = this.g.parentNode) === null || _b === void 0 ? void 0 : _b.removeChild(this.$.false.g));
        super.remove();
    }
    /**
     * @description link a condition label to a node
     * @param cond true for true label, false for false label
     * @param node 0-base node, or -1 to unlink/hide
     */
    setLabel(cond, node) {
        let label = getLabel(this.$, cond);
        if (label && node >= -1 && node < this.count) {
            label.node = node;
            positionLabel(this, label);
        }
    }
    /**
     * @description returns the node associated with a label
     * @param cond true for true label, false for false label
     * @returns 0-based node, or -1 if it's not linked
     */
    nodeLabel(cond) {
        let label = getLabel(this.$, cond);
        return (label == undefined) ? -1 : label.node;
    }
    /**
     * @description refreshes flowchart location, size, and updates bonded cmoponents
     */
    refresh() {
        let w = this.size.width / 2 | 0, h = this.size.height / 2 | 0;
        (0, dom_1.attr)(this.$.path, {
            d: `M ${w},0 L ${this.size.width},${h} L ${w},${this.size.height} L 0,${h} Z`
        });
        super.refresh();
        positionLabel(this, this.$.true);
        positionLabel(this, this.$.false);
        return this;
    }
}
exports.default = FlowConditional;
function getLabel($, cond) {
    return $[String(!!cond)];
}
function positionLabel(fl, label) {
    if (label.setVisible(label.node != -1).visible) {
        let wh = label.g.getBoundingClientRect(), w = fl.size.width, w2 = w / 2, h = fl.size.height, h2 = h / 2, x = fl.x, y = fl.y, n = label.node, pad = 7;
        (!(n & 1) && (x += w2 + pad, 1)) || (x += (n == 1 ? w + pad : -wh.width - pad));
        ((n & 1) && (y += h2 - pad, 1)) || (y += (n == 0 ? -pad : h + pad));
        label.move(x, y);
    }
}
