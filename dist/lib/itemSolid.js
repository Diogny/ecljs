"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var dab_1 = require("dabbjs/dist/lib/dab");
var utils_1 = require("dabbjs/dist/lib/utils");
var point_1 = tslib_1.__importDefault(require("dabbjs/dist/lib/point"));
var size_1 = tslib_1.__importDefault(require("dabbjs/dist/lib/size"));
var rect_1 = tslib_1.__importDefault(require("dabbjs/dist/lib/rect"));
var itemsBoard_1 = tslib_1.__importDefault(require("./itemsBoard"));
var extra_1 = require("./extra");
//ItemBoard->ItemSolid->EC
var ItemSolid = /** @class */ (function (_super) {
    tslib_1.__extends(ItemSolid, _super);
    function ItemSolid(container, options) {
        var _this = this;
        options.rot = point_1.default.validateRotation(options.rot);
        _this = _super.call(this, container, options) || this;
        return _this;
    }
    Object.defineProperty(ItemSolid.prototype, "last", {
        get: function () { return this.base.meta.nodes.list.length - 1; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ItemSolid.prototype, "count", {
        get: function () { return this.base.meta.nodes.list.length; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ItemSolid.prototype, "rot", {
        get: function () { return this.$.rot; },
        enumerable: false,
        configurable: true
    });
    /**
     * @description sets rotation of this component to this amount 0-360°
     * @param value 0-360° number value
     */
    ItemSolid.prototype.rotate = function (value) {
        if (this.$.rot != (value = point_1.default.validateRotation(value))) {
            this.$.rot = value;
            this.onProp && this.onProp({
                id: "#" + this.id,
                code: 4 // "rotate" code: 4
            });
        }
        return this.refresh();
    };
    ItemSolid.prototype.rect = function () {
        var size = size_1.default.create(this.box), p = this.p;
        if (this.rot) {
            //rotate (0,0) (width,0) (width,height) (0,height) and get the boundaries respectivelly to the location (x,y)
            var origin_1 = this.origin, angle_1 = -this.rot, points = [[p.x, p.y], [p.x + size.width, p.y], [p.x, p.y + size.height], [p.x + size.width, p.y + size.height]]
                .map(function (p) { return point_1.default.rotateBy(p[0], p[1], origin_1.x, origin_1.y, angle_1); }), x = Math.min.apply(Math, points.map(function (a) { return a.x; })), y = Math.min.apply(Math, points.map(function (a) { return a.y; })), w = Math.max.apply(Math, points.map(function (a) { return a.x; })), h = Math.max.apply(Math, points.map(function (a) { return a.y; }));
            return new rect_1.default(Math.round(x), Math.round(y), Math.round(w - x), Math.round(h - y));
        }
        return new rect_1.default(p.x, p.y, size.width, size.height);
    };
    ItemSolid.prototype.refresh = function () {
        var _this = this;
        var attrs = {
            transform: "translate(" + this.x + " " + this.y + ")"
        }, center = this.origin;
        if (this.rot) {
            attrs.transform += " rotate(" + this.rot + " " + center.x + " " + center.y + ")";
        }
        dab_1.attr(this.g, attrs);
        //check below
        utils_1.each(this.bonds, function (b, key) {
            _this.nodeRefresh(key);
        });
        return this;
    };
    /**
     * @description returns the node information
     * @param node 0-based pin/node number
     * @param onlyPoint true to get internal rotated point only without transformations
     *
     * this returns (x, y) relative to the EC location
     */
    ItemSolid.prototype.node = function (node, nodeOnly) {
        var pin = extra_1.pinInfo(this.base.meta.nodes.list, node);
        if (!pin)
            return;
        if (!nodeOnly) {
            if (this.rot) {
                var center = this.origin, rot = point_1.default.rotateBy(pin.x, pin.y, center.x, center.y, -this.rot);
                pin.x = rot.x;
                pin.y = rot.y;
            }
            pin.x += this.x;
            pin.y += this.y;
        }
        return pin;
    };
    ItemSolid.prototype.defaults = function () {
        return dab_1.extend(_super.prototype.defaults.call(this), {
            rot: 0,
        });
    };
    return ItemSolid;
}(itemsBoard_1.default));
exports.default = ItemSolid;
