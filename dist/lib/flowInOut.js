"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const dom_1 = require("dabbjs/dist/lib/dom");
const rect_1 = (0, tslib_1.__importDefault)(require("dabbjs/dist/lib/rect"));
const flowComp_1 = (0, tslib_1.__importDefault)(require("./flowComp"));
const extra_1 = require("./extra");
class FlowInOut extends flowComp_1.default {
    constructor(flowchart, options) {
        super(flowchart, options);
        this.$.path = this.g.firstElementChild;
        this.onResize(this.size);
    }
    /**
    * contains the main frame body, where full component size can be calculated
    */
    get body() { return this.$.path; }
    /**
     * client rect where text should be safely contained
     */
    get clientRect() {
        let s = this.size;
        return (new rect_1.default(0, 0, s.width | 0, s.height | 0)).grow(-this.$.shift, -this.$.padding);
    }
    /**
     * @description refreshes flowchart location, size, and updates bonded cmoponents
     */
    refresh() {
        let s = this.$.shift, w = this.size.width, s2 = w - s;
        (0, dom_1.attr)(this.$.path, {
            d: `M ${s},0 H${w} L${s2},${this.size.height} H0 Z`
        });
        return super.refresh(), this;
    }
    /**
     * @description perform node readjustment, it calls refresh() function
     * @param size new size
     */
    onResize(size) {
        let list = this.$.nodes, xs = (this.$.shift = this.size.height / 4 | 0) / 2 | 0;
        (0, extra_1.flowNodes)(list, size);
        list[1].x -= xs;
        list[3].x = xs;
        this.refresh();
    }
}
exports.default = FlowInOut;
