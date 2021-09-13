"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const misc_1 = require("dabbjs/dist/lib/misc");
const dom_1 = require("dabbjs/dist/lib/dom");
const point_1 = (0, tslib_1.__importDefault)(require("dabbjs/dist/lib/point"));
const rect_1 = (0, tslib_1.__importDefault)(require("dabbjs/dist/lib/rect"));
const item_1 = (0, tslib_1.__importDefault)(require("./item"));
class ItemBase extends item_1.default {
    constructor(options) {
        super(options);
        this.$.g = (0, dom_1.tag)("g", this.$.id, {
            class: this.class + (this.visible ? '' : ' hide')
        });
    }
    get base() { return this.$.base; }
    get g() { return this.$.g; }
    get box() { return this.g.getBBox(); }
    get origin() {
        let b = this.box;
        return new point_1.default((b.x + b.width / 2) | 0, (b.y + b.height / 2) | 0);
    }
    rect() {
        return new rect_1.default(this.p.x, this.p.y, this.box.width, this.box.height);
    }
    setVisible(value) {
        return (0, dom_1.tCl)(this.g, "hide", !super.setVisible(value).visible), this;
    }
    /**
     * removes this base component from the board
     */
    remove() {
        var _a;
        (_a = this.g.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(this.g);
    }
    /**
     * @description this's called after component is inserted in the DOM
     */
    onDOM() {
        //
    }
    defaults() {
        return (0, misc_1.extend)(super.defaults(), {
            g: void 0,
            base: void 0 //this comes from createItem by default
        });
    }
}
exports.default = ItemBase;
