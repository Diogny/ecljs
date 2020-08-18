"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var dab_1 = require("./dab");
var utils_1 = require("./utils");
var point_1 = tslib_1.__importDefault(require("./point"));
var item_1 = tslib_1.__importDefault(require("./item"));
var CompNode = /** @class */ (function (_super) {
    tslib_1.__extends(CompNode, _super);
    function CompNode(options) {
        var _this = _super.call(this, options) || this;
        //create SVG
        _this.$.g = utils_1.tag("circle", "", {
            "svg-type": _this.name,
            class: _this.class
        });
        _this.refresh();
        return _this;
    }
    Object.defineProperty(CompNode.prototype, "p", {
        get: function () { return new point_1.default(this.x, this.y); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CompNode.prototype, "node", {
        //get name() is nodeName 
        get: function () { return this.$.node; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CompNode.prototype, "radius", {
        get: function () { return this.$.radius; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CompNode.prototype, "g", {
        get: function () { return this.$.g; },
        enumerable: false,
        configurable: true
    });
    CompNode.prototype.move = function (x, y) {
        _super.prototype.move.call(this, x, y);
        return this.refresh();
    };
    CompNode.prototype.setVisible = function (value) {
        //this item is always visible as long as it's in the DOM, hide means to remove it from DOM and destroy object
        return this;
    };
    CompNode.prototype.setRadius = function (value) {
        this.$.radius = value <= 0 ? 5 : value;
        return this.refresh();
    };
    CompNode.prototype.refresh = function () {
        var obj = {
            cx: this.x,
            cy: this.y,
            r: this.radius
        };
        obj[this.name] = this.node;
        return (dab_1.attr(this.g, obj), this);
    };
    CompNode.prototype.defaults = function () {
        return dab_1.extend(_super.prototype.defaults.call(this), {
            name: "node",
            node: -1,
            label: "",
            g: void 0,
            radius: 5,
        });
    };
    return CompNode;
}(item_1.default));
exports.default = CompNode;
