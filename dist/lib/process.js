"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var dab_1 = require("dabbjs/dist/lib/dab");
var rect_1 = tslib_1.__importDefault(require("dabbjs/dist/lib/rect"));
var flowComp_1 = tslib_1.__importDefault(require("./flowComp"));
var extra_1 = require("./extra");
var FlowProcess = /** @class */ (function (_super) {
    tslib_1.__extends(FlowProcess, _super);
    function FlowProcess(flowchart, options) {
        var _this = _super.call(this, flowchart, options) || this;
        //get rect, should be this.g.firstChild
        _this.$.rect = _this.g.firstElementChild;
        //refresh nodes
        _this.onResize(_this.size);
        _this.refresh();
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
            var r = this.body.getBoundingClientRect();
            return (new rect_1.default(0, 0, r.width | 0, r.height | 0)).grow(-this.$.padding, -this.$.padding);
        },
        enumerable: false,
        configurable: true
    });
    FlowProcess.prototype.refresh = function () {
        //calculate rect
        dab_1.attr(this.$.rect, {
            width: this.size.width,
            height: this.size.height
        });
        //later text resize goes here
        //...
        return _super.prototype.refresh.call(this), this;
    };
    FlowProcess.prototype.onResize = function (size) {
        extra_1.flowNodes(this.$.nodes, size);
    };
    return FlowProcess;
}(flowComp_1.default));
exports.default = FlowProcess;
