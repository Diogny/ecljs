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
        var _this = _super.call(this, container, options) || this;
        _this.g.innerHTML = _this.base.data;
        //I've to set new properties always, because super just copy defaults()
        //later override method defaults()
        _this.__s.rotation = point_1.default.validateRotation(options.rotation);
        var createText = function (attr, text) {
            var svgText = utils_1.tag("text", "", attr);
            return svgText.innerHTML = text, svgText;
        };
        //for labels in N555, 7408, Atmega168
        if (_this.base.meta.label) {
            dab_1.aCld(_this.g, createText({
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
        get: function () { return this.__s.rotation; },
        enumerable: false,
        configurable: true
    });
    ItemSolid.prototype.rotate = function (value) {
        if (this.__s.rotation != (value = point_1.default.validateRotation(value))) {
            //set new value
            this.__s.rotation = value;
            //trigger property changed if applicable
            this.onProp && this.onProp({
                id: "#" + this.id,
                value: this.rotation,
                prop: "rotate",
                where: 1 //signals it was a change inside the object
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
            var origin_1 = this.origin, angle_1 = -this.rotation, points = [[0, 0], [size.width, 0], [0, size.height], [size.width, size.height]]
                .map(function (p) { return new point_1.default(p[0], p[1]).rotateBy(origin_1.x, origin_1.y, angle_1); }), x = Math.min.apply(Math, points.map(function (a) { return a.x; })), y = Math.min.apply(Math, points.map(function (a) { return a.y; })), w = Math.max.apply(Math, points.map(function (a) { return a.x; })), h = Math.max.apply(Math, points.map(function (a) { return a.y; }));
            return new rect_1.default(Math.round(p.x + x), Math.round(p.y + y), Math.round(w - x), Math.round(h - y));
        }
        return new rect_1.default(p.x, p.y, size.width, size.height);
    };
    ItemSolid.prototype.valid = function (node) {
        return !!this.getNode(node);
    };
    ItemSolid.prototype.hghlightable = function (name) {
        return this.valid(name); //for now all valid nodes are highlightables
    };
    ItemSolid.prototype.findNode = function (p) {
        var dx = p.x - this.x, dy = p.y - this.y, rotation = -this.rotation, origin = this.origin;
        for (var i = 0, list = this.base.meta.nodes.list, meta = list[i], len = list.length; i < len; meta = list[++i]) {
            var nodePoint = this.rotation
                ? point_1.default.prototype.rotateBy.call(meta, origin.x, origin.y, rotation)
                : meta;
            //radius 5 =>  5^2 = 25
            if ((Math.pow(dx - nodePoint.x, 2) + Math.pow(dy - nodePoint.y, 2)) <= 81)
                return i;
        }
        return -1;
    };
    ItemSolid.prototype.overNode = function (p, ln) {
        for (var i = 0, len = this.count; i < len; i++) {
            var pin = this.getNode(i);
            if (this.rotation) {
                pin.x = Math.round(pin.rot.x);
                pin.y = Math.round(pin.rot.y);
            }
            //radius 5 =>  5^2 = 25
            if ((Math.pow((p.x - this.x) - pin.x, 2) + Math.pow((p.y - this.y) - pin.y, 2)) <= 81)
                return i;
        }
        return -1;
    };
    ItemSolid.prototype.nodeRefresh = function (node) {
        var _this = this;
        var bond = this.nodeBonds(node), pos = this.getNode(node);
        pos && bond && bond.to.forEach(function (d) {
            var ic = _this.container.get(d.id), p = point_1.default.plus(_this.p, _this.rotation ? pos.rot : pos).round();
            ic && ic.setNode(d.ndx, p); //no transform
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
        utils_1.each(this.bonds, function (b, key) {
            _this.nodeRefresh(key);
        });
        return this;
    };
    //this returns (x, y) relative to the EC location
    ItemSolid.prototype.getNode = function (pinNode) {
        var pin = this.base.meta.nodes.list[pinNode], rotate = function (obj, rotation, center) {
            if (!rotation)
                return obj;
            var rot = obj.rotateBy(center.x, center.y, -rotation);
            return new point_1.default(rot.x, rot.y);
        };
        if (!pin)
            return null;
        pin.rot = rotate(new point_1.default(pin.x, pin.y), this.rotation, this.origin);
        //
        return dab_1.obj(pin);
    };
    ItemSolid.prototype.getNodeRealXY = function (node) {
        var pos = this.getNode(node);
        return pos ? point_1.default.plus(this.p, this.rotation ? pos.rot : pos).round() : null;
    };
    return ItemSolid;
}(itemsBoard_1.default));
exports.default = ItemSolid;
