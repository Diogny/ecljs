"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("./interfaces");
var dab_1 = require("./dab");
var size_1 = tslib_1.__importDefault(require("./size"));
var itemSolid_1 = tslib_1.__importDefault(require("./itemSolid"));
/**
 * @description flowchart base component class
 */
var FlowComp = /** @class */ (function (_super) {
    tslib_1.__extends(FlowComp, _super);
    function FlowComp(flowchart, options) {
        var _this = _super.call(this, flowchart, options) || this;
        _this.refresh();
        return _this;
    }
    Object.defineProperty(FlowComp.prototype, "type", {
        get: function () { return interfaces_1.Type.FLOWCHART; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FlowComp.prototype, "size", {
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
    Object.defineProperty(FlowComp.prototype, "inputs", {
        get: function () { return this.prop("inputs"); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FlowComp.prototype, "outputs", {
        get: function () { return this.prop("outputs"); },
        enumerable: false,
        configurable: true
    });
    FlowComp.prototype.setNode = function (node, p) {
        //Some code tries to call this, investigate later...
        throw 'somebody called me, not good!';
    };
    FlowComp.prototype.defaults = function () {
        return dab_1.extend(_super.prototype.defaults.call(this), {
            class: "fl",
            dir: true,
        });
    };
    return FlowComp;
}(itemSolid_1.default));
exports.default = FlowComp;
