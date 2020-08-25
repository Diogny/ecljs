"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var flowComp_1 = tslib_1.__importDefault(require("./flowComp"));
var dab_1 = require("./dab");
var FlowConditional = /** @class */ (function (_super) {
    tslib_1.__extends(FlowConditional, _super);
    function FlowConditional(flowchart, options) {
        var _this = _super.call(this, flowchart, options) || this;
        //get path, hould be this.g.firstChild
        _this.$.path = _this.g.firstElementChild;
        _this.refresh();
        return _this;
    }
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
    return FlowConditional;
}(flowComp_1.default));
exports.default = FlowConditional;
