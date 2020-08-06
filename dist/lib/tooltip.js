"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const interfaces_1 = require("./interfaces");
const dab_1 = require("./dab");
const utils_1 = require("./utils");
const label_1 = tslib_1.__importDefault(require("./label"));
class Tooltip extends label_1.default {
    constructor(options) {
        super(options);
        this.svgRect = utils_1.tag("rect", "", {
            x: 0,
            y: 0,
            rx: this.borderRadius
        });
        this.g.insertBefore(this.svgRect, this.t);
    }
    get type() { return interfaces_1.Type.TOOLTIP; }
    get borderRadius() { return this.settings.borderRadius; }
    /*	DOESN'T WORK
    set visible(value: boolean) {
        //weird way to access an ancestor property  super.visible doesn't work
        super["visible"] = value;
    }
    */
    get size() {
        let b = this.t.getBBox();
        return dab_1.obj({
            width: Math.round(b.width) + 10,
            height: Math.round(b.height) + this.gap
        });
    }
    setVisible(value) {
        super.setVisible(value);
        //clear values
        //because Firefox give DOM not loaded on g.getBox() because it's not visible yet
        // so I've to display tooltip in DOM and then continue setting text, move, font-size,...
        this.text = this.t.innerHTML = '';
        return this;
    }
    setBorderRadius(value) {
        this.settings.borderRadius = value | 0;
        return this.build();
    }
    build() {
        this.gap = Math.round(this.fontSize / 2) + 1;
        dab_1.attr(this.t, {
            "font-size": this.fontSize,
            x: Math.round(this.gap / 2),
            y: this.fontSize //+ 8
        });
        let s = this.size;
        dab_1.attr(this.svgRect, {
            width: s.width,
            height: s.height,
            rx: this.borderRadius
        });
        return this;
    }
    setText(value) {
        let arr = dab_1.isStr(value) ?
            value.split(/\r?\n/) :
            value, txtArray = [];
        //catch UI error here
        //if (!Array.isArray(arr)) {
        //	console.log("ooooh")
        //}
        this.t.innerHTML = arr.map((value, ndx) => {
            let txt = '', attrs = '';
            if (dab_1.isStr(value)) {
                txt = value;
            }
            else if (dab_1.pojo(value)) {
                txt = value.text;
                attrs = utils_1.map(utils_1.filter(value, (val, key) => key != 'text'), (v, k) => `${k}="${v}"`).join('');
            }
            txtArray.push(txt);
            return `<tspan x="5" dy="${ndx}.1em"${attrs}>${txt}</tspan>`;
        }).join('');
        //set text
        this.text = txtArray.join('\r\n');
        return this.build();
    }
    propertyDefaults() {
        return dab_1.extend(super.propertyDefaults(), {
            name: "tooltip",
            class: "tooltip",
            borderRadius: 4
        });
    }
}
exports.default = Tooltip;
