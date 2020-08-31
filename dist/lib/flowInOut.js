"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var dab_1 = require("dabbjs/dist/lib/dab");
var rect_1 = tslib_1.__importDefault(require("dabbjs/dist/lib/rect"));
var flowComp_1 = tslib_1.__importDefault(require("./flowComp"));
var extra_1 = require("./extra");
var FlowInOut = /** @class */ (function (_super) {
    tslib_1.__extends(FlowInOut, _super);
    function FlowInOut(flowchart, options) {
        var _this = _super.call(this, flowchart, options) || this;
        //get path, hould be this.g.firstChild
        _this.$.path = _this.g.firstElementChild;
        //refresh nodes
        _this.onResize(_this.size);
        _this.refresh();
        return _this;
    }
    Object.defineProperty(FlowInOut.prototype, "body", {
        /**
        * contains the main frame body, where full component size can be calculated
        */
        get: function () { return this.$.path; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FlowInOut.prototype, "clientRect", {
        /**
         * client rect where text should be safely contained
         */
        get: function () {
            var 
            //r = this.body.getBoundingClientRect();
            s = this.size;
            return (new rect_1.default(0, 0, s.width | 0, s.height | 0)).grow(-this.$.shift, -this.$.padding);
        },
        enumerable: false,
        configurable: true
    });
    FlowInOut.prototype.refresh = function () {
        var s = this.$.shift, w = this.size.width, s2 = w - s;
        dab_1.attr(this.$.path, {
            d: "M " + s + ",0 H" + w + " L" + s2 + "," + this.size.height + " H0 Z"
        });
        //later text resize goes here
        //...
        return _super.prototype.refresh.call(this), this;
    };
    FlowInOut.prototype.onResize = function (size) {
        var list = this.$.nodes, xs = (this.$.shift = this.size.height / 4 | 0) / 2 | 0;
        extra_1.flowNodes(list, size);
        list[1].x -= xs;
        list[3].x = xs;
    };
    return FlowInOut;
}(flowComp_1.default));
exports.default = FlowInOut;
//IFlowInOutDefaults
