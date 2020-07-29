import { obj, addClass, removeClass, isStr } from './dab';
import { tag } from './utils';
import Item from './item';
import Rect from './rect';
import Point from './point';
export default class ItemBase extends Item {
    constructor(options) {
        super(options);
        let classArr = isStr(this.class) ? this.class.split(' ') : [];
        !this.settings.visible && (classArr.push("hide"));
        this.settings.g = tag("g", this.settings.id, {
            class: (this.settings.class = classArr.join(' '))
        });
    }
    get g() { return this.settings.g; }
    get ClientRect() {
        let b = this.g.getBoundingClientRect();
        return obj({
            width: b.width | 0,
            height: b.height | 0
        });
    }
    get box() { return this.g.getBBox(); }
    get origin() {
        let b = this.box;
        return new Point((b.x + b.width / 2) | 0, (b.y + b.height / 2) | 0);
    }
    rect() {
        return new Rect(this.p.x, this.p.y, this.box.width, this.box.height);
    }
    setVisible(value) {
        super.setVisible(value);
        this.visible ? removeClass(this.g, "hide") : addClass(this.g, "hide");
        return this;
    }
    remove() {
        var _a;
        (_a = this.g.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(this.g);
    }
    afterDOMinserted() { }
}
