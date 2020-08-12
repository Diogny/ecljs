"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("./interfaces");
var point_1 = tslib_1.__importDefault(require("./point"));
var Item = /** @class */ (function (_super) {
    tslib_1.__extends(Item, _super);
    function Item(options) {
        var _this = this;
        //merge defaults and deep copy
        //all default properties must be refrenced from this or this.__s
        // options is for custom options only
        var optionsClass = options.class;
        delete options.class;
        _this = _super.call(this, options) || this;
        optionsClass && (_this.__s.class = _this.__s.class ? ' ' : '' + optionsClass); // unique((this.class + " " + optionsClass).split(' ')).join(' '));
        _this.__s.x = _this.__s.x || 0;
        _this.__s.y = _this.__s.y || 0;
        return _this;
    }
    Object.defineProperty(Item.prototype, "name", {
        get: function () { return this.__s.name; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Item.prototype, "id", {
        get: function () { return this.__s.id; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Item.prototype, "x", {
        get: function () { return this.__s.x; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Item.prototype, "y", {
        get: function () { return this.__s.y; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Item.prototype, "p", {
        get: function () { return new point_1.default(this.x, this.y); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Item.prototype, "class", {
        get: function () { return this.__s.class; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Item.prototype, "visible", {
        get: function () { return this.__s.visible; },
        enumerable: false,
        configurable: true
    });
    Item.prototype.setVisible = function (value) {
        this.__s.visible = !!value;
        return this;
    };
    Item.prototype.move = function (x, y) {
        this.__s.x = x | 0;
        this.__s.y = y | 0;
        return this;
    };
    Item.prototype.movePoint = function (p) {
        return this.move(p.x, p.y);
    };
    Item.prototype.translate = function (dx, dy) {
        return this.move(this.x + (dx | 0), this.y + (dy | 0));
    };
    Item.prototype.defaults = function () {
        return {
            id: "",
            name: "",
            x: 0,
            y: 0,
            class: "",
            visible: true,
            label: "",
            base: void 0 //this comes from createItem by default
        };
    };
    return Item;
}(interfaces_1.Base));
exports.default = Item;
