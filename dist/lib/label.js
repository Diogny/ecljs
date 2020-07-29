import ItemBase from "./itemsBase";
import { Type } from "./types";
import { obj, aCld, attr, extend } from "./dab";
import { tag } from "./utils";
export default class Label extends ItemBase {
    constructor(options) {
        options.visible = false;
        super(options);
        this.text = '';
        this.t = tag("text", "", {});
        aCld(this.g, this.t);
    }
    get type() { return Type.LABEL; }
    get size() {
        let b = this.t.getBBox();
        return obj({
            width: Math.round(b.width),
            height: Math.round(b.height)
        });
    }
    get fontSize() { return this.settings.fontSize; }
    move(x, y) {
        super.move(x, y);
        attr(this.g, { transform: "translate(" + this.x + " " + this.y + ")" });
        return this;
    }
    setFontSize(value) {
        this.settings.fontSize = value;
        return this.build();
    }
    build() {
        attr(this.t, {
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
        return extend(super.propertyDefaults(), {
            name: "label",
            class: "label",
            fontSize: 50
        });
    }
}
