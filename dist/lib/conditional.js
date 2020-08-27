"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var flowComp_1 = tslib_1.__importDefault(require("./flowComp"));
var dab_1 = require("./dab");
var utils_1 = require("./utils");
var rect_1 = tslib_1.__importDefault(require("./rect"));
var FlowConditional = /** @class */ (function (_super) {
    tslib_1.__extends(FlowConditional, _super);
    function FlowConditional(flowchart, options) {
        var _this = _super.call(this, flowchart, options) || this;
        //get path, hould be this.g.firstChild
        _this.$.path = _this.g.firstElementChild;
        //refresh nodes
        _this.onResize(_this.size);
        _this.refresh();
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
            var dom = this.body.getBoundingClientRect(), r = new rect_1.default(0, 0, dom.width | 0, dom.height | 0), sw = r.width / 4 | 0, sh = r.height / 4 | 0;
            return r.grow(-sw - this.$.padding, -sh - this.$.padding);
        },
        enumerable: false,
        configurable: true
    });
    FlowConditional.prototype.refresh = function () {
        //calculate rect
        var w = this.size.width / 2 | 0, h = this.size.height / 2 | 0;
        dab_1.attr(this.$.path, {
            d: "M " + w + ",0 L " + this.size.width + "," + h + " L " + w + "," + this.size.height + " L 0," + h + " Z"
        });
        //later text resize goes here
        //...
        return _super.prototype.refresh.call(this), this;
    };
    FlowConditional.prototype.onResize = function (size) {
        utils_1.flowNodes(this.base.meta.nodes.list, size);
    };
    return FlowConditional;
}(flowComp_1.default));
exports.default = FlowConditional;
