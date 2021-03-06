"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var dab_1 = require("dabbjs/dist/lib/dab");
var rect_1 = tslib_1.__importDefault(require("dabbjs/dist/lib/rect"));
var flowComp_1 = tslib_1.__importDefault(require("./flowComp"));
var extra_1 = require("./extra");
var FlowTerminational = /** @class */ (function (_super) {
    tslib_1.__extends(FlowTerminational, _super);
    function FlowTerminational(flowchart, options) {
        var _this = _super.call(this, flowchart, options) || this;
        _this.$.path = _this.g.firstElementChild;
        _this.onResize(_this.size);
        return _this;
    }
    Object.defineProperty(FlowTerminational.prototype, "body", {
        /**
        * contains the main frame body, where full component size can be calculated
        */
        get: function () { return this.$.path; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FlowTerminational.prototype, "clientRect", {
        /**
         * client rect where text should be safely contained
         */
        get: function () {
            var s = this.size;
            return (new rect_1.default(0, 0, s.width | 0, s.height | 0)).grow(-this.$.curve, -this.$.padding);
        },
        enumerable: false,
        configurable: true
    });
    /**
     * @description refreshes flowchart location, size, and updates bonded cmoponents
     */
    FlowTerminational.prototype.refresh = function () {
        var h = this.size.height, h2 = h / 2 | 0, c = this.$.curve, w = this.size.width, c2 = w - c;
        dab_1.attr(this.$.path, {
            d: "M " + c + ",0 H" + c2 + " C " + c2 + ",0 " + w + "," + h2 + " " + c2 + "," + h + " H" + c + " C " + c + "," + h + " 0," + h2 + " " + c + ",0 Z"
        });
        return _super.prototype.refresh.call(this), this;
    };
    /**
     * @description perform node readjustment, it calls this.refresh() function
     * @param size new size
     */
    FlowTerminational.prototype.onResize = function (size) {
        var list = this.$.nodes, xs = (this.$.curve = this.size.height / 4 | 0) / 2 | 0;
        extra_1.flowNodes(list, size);
        list[1].x -= xs;
        list[3].x = xs;
        this.refresh();
    };
    return FlowTerminational;
}(flowComp_1.default));
exports.default = FlowTerminational;
