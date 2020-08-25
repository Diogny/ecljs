"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("./interfaces");
var dab_1 = require("./dab");
var size_1 = tslib_1.__importDefault(require("./size"));
var itemSolid_1 = tslib_1.__importDefault(require("./itemSolid"));
var point_1 = tslib_1.__importDefault(require("./point"));
var utils_1 = require("./utils");
/**
 * @description flowchart base component class
 */
var FlowComp = /** @class */ (function (_super) {
    tslib_1.__extends(FlowComp, _super);
    function FlowComp(flowchart, options) {
        var _this = _super.call(this, flowchart, options) || this;
        //get size from properties
        //(<string>(<IComponentProperty>this.prop("size")).value) = `${value.width},${value.height}`;
        _this.$.size = size_1.default.parse(_this.base.meta.size);
        _this.$.minSize = size_1.default.parse(_this.base.meta.minSize);
        _this.$.fontSize = _this.base.meta.fontSize;
        _this.$.text = _this.base.meta.text;
        _this.$.pos = point_1.default.parse(_this.base.meta.position);
        //create text if defined
        dab_1.aChld(_this.g, _this.$.svgText = utils_1.createText({
            x: _this.$.pos.x,
            y: _this.$.pos.y,
        }, _this.text));
        dab_1.css(_this.$.svgText, {
            "font-size": _this.fontSize + "px",
        });
        return _this;
    }
    Object.defineProperty(FlowComp.prototype, "type", {
        get: function () { return interfaces_1.Type.FLOWCHART; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FlowComp.prototype, "minSize", {
        get: function () { return this.$.minSize; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FlowComp.prototype, "size", {
        get: function () { return this.$.size; },
        enumerable: false,
        configurable: true
    });
    FlowComp.prototype.setSize = function (value) {
        if (!value.equal(this.size)) {
            var s = new size_1.default(value.width - this.minSize.width, value.height - this.minSize.height);
            if (s.positive) {
                this.$.size = value;
                //internal adjust node points
                this.onResize(value);
                this.refresh();
                //hooked events if any
                this.$.onResize && this.$.onResize(value);
            }
        }
        return this;
    };
    Object.defineProperty(FlowComp.prototype, "inputs", {
        /**
         * @description maximum inbounds
         */
        get: function () { return this.base.meta.inputs; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FlowComp.prototype, "ins", {
        /**
         * @description current inbounds
         */
        get: function () { return this.$.ins; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FlowComp.prototype, "outputs", {
        /**
         * @description maximum outbounds
         */
        get: function () { return this.base.meta.outputs; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FlowComp.prototype, "outs", {
        /**
         * @description current outbounds
         */
        get: function () { return this.$.outs; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FlowComp.prototype, "text", {
        //will be removed, internal, just to dev easier from outside
        get: function () { return this.$.text; },
        set: function (value) { this.$.text = value; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FlowComp.prototype, "fontSize", {
        get: function () { return this.$.fontSize; },
        set: function (value) { this.$.fontSize = value; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FlowComp.prototype, "pos", {
        get: function () { return this.$.pos; },
        set: function (value) { this.$.pos = value; },
        enumerable: false,
        configurable: true
    });
    FlowComp.prototype.setNode = function (node, p) {
        //nobody should call this
        return this;
    };
    //highlights from itemSolid must be overridden here to allow inputs/outputs when available
    //	DirType = 0,	show only available outputs
    //			= 1,	show ony available inputs
    //wiring must send signal if it's starting or ending the bond
    FlowComp.prototype.defaults = function () {
        return dab_1.extend(_super.prototype.defaults.call(this), {
            class: "fl",
            dir: true,
            onResize: void 0,
            ins: 0,
            outs: 0
        });
    };
    return FlowComp;
}(itemSolid_1.default));
exports.default = FlowComp;
