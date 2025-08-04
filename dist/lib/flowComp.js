import { toBool, clone } from "dabbjs/dist/lib/dab";
import { extend, each } from "dabbjs/dist/lib/misc";
import { aChld, css, attr } from "dabbjs/dist/lib/dom";
import { Point } from "dabbjs/dist/lib/point";
import { Size } from "dabbjs/dist/lib/size";
//
import { Type } from "./interfaces";
import { ItemBoard } from "./itemsBoard";
import { createText, pinInfo, flowNodes } from "./extra";
/**
 * @description flowchart base component class
 */
export class FlowComp extends ItemBoard {
    get type() { return Type.FL; }
    get last() { return this.$.nodes.length - 1; }
    get count() { return this.$.nodes.length; }
    get minSize() { return this.$.minSize; }
    get size() { return this.$.size; }
    /**
     * @description resize the flowchart component
     * @param value new size
     * @returns true if it was resized, false otherwise
     */
    setSize(value) {
        if (!value.equal(this.size)) {
            let s = new Size(value.width - this.minSize.width, value.height - this.minSize.height);
            if (s.positive) {
                //for flowchart conditional
                if (toBool(this.base.meta.lockedSize)) {
                    let m = Math.min(value.width, value.height);
                    value.width = m;
                    value.height = m;
                }
                if (this.container.reSizePolicy == "grow") {
                    s = this.size;
                    let sx = value.width - s.width, sy = value.height - s.height;
                    this.$.x -= sx;
                    this.$.y -= sy;
                    value.width += sx;
                    value.height += sy;
                }
                this.$.size = value;
                //internal adjust node points, this calls refresh() inside
                this.onResize(value);
                //call hooked external event if any
                this.$.onResize && this.$.onResize(value);
                return true;
            }
        }
        return false;
    }
    /**
     * @description maximum inbounds
     */
    get inputs() { return this.base.meta.inputs; }
    /**
     * @description current inbounds
     */
    get ins() { return this.$.ins; }
    /**
     * @description maximum outbounds
     */
    get outputs() { return this.base.meta.outputs; }
    /**
     * @description current outbounds
     */
    get outs() { return this.$.outs; }
    /**
     * SVG text, changing SVG text x's value, must change all inside tspan x's values too
     */
    get svgText() { return this.$.svgText; }
    get text() { return this.$.text; }
    //probably will be removed, internal, just to dev easier from outside
    set text(value) { this.$.text = value; }
    get fontSize() { return this.$.fontSize; }
    set fontSize(value) { this.$.fontSize = value; }
    constructor(flowchart, options) {
        super(flowchart, options);
        //set internal properties
        this.$.ins = 0;
        this.$.outs = 0;
        let meta = this.base.meta;
        this.$.nodes = clone(meta.nodes.list);
        this.$.minSize = Size.parse(meta.minSize);
        this.$.fontSize = meta.fontSize;
        //check if these properties were provided in options
        this.$.size = options.size || Size.parse(meta.size);
        this.$.text = options.text || meta.text;
        let pos = options.pos || Point.parse(meta.position);
        //create text
        aChld(this.g, this.$.svgText = createText({
            //if options.text was set, then svg text pos may change with UI algorithm
            x: pos.x,
            y: pos.y,
            //if options.text was set, then UI must set text tspans with algorithms not here
        }, `<tspan x="${pos.x}" dy="0">${options.text ? '' : this.text}</tspan>`));
        css(this.$.svgText, {
            //if options.text was set, then fontSize may change with UI algorithm
            "font-size": this.fontSize + "px",
        });
    }
    /**
     * @description perform node readjustment, it calls refresh() function
     * @param size new size
     */
    onResize(size) {
        flowNodes(this.$.nodes, size);
        this.refresh();
    }
    /**
     * @description returns the node information
     * @param node 0-based pin/node number
     * @param onlyPoint true to get internal point, false get the real board point
     *
     * this returns (x, y) relative to the EC location
     */
    node(node, nodeOnly) {
        let pin = pinInfo(this.$.nodes, node);
        if (pin && !nodeOnly) {
            pin.x += this.x;
            pin.y += this.y;
        }
        return pin;
    }
    /**
     * @description refreshes flowchart location, and updates bonded cmoponents
     */
    refresh() {
        attr(this.g, {
            transform: `translate(${this.x} ${this.y})`
        });
        //check below
        each(this.bonds, (_b, key) => {
            this.nodeRefresh(key);
        });
        return this;
    }
    //highlights from itemSolid must be overridden here to allow inputs/outputs when available
    //	DirType = 0,	show only available outputs
    //			= 1,	show ony available inputs
    //wiring must send signal if it's starting or ending the bond
    defaults() {
        return extend(super.defaults(), {
            class: "fl",
            dir: true,
            onResize: void 0,
            padding: 2,
            //can be customized, set to undefined to check on creation
            size: void 0,
            text: void 0,
        });
    }
}
