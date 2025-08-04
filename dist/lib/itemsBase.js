import { extend } from 'dabbjs/dist/lib/misc';
import { tCl, tag } from 'dabbjs/dist/lib/dom';
import { Point } from 'dabbjs/dist/lib/point';
import { Rect } from 'dabbjs/dist/lib/rect';
import { Item } from './item';
export class ItemBase extends Item {
    get base() { return this.$.base; }
    get g() { return this.$.g; }
    get box() { return this.g.getBBox(); }
    get origin() {
        let b = this.box;
        return new Point((b.x + b.width / 2) | 0, (b.y + b.height / 2) | 0);
    }
    rect() {
        return new Rect(this.p.x, this.p.y, this.box.width, this.box.height);
    }
    setVisible(value) {
        return tCl(this.g, "hide", !super.setVisible(value).visible), this;
    }
    constructor(options) {
        super(options);
        this.$.g = tag("g", this.$.id, {
            class: this.class + (this.visible ? '' : ' hide')
        });
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
        return extend(super.defaults(), {
            g: void 0,
            base: void 0 //this comes from createItem by default
        });
    }
}
