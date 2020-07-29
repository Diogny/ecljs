import Point from "./point";
import { tag } from "./utils";
import { attr } from "./dab";
export default class BoardCircle {
    constructor(nodeName) {
        //set initial default values
        this.settings = {
            nodeName: nodeName || "node",
            nodeValue: -1,
            visible: false,
            radius: 5,
            p: Point.origin
        };
        //create SVG DOM Element
        let tagAttrs = this.getObjectSettings();
        //set svg-type and nodeName value for 'node'
        tagAttrs["svg-type"] = this.nodeName;
        tagAttrs[this.nodeName] = this.nodeValue;
        //create SVG
        this.settings.g = tag("circle", "", tagAttrs);
    }
    get visible() { return this.settings.visible; }
    get p() { return this.settings.p; }
    get nodeName() { return this.settings.nodeName; }
    get nodeValue() { return this.settings.nodeValue; }
    get radius() { return this.settings.radius; }
    get g() { return this.settings.g; }
    getDomRadius() {
        return parseInt(attr(this.g, "r"));
    }
    move(x, y) {
        this.settings.p = new Point(x, y);
        return this;
    }
    setRadius(value) {
        this.settings.radius = value <= 0 ? 5 : value;
        return this.refresh();
    }
    hide() {
        this.settings.visible = false;
        this.settings.p = Point.origin;
        this.settings.nodeValue = -1;
        return this.refresh();
    }
    show(nodeValue) {
        this.settings.visible = true;
        // this.p  moved first
        this.settings.nodeValue = nodeValue;
        return this.refresh();
    }
    getObjectSettings() {
        let o = {
            cx: this.p.x,
            cy: this.p.y,
            r: this.radius,
            class: this.visible ? "" : "hide"
        };
        o[this.nodeName] = this.nodeValue;
        return o;
    }
    refresh() {
        return (attr(this.g, this.getObjectSettings()), this);
    }
}
