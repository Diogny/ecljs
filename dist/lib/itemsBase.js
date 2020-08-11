"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var dab_1 = require("./dab");
var utils_1 = require("./utils");
var rect_1 = tslib_1.__importDefault(require("./rect"));
var point_1 = tslib_1.__importDefault(require("./point"));
var item_1 = tslib_1.__importDefault(require("./item"));
var components_1 = tslib_1.__importDefault(require("./components"));
var ItemBase = /** @class */ (function (_super) {
    tslib_1.__extends(ItemBase, _super);
    function ItemBase(options) {
        var _this = _super.call(this, options) || this;
        var base = components_1.default.find(_this.name);
        if (!base)
            throw "cannot create component";
        _this.__s.props = dab_1.obj(base.props);
        var classArr = dab_1.isStr(_this.class) ? _this.class.split(' ') : [];
        !_this.__s.visible && (classArr.push("hide"));
        _this.__s.g = utils_1.tag("g", _this.__s.id, {
            class: (_this.__s.class = classArr.join(' '))
        });
        return _this;
    }
    Object.defineProperty(ItemBase.prototype, "base", {
        get: function () { return this.__s.base; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ItemBase.prototype, "g", {
        get: function () { return this.__s.g; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ItemBase.prototype, "ClientRect", {
        get: function () {
            var b = this.g.getBoundingClientRect();
            return dab_1.obj({
                width: b.width | 0,
                height: b.height | 0
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ItemBase.prototype, "box", {
        get: function () { return this.g.getBBox(); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ItemBase.prototype, "origin", {
        get: function () {
            var b = this.box;
            return new point_1.default((b.x + b.width / 2) | 0, (b.y + b.height / 2) | 0);
        },
        enumerable: false,
        configurable: true
    });
    ItemBase.prototype.rect = function () {
        return new rect_1.default(this.p.x, this.p.y, this.box.width, this.box.height);
    };
    ItemBase.prototype.setVisible = function (value) {
        _super.prototype.setVisible.call(this, value);
        this.visible ? dab_1.rCl(this.g, "hide") : dab_1.aCl(this.g, "hide");
        return this;
    };
    ItemBase.prototype.remove = function () {
        var _a;
        (_a = this.g.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(this.g);
    };
    ItemBase.prototype.afterDOMinserted = function () { };
    ItemBase.prototype.prop = function (propName) {
        return this.__s.props[propName];
    };
    return ItemBase;
}(item_1.default));
exports.default = ItemBase;
