"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var dab_1 = require("./dab");
var utils_1 = require("./utils");
var rect_1 = tslib_1.__importDefault(require("./rect"));
var size_1 = tslib_1.__importDefault(require("./size"));
var point_1 = tslib_1.__importDefault(require("./point"));
var itemsBoard_1 = tslib_1.__importDefault(require("./itemsBoard"));
//ItemBoard->ItemSolid->EC
var ItemSolid = /** @class */ (function (_super) {
    tslib_1.__extends(ItemSolid, _super);
    function ItemSolid(container, options) {
        var _this = this;
        options.rotation = point_1.default.validateRotation(options.rotation);
        _this = _super.call(this, container, options) || this;
        _this.g.innerHTML = _this.base.data;
        var createText = function (attr, text) {
            var svgText = utils_1.tag("text", "", attr);
            return svgText.innerHTML = text, svgText;
        };
        //for labels in N555, 7408, Atmega168
        if (_this.base.meta.label) {
            dab_1.aChld(_this.g, createText({
                x: _this.base.meta.label.x,
                y: _this.base.meta.label.y,
                "class": _this.base.meta.label.class
            }, _this.base.meta.label.text));
        }
        return _this;
    }
    Object.defineProperty(ItemSolid.prototype, "last", {
        get: function () { return this.base.meta.nodes.list.length - 1; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ItemSolid.prototype, "count", {
        get: function () {
            return this.base.meta.nodes.list.length;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ItemSolid.prototype, "rotation", {
        get: function () { return this.$.rotation; },
        enumerable: false,
        configurable: true
    });
    ItemSolid.prototype.rotate = function (value) {
        if (this.$.rotation != (value = point_1.default.validateRotation(value))) {
            this.$.rotation = value;
            this.onProp && this.onProp({
                id: "#" + this.id,
                code: 4 // "rotate" code: 4
            });
        }
        return this.refresh();
    };
    ItemSolid.prototype.move = function (x, y) {
        _super.prototype.move.call(this, x, y);
        return this.refresh();
    };
    ItemSolid.prototype.rect = function () {
        var size = size_1.default.create(this.box), p = this.p;
        if (this.rotation) {
            //rotate (0,0) (width,0) (width,height) (0,height) and get the boundaries respectivelly to the location (x,y)
            var origin_1 = this.origin, angle_1 = -this.rotation, points = [[p.x, p.y], [p.x + size.width, p.y], [p.x, p.y + size.height], [p.x + size.width, p.y + size.height]]
                .map(function (p) { return point_1.default.rotateBy(p[0], p[1], origin_1.x, origin_1.y, angle_1); }), x = Math.min.apply(Math, points.map(function (a) { return a.x; })), y = Math.min.apply(Math, points.map(function (a) { return a.y; })), w = Math.max.apply(Math, points.map(function (a) { return a.x; })), h = Math.max.apply(Math, points.map(function (a) { return a.y; }));
            return new rect_1.default(Math.round(x), Math.round(y), Math.round(w - x), Math.round(h - y));
        }
        return new rect_1.default(p.x, p.y, size.width, size.height);
    };
    ItemSolid.prototype.valid = function (node) { return node >= 0 && node < this.count; };
    ItemSolid.prototype.hghlightable = function (node) { return this.valid(node); };
    ItemSolid.prototype.overNode = function (p, ln) {
        for (var i = 0, len = this.count; i < len; i++) {
            var node = this.getNode(i);
            //radius 5 =>  5^2 = 25
            if ((Math.pow((p.x) - node.x, 2) + Math.pow((p.y) - node.y, 2)) <= ItemSolid.nodeArea)
                return i;
        }
        return -1;
    };
    ItemSolid.prototype.nodeRefresh = function (node) {
        var _this = this;
        var bond = this.nodeBonds(node), p = this.getNode(node);
        p && bond && bond.to.forEach(function (d) {
            var ic = _this.container.get(d.id);
            ic && ic.setNode(d.ndx, p);
        });
        return this;
    };
    ItemSolid.prototype.refresh = function () {
        var _this = this;
        var attrs = {
            transform: "translate(" + this.x + " " + this.y + ")"
        }, center = this.origin;
        if (this.rotation) {
            attrs.transform += " rotate(" + this.rotation + " " + center.x + " " + center.y + ")";
        }
        dab_1.attr(this.g, attrs);
        //check below
        utils_1.each(this.bonds, function (b, key) {
            _this.nodeRefresh(key);
        });
        return this;
    };
    //this returns (x, y) relative to the EC location
    /**
     *
     * @param pinNode pin/node number
     * @param onlyPoint true to get internal rotated point only without transformations
     */
    ItemSolid.prototype.getNode = function (node, nodeOnly) {
        var pin = pinInfo(this, node);
        if (!pin)
            return;
        if (!nodeOnly) {
            if (this.rotation) {
                var center = this.origin, rot = point_1.default.rotateBy(pin.x, pin.y, center.x, center.y, -this.rotation);
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
            rotation: 0,
        });
    };
    ItemSolid.nodeArea = 81;
    return ItemSolid;
}(itemsBoard_1.default));
exports.default = ItemSolid;
function pinInfo(that, node) {
    var pin = that.base.meta.nodes.list[node];
    return pin && {
        x: pin.x,
        y: pin.y,
        label: pin.label
    };
}
