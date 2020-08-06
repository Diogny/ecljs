"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var point_1 = tslib_1.__importDefault(require("./point"));
var flowchartComponent_1 = tslib_1.__importDefault(require("./flowchartComponent"));
var FlowProcess = /** @class */ (function (_super) {
    tslib_1.__extends(FlowProcess, _super);
    function FlowProcess() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(FlowProcess.prototype, "fontSize", {
        get: function () { return this.prop("fontSize"); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FlowProcess.prototype, "text", {
        get: function () { return this.prop("text"); },
        enumerable: false,
        configurable: true
    });
    FlowProcess.prototype.setText = function (value) {
        this.prop("text").value = value;
        return this;
    };
    Object.defineProperty(FlowProcess.prototype, "position", {
        get: function () {
            var p = point_1.default.parse(this.prop("position"));
            if (p == undefined)
                throw "invalid Point";
            else
                return p;
        },
        enumerable: false,
        configurable: true
    });
    FlowProcess.prototype.onResize = function (size) {
        //(<string>(<IComponentProperty>this.prop("position")).value) = `${value.x},${value.y}`
        //(<number><unknown>(<IComponentProperty>this.prop("fontSize")).value) = 18
        //resize component
    };
    return FlowProcess;
}(flowchartComponent_1.default));
exports.default = FlowProcess;
