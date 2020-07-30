"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const dab_1 = require("./dab");
const utils_1 = require("./utils");
const item_1 = tslib_1.__importDefault(require("./item"));
const rect_1 = tslib_1.__importDefault(require("./rect"));
const point_1 = tslib_1.__importDefault(require("./point"));
class ItemBase extends item_1.default {
    constructor(options) {
        super(options);
        let classArr = dab_1.isStr(this.class) ? this.class.split(' ') : [];
        !this.settings.visible && (classArr.push("hide"));
        this.settings.g = utils_1.tag("g", this.settings.id, {
            class: (this.settings.class = classArr.join(' '))
        });
    }
    get g() { return this.settings.g; }
    get ClientRect() {
        let b = this.g.getBoundingClientRect();
        return dab_1.obj({
            width: b.width | 0,
            height: b.height | 0
        });
    }
    get box() { return this.g.getBBox(); }
    get origin() {
        let b = this.box;
        return new point_1.default((b.x + b.width / 2) | 0, (b.y + b.height / 2) | 0);
    }
    rect() {
        return new rect_1.default(this.p.x, this.p.y, this.box.width, this.box.height);
    }
    setVisible(value) {
        super.setVisible(value);
        this.visible ? dab_1.removeClass(this.g, "hide") : dab_1.addClass(this.g, "hide");
        return this;
    }
    remove() {
        var _a;
        (_a = this.g.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(this.g);
    }
    afterDOMinserted() { }
}
exports.default = ItemBase;
