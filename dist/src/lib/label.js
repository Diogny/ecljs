"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const interfaces_1 = require("./interfaces");
const dab_1 = require("./dab");
const utils_1 = require("./utils");
const itemsBase_1 = tslib_1.__importDefault(require("./itemsBase"));
class Label extends itemsBase_1.default {
    constructor(options) {
        options.visible = false;
        super(options);
        this.text = '';
        this.t = utils_1.tag("text", "", {});
        dab_1.aCld(this.g, this.t);
    }
    get type() { return interfaces_1.Type.LABEL; }
    get size() {
        let b = this.t.getBBox();
        return dab_1.obj({
            width: Math.round(b.width),
            height: Math.round(b.height)
        });
    }
    get fontSize() { return this.settings.fontSize; }
    move(x, y) {
        super.move(x, y);
        dab_1.attr(this.g, { transform: "translate(" + this.x + " " + this.y + ")" });
        return this;
    }
    setFontSize(value) {
        this.settings.fontSize = value;
        return this.build();
    }
    build() {
        dab_1.attr(this.t, {
            "font-size": this.fontSize,
            x: 0,
            y: 0
        });
        return this;
    }
    setText(value) {
        this.t.innerHTML = this.text = value;
        return this.build();
    }
    propertyDefaults() {
        return dab_1.extend(super.propertyDefaults(), {
            name: "label",
            class: "label",
            fontSize: 50
        });
    }
}
exports.default = Label;
