"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const dab_1 = require("dabbjs/dist/lib/dab");
const dom_1 = require("dabbjs/dist/lib/dom");
const misc_1 = require("dabbjs/dist/lib/misc");
const interfaces_1 = require("./interfaces");
const itemsBase_1 = (0, tslib_1.__importDefault)(require("./itemsBase"));
class Label extends itemsBase_1.default {
    constructor(options) {
        super(options);
        (0, dom_1.aChld)(this.g, this.$.svgtext = (0, dom_1.tag)("text", "", {}));
        this.$.svgtext.innerHTML = this.$.text;
    }
    get type() { return interfaces_1.Type.LABEL; }
    get text() { return this.$.text; }
    get size() {
        let b = this.$.svgtext.getBBox();
        return (0, dab_1.obj)({
            width: Math.round(b.width),
            height: Math.round(b.height)
        });
    }
    get fontSize() { return this.$.fontSize; }
    move(x, y) {
        super.move(x, y);
        (0, dom_1.attr)(this.g, { transform: "translate(" + this.x + " " + this.y + ")" });
        return this;
    }
    setFontSize(value) {
        (0, dom_1.attr)(this.$.svgtext, {
            "font-size": this.$.fontSize = value
        });
        return this;
    }
    setText(text) {
        return this.$.svgtext.innerHTML = this.$.text = text, this;
    }
    defaults() {
        return (0, misc_1.extend)(super.defaults(), {
            name: "label",
            class: "label",
            fontSize: 15,
            text: ""
        });
    }
}
exports.default = Label;
//# sourceMappingURL=label.js.map