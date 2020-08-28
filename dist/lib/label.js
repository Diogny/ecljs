"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var dab_1 = require("dabbjs/dist/lib/dab");
var utils_1 = require("dabbjs/dist/lib/utils");
var interfaces_1 = require("./interfaces");
var itemsBase_1 = tslib_1.__importDefault(require("./itemsBase"));
var Label = /** @class */ (function (_super) {
    tslib_1.__extends(Label, _super);
    function Label(options) {
        var _this = this;
        options.visible = false;
        _this = _super.call(this, options) || this;
        _this.$.text = '';
        _this.$.svgtext = utils_1.tag("text", "", {});
        dab_1.aChld(_this.g, _this.$.svgtext);
        return _this;
    }
    Object.defineProperty(Label.prototype, "type", {
        get: function () { return interfaces_1.Type.LABEL; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Label.prototype, "text", {
        get: function () { return this.$.text; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Label.prototype, "size", {
        get: function () {
            var b = this.$.svgtext.getBBox();
            return dab_1.obj({
                width: Math.round(b.width),
                height: Math.round(b.height)
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Label.prototype, "fontSize", {
        get: function () { return this.$.fontSize; },
        enumerable: false,
        configurable: true
    });
    Label.prototype.move = function (x, y) {
        _super.prototype.move.call(this, x, y);
        dab_1.attr(this.g, { transform: "translate(" + this.x + " " + this.y + ")" });
        return this;
    };
    Label.prototype.setFontSize = function (value) {
        this.$.fontSize = value;
        return this.build();
    };
    Label.prototype.build = function () {
        dab_1.attr(this.$.svgtext, {
            "font-size": this.fontSize,
            x: 0,
            y: 0
        });
        return this;
    };
    Label.prototype.setText = function (value) {
        this.$.svgtext.innerHTML = this.$.text = value;
        return this.build();
    };
    Label.prototype.defaults = function () {
        return dab_1.extend(_super.prototype.defaults.call(this), {
            name: "label",
            class: "label",
            fontSize: 50
        });
    };
    return Label;
}(itemsBase_1.default));
exports.default = Label;
