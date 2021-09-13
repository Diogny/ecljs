"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const dom_1 = require("dabbjs/dist/lib/dom");
const rect_1 = (0, tslib_1.__importDefault)(require("dabbjs/dist/lib/rect"));
const flowComp_1 = (0, tslib_1.__importDefault)(require("./flowComp"));
class FlowProcess extends flowComp_1.default {
    constructor(flowchart, options) {
        super(flowchart, options);
        this.$.rect = this.g.firstElementChild;
        this.onResize(this.size);
    }
    /**
     * contains the main frame body, where full component size can be calculated
     */
    get body() { return this.$.rect; }
    /**
     * client rect where text should be safely contained
     */
    get clientRect() {
        let s = this.size;
        return (new rect_1.default(0, 0, s.width | 0, s.height | 0)).grow(-this.$.padding, -this.$.padding);
    }
    /**
     * @description refreshes flowchart location, size, and updates bonded cmoponents
     */
    refresh() {
        (0, dom_1.attr)(this.$.rect, {
            width: this.size.width,
            height: this.size.height
        });
        return super.refresh(), this;
    }
}
exports.default = FlowProcess;
//# sourceMappingURL=process.js.map