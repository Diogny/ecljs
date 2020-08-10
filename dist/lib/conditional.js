"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var flowchartComp_1 = tslib_1.__importDefault(require("./flowchartComp"));
var point_1 = tslib_1.__importDefault(require("./point"));
var FlowConditional = /** @class */ (function (_super) {
    tslib_1.__extends(FlowConditional, _super);
    function FlowConditional() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(FlowConditional.prototype, "fontSize", {
        get: function () { return this.prop("fontSize"); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FlowConditional.prototype, "text", {
        get: function () { return this.prop("text"); },
        enumerable: false,
        configurable: true
    });
    FlowConditional.prototype.setText = function (value) {
        this.prop("text").value = value;
        return this;
    };
    Object.defineProperty(FlowConditional.prototype, "position", {
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
    FlowConditional.prototype.onResize = function (size) {
        //(<string>(<IComponentProperty>this.prop("position")).value) = `${value.x},${value.y}`
        //(<number><unknown>(<IComponentProperty>this.prop("fontSize")).value) = 18
        //resize component
    };
    return FlowConditional;
}(flowchartComp_1.default));
exports.default = FlowConditional;
