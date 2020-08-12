"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var flowchartComp_1 = tslib_1.__importDefault(require("./flowchartComp"));
var FlowTerminational = /** @class */ (function (_super) {
    tslib_1.__extends(FlowTerminational, _super);
    function FlowTerminational() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FlowTerminational.prototype.onResize = function (size) {
        //(<string>(<IComponentProperty>this.prop("position")).value) = `${value.x},${value.y}`
        //(<number><unknown>(<IComponentProperty>this.prop("fontSize")).value) = 18
        //resize component
    };
    return FlowTerminational;
}(flowchartComp_1.default));
exports.default = FlowTerminational;
