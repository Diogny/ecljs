"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const dom_1 = require("dabbjs/dist/lib/dom");
const rect_1 = (0, tslib_1.__importDefault)(require("dabbjs/dist/lib/rect"));
const flowComp_1 = (0, tslib_1.__importDefault)(require("./flowComp"));
const extra_1 = require("./extra");
class FlowTerminational extends flowComp_1.default {
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
        return (new rect_1.default(0, 0, s.width | 0, s.height | 0)).grow(-this.$.curve, -this.$.padding);
    }
    /**
     * @description refreshes flowchart location, size, and updates bonded cmoponents
     */
    refresh() {
        let h = this.size.height, h2 = h / 2 | 0, c = this.$.curve, w = this.size.width, c2 = w - c;
        (0, dom_1.attr)(this.$.path, {
            d: `M ${c},0 H${c2} C ${c2},0 ${w},${h2} ${c2},${h} H${c} C ${c},${h} 0,${h2} ${c},0 Z`
        });
        return super.refresh(), this;
    }
    /**
     * @description perform node readjustment, it calls this.refresh() function
     * @param size new size
     */
    onResize(size) {
        let list = this.$.nodes, xs = (this.$.curve = this.size.height / 4 | 0) / 2 | 0;
        (0, extra_1.flowNodes)(list, size);
        list[1].x -= xs;
        list[3].x = xs;
        this.refresh();
    }
}
exports.default = FlowTerminational;
//# sourceMappingURL=flowTerm.js.map