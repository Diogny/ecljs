"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var flowComp_1 = tslib_1.__importDefault(require("./flowComp"));
var FlowTerminational = /** @class */ (function (_super) {
    tslib_1.__extends(FlowTerminational, _super);
    function FlowTerminational() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // public onResize(size: Size): void {
    // 	//(<string>(<IComponentProperty>this.prop("position")).value) = `${value.x},${value.y}`
    // 	//(<number><unknown>(<IComponentProperty>this.prop("fontSize")).value) = 18
    // 	//resize component
    FlowTerminational.prototype.onResize = function (size) {
        //all descendants must implement this function
        throw "no resize implemented";
    };
    return FlowTerminational;
}(flowComp_1.default));
exports.default = FlowTerminational;
