"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var dab_1 = require("dabbjs/dist/lib/dab");
var utils_1 = require("dabbjs/dist/lib/utils");
var point_1 = tslib_1.__importDefault(require("dabbjs/dist/lib/point"));
var size_1 = tslib_1.__importDefault(require("dabbjs/dist/lib/size"));
//
var interfaces_1 = require("./interfaces");
var itemsBoard_1 = tslib_1.__importDefault(require("./itemsBoard"));
var extra_1 = require("./extra");
/**
 * @description flowchart base component class
 */
var FlowComp = /** @class */ (function (_super) {
    tslib_1.__extends(FlowComp, _super);
    function FlowComp(flowchart, options) {
        var _this = _super.call(this, flowchart, options) || this;
        //set internal properties
        _this.$.ins = 0;
        _this.$.outs = 0;
        var meta = _this.base.meta;
        _this.$.nodes = dab_1.clone(meta.nodes.list);
        _this.$.minSize = size_1.default.parse(meta.minSize);
        _this.$.fontSize = meta.fontSize;
        //check if these properties were provided in options
        _this.$.size = options.size || size_1.default.parse(meta.size);
        _this.$.text = options.text || meta.text;
        var pos = options.pos || point_1.default.parse(meta.position);
        //create text
        dab_1.aChld(_this.g, _this.$.svgText = extra_1.createText({
            //if options.text was set, then svg text pos may change with UI algorithm
            x: pos.x,
            y: pos.y,
        }, "<tspan x=\"" + pos.x + "\" dy=\"0\">" + (options.text ? '' : _this.text) + "</tspan>"));
        dab_1.css(_this.$.svgText, {
            //if options.text was set, then fontSize may change with UI algorithm
            "font-size": _this.fontSize + "px",
        });
        return _this;
    }
    Object.defineProperty(FlowComp.prototype, "type", {
        get: function () { return interfaces_1.Type.FL; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FlowComp.prototype, "last", {
        get: function () { return this.$.nodes.length - 1; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FlowComp.prototype, "count", {
        get: function () { return this.$.nodes.length; },
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
    /**
     * @description resize the flowchart component
     * @param value new size
     * @returns true if it was resized, false otherwise
     */
    FlowComp.prototype.setSize = function (value) {
        if (!value.equal(this.size)) {
            var s = new size_1.default(value.width - this.minSize.width, value.height - this.minSize.height);
            if (s.positive) {
                //for flowchart conditional
                if (dab_1.toBool(this.base.meta.lockedSize)) {
                    var m = Math.min(value.width, value.height);
                    value.width = m;
                    value.height = m;
                }
                if (this.container.reSizePolicy == "grow") {
                    s = this.size;
                    var sx = value.width - s.width, sy = value.height - s.height;
                    this.$.x -= sx;
                    this.$.y -= sy;
                    value.width += sx;
                    value.height += sy;
                }
                this.$.size = value;
                //internal adjust node points, this calls refresh() inside
                this.onResize(value);
                //call hooked external event if any
                this.$.onResize && this.$.onResize(value);
                return true;
            }
        }
        return false;
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
    Object.defineProperty(FlowComp.prototype, "svgText", {
        /**
         * SVG text, changing SVG text x's value, must change all inside tspan x's values too
         */
        get: function () { return this.$.svgText; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FlowComp.prototype, "text", {
        get: function () { return this.$.text; },
        //probably will be removed, internal, just to dev easier from outside
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
    /**
     * @description perform node readjustment, it calls refresh() function
     * @param size new size
     */
    FlowComp.prototype.onResize = function (size) {
        extra_1.flowNodes(this.$.nodes, size);
        this.refresh();
    };
    /**
     * @description returns the node information
     * @param node 0-based pin/node number
     * @param onlyPoint true to get internal point, false get the real board point
     *
     * this returns (x, y) relative to the EC location
     */
    FlowComp.prototype.node = function (node, nodeOnly) {
        var pin = extra_1.pinInfo(this.$.nodes, node);
        if (pin && !nodeOnly) {
            pin.x += this.x;
            pin.y += this.y;
        }
        return pin;
    };
    /**
     * @description refreshes flowchart location, and updates bonded cmoponents
     */
    FlowComp.prototype.refresh = function () {
        var _this = this;
        dab_1.attr(this.g, {
            transform: "translate(" + this.x + " " + this.y + ")"
        });
        //check below
        utils_1.each(this.bonds, function (b, key) {
            _this.nodeRefresh(key);
        });
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
            padding: 2,
            //can be customized, set to undefined to check on creation
            size: void 0,
            text: void 0,
        });
    };
    return FlowComp;
}(itemsBoard_1.default));
exports.default = FlowComp;
