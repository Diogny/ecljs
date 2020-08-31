"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var dab_1 = require("dabbjs/dist/lib/dab");
var rect_1 = tslib_1.__importDefault(require("dabbjs/dist/lib/rect"));
var flowComp_1 = tslib_1.__importDefault(require("./flowComp"));
var FlowProcess = /** @class */ (function (_super) {
    tslib_1.__extends(FlowProcess, _super);
    function FlowProcess(flowchart, options) {
        var _this = _super.call(this, flowchart, options) || this;
        _this.$.rect = _this.g.firstElementChild;
        _this.onResize(_this.size);
        return _this;
    }
    Object.defineProperty(FlowProcess.prototype, "body", {
        /**
         * contains the main frame body, where full component size can be calculated
         */
        get: function () { return this.$.rect; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FlowProcess.prototype, "clientRect", {
        /**
         * client rect where text should be safely contained
         */
        get: function () {
            var s = this.size;
            return (new rect_1.default(0, 0, s.width | 0, s.height | 0)).grow(-this.$.padding, -this.$.padding);
        },
        enumerable: false,
        configurable: true
    });
    /**
     * @description refreshes flowchart location, size, and updates bonded cmoponents
     */
    FlowProcess.prototype.refresh = function () {
        dab_1.attr(this.$.rect, {
            width: this.size.width,
            height: this.size.height
        });
        return _super.prototype.refresh.call(this), this;
    };
    return FlowProcess;
}(flowComp_1.default));
exports.default = FlowProcess;
