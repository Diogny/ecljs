import { attr, aChld } from 'dabbjs/dist/lib/dom';
import { extend } from "dabbjs/dist/lib/misc";
import { Point } from 'dabbjs/dist/lib/point';
import { Type } from './interfaces';
import { ItemSolid } from './itemSolid';
import { Label } from './label';
import { createText } from './extra';
import { Size } from 'dabbjs/dist/lib/size';
export class EC extends ItemSolid {
    get type() { return Type.EC; }
    /**
     * @description returns the read-only size of this component
     */
    get size() { return this.$.size.clone(); }
    /**
     * @description returns then board label outerHTML if any
     */
    get boardLabel() { var _a; return (_a = this.$.boardLabel) === null || _a === void 0 ? void 0 : _a.g.outerHTML; }
    constructor(circuit, options) {
        super(circuit, options);
        this.$.size = options.size || Size.parse(this.base.meta.size);
        let m = this.base.meta;
        //for labels in N555, 7408, Atmega168
        if (m.label) {
            aChld(this.g, createText({
                x: m.label.x,
                y: m.label.y,
                "class": m.label.class
            }, m.label.text));
        }
        //add node labels for DIP packages
        if (m.nodes.createLabels) {
            let pins = this.count / 2, disp = m.nodes.disp || {
                x: 0,
                y: 0
            };
            for (let y = 48 + disp.y, x = 7 + disp.x, i = 0, factor = 20; y > 0; y -= 44, x += (factor = -factor))
                for (let col = 0; col < pins; col++, i++, x += factor)
                    aChld(this.g, createText({ x: x, y: y }, i + ""));
        }
        //create label if defined
        if (m.labelId) {
            this.$.boardLabel = new Label({
                //fontSize default Label::fontSize = 15
                x: m.labelId.x,
                y: m.labelId.y,
                text: this.id,
                visible: false
            });
        }
        this.refresh();
        //signal component creation
        this.onProp && this.onProp({
            id: `#${this.id}`,
            code: 1 // "create" code = 1
        });
    }
    refresh() {
        super.refresh();
        if (this.$.boardLabel) {
            let pos = Point.plus(this.p, this.$.boardLabel.p), center = this.origin, attrs = {
                transform: `translate(${pos.x} ${pos.y})`
            };
            this.rot && (center = Point.minus(Point.plus(this.p, center), pos),
                attrs.transform += ` rotate(${this.rot} ${center.x} ${center.y})`);
            attr(this.$.boardLabel.g, attrs);
        }
        return this;
    }
    setVisible(value) {
        super.setVisible(value);
        this.$.boardLabel && this.$.boardLabel.setVisible(value);
        return this;
    }
    /**
     * removes this electronic component form the board
     */
    remove() {
        var _a;
        //delete label if any first
        this.$.boardLabel && ((_a = this.g.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(this.$.boardLabel.g));
        super.remove();
    }
    /**
     * this happens when this component was inserted in the board
     */
    onDOM() {
        this.$.boardLabel && (this.g.insertAdjacentElement("afterend", this.$.boardLabel.g), this.$.boardLabel.setVisible(true));
    }
    defaults() {
        return extend(super.defaults(), {
            class: "ec",
            boardLabel: void 0,
        });
    }
}
