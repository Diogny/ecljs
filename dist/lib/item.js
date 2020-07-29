import Point from "./point";
import { obj, copy, unique } from "./dab";
import { TypedClass } from "./types";
export default class Item extends TypedClass {
    constructor(options) {
        super();
        //merge defaults and deep copy
        //all default properties must be refrenced from this or this.settings
        // options is for custom options only
        let optionsClass = options.class || "";
        delete options.class;
        this.settings = obj(copy(this.propertyDefaults(), options));
        this.settings.class = unique((this.class + " " + optionsClass).split(' ')).join(' ');
        this.settings.x = this.settings.x || 0;
        this.settings.y = this.settings.y || 0;
    }
    get name() { return this.settings.name; }
    get id() { return this.settings.id; }
    get x() { return this.settings.x; }
    get y() { return this.settings.y; }
    get p() { return new Point(this.x, this.y); }
    get class() { return this.settings.class; }
    get visible() { return this.settings.visible; }
    setVisible(value) {
        this.settings.visible = !!value;
        return this;
    }
    move(x, y) {
        this.settings.x = x | 0;
        this.settings.y = y | 0;
        return this;
    }
    movePoint(p) {
        return this.move(p.x, p.y);
    }
    translate(dx, dy) {
        return this.move(this.x + (dx | 0), this.y + (dy | 0));
    }
    propertyDefaults() {
        return {
            id: "",
            name: "",
            x: 0,
            y: 0,
            class: "",
            visible: true,
            base: void 0,
            label: ""
        };
    }
}
