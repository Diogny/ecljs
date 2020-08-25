"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var flowComp_1 = tslib_1.__importDefault(require("./flowComp"));
var dab_1 = require("./dab");
var FlowProcess = /** @class */ (function (_super) {
    tslib_1.__extends(FlowProcess, _super);
    function FlowProcess(flowchart, options) {
        var _this = _super.call(this, flowchart, options) || this;
        //get rect, should be this.g.firstChild
        _this.$.rect = _this.g.firstElementChild;
        _this.refresh();
        return _this;
    }
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
    return FlowProcess;
}(flowComp_1.default));
exports.default = FlowProcess;
