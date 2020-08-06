"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("./interfaces");
var dab_1 = require("./dab");
var size_1 = tslib_1.__importDefault(require("./size"));
var itemSolid_1 = tslib_1.__importDefault(require("./itemSolid"));
var FlowchartComponent = /** @class */ (function (_super) {
    tslib_1.__extends(FlowchartComponent, _super);
    function FlowchartComponent(container, options) {
        return _super.call(this, container, options) || this;
    }
    Object.defineProperty(FlowchartComponent.prototype, "type", {
        get: function () { return interfaces_1.Type.FLOWCHART; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FlowchartComponent.prototype, "size", {
        get: function () {
            var s = size_1.default.parse(this.prop("size"));
            if (s == undefined)
                throw "invalid Size";
            else
                return s;
        },
        set: function (value) {
            this.prop("size").value = value.width + "," + value.height;
            this.onResize(value);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FlowchartComponent.prototype, "inputs", {
        get: function () { return this.prop("inputs"); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FlowchartComponent.prototype, "outputs", {
        get: function () { return this.prop("outputs"); },
        enumerable: false,
        configurable: true
    });
    FlowchartComponent.prototype.setNode = function (node, p) {
        //Some code tries to call this, investigate later...
        throw 'somebody called me, not good!';
    };
    FlowchartComponent.prototype.propertyDefaults = function () {
        return dab_1.extend(_super.prototype.propertyDefaults.call(this), {
            directional: true,
        });
    };
    return FlowchartComponent;
}(itemSolid_1.default));
exports.default = FlowchartComponent;
