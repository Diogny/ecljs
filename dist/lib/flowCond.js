"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var dab_1 = require("dabbjs/dist/lib/dab");
var rect_1 = tslib_1.__importDefault(require("dabbjs/dist/lib/rect"));
var flowComp_1 = tslib_1.__importDefault(require("./flowComp"));
var FlowConditional = /** @class */ (function (_super) {
    tslib_1.__extends(FlowConditional, _super);
    function FlowConditional(flowchart, options) {
        var _this = _super.call(this, flowchart, options) || this;
        _this.$.path = _this.g.firstElementChild;
        _this.onResize(_this.size);
        return _this;
    }
    Object.defineProperty(FlowConditional.prototype, "body", {
        /**
        * contains the main frame body, where full component size can be calculated
        */
        get: function () { return this.$.path; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FlowConditional.prototype, "clientRect", {
        /**
         * client rect where text should be safely contained
         */
        get: function () {
            var s = this.size, r = new rect_1.default(0, 0, s.width | 0, s.height | 0), sw = r.width / 4 | 0, sh = r.height / 4 | 0;
            return r.grow(-sw - this.$.padding, -sh - this.$.padding);
        },
        enumerable: false,
        configurable: true
    });
    /**
     * @description refreshes flowchart location, size, and updates bonded cmoponents
     */
    FlowConditional.prototype.refresh = function () {
        var w = this.size.width / 2 | 0, h = this.size.height / 2 | 0;
        dab_1.attr(this.$.path, {
            d: "M " + w + ",0 L " + this.size.width + "," + h + " L " + w + "," + this.size.height + " L 0," + h + " Z"
        });
        return _super.prototype.refresh.call(this), this;
    };
    return FlowConditional;
}(flowComp_1.default));
exports.default = FlowConditional;
