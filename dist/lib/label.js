import { obj } from "dabbjs/dist/lib/dab";
import { aChld, attr, tag } from "dabbjs/dist/lib/dom";
import { extend } from "dabbjs/dist/lib/misc";
import { Type } from "./interfaces";
import { ItemBase } from "./itemsBase";
export class Label extends ItemBase {
    get type() { return Type.LABEL; }
    get text() { return this.$.text; }
    get size() {
        let b = this.$.svgtext.getBBox();
        return obj({
            width: Math.round(b.width),
            height: Math.round(b.height)
        });
    }
    get fontSize() { return this.$.fontSize; }
    constructor(options) {
        super(options);
        aChld(this.g, this.$.svgtext = tag("text", "", {}));
        this.$.svgtext.innerHTML = this.$.text;
    }
    move(x, y) {
        super.move(x, y);
        attr(this.g, { transform: "translate(" + this.x + " " + this.y + ")" });
        return this;
    }
    setFontSize(value) {
        attr(this.$.svgtext, {
            "font-size": this.$.fontSize = value
        });
        return this;
    }
    setText(text) {
        return this.$.svgtext.innerHTML = this.$.text = text, this;
    }
    defaults() {
        return extend(super.defaults(), {
            name: "label",
            class: "label",
            fontSize: 15,
            text: ""
        });
    }
}
