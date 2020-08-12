"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("./interfaces");
var dab_1 = require("./dab");
var utils_1 = require("./utils");
var label_1 = tslib_1.__importDefault(require("./label"));
var Tooltip = /** @class */ (function (_super) {
    tslib_1.__extends(Tooltip, _super);
    function Tooltip(options) {
        var _this = _super.call(this, options) || this;
        _this.g.insertBefore(_this.__s.svgrect = utils_1.tag("rect", "", {
            x: 0,
            y: 0,
            rx: _this.borderRadius
        }), _this.__s.svgtext);
        return _this;
    }
    Object.defineProperty(Tooltip.prototype, "type", {
        get: function () { return interfaces_1.Type.TOOLTIP; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Tooltip.prototype, "borderRadius", {
        get: function () { return this.__s.borderRadius; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Tooltip.prototype, "size", {
        /*	DOESN'T WORK
        set visible(value: boolean) {
            //weird way to access an ancestor property  super.visible doesn't work
            super["visible"] = value;
        }
        */
        get: function () {
            var b = this.__s.svgtext.getBBox();
            return dab_1.obj({
                width: Math.round(b.width) + 10,
                height: Math.round(b.height) + this.__s.gap
            });
        },
        enumerable: false,
        configurable: true
    });
    Tooltip.prototype.setVisible = function (value) {
        _super.prototype.setVisible.call(this, value);
        //clear values
        //because Firefox give DOM not loaded on g.getBox() because it's not visible yet
        // so I've to display tooltip in DOM and then continue setting text, move, font-size,...
        this.__s.text = this.__s.svgtext.innerHTML = '';
        return this;
    };
    Tooltip.prototype.setBorderRadius = function (value) {
        this.__s.borderRadius = value | 0;
        return this.build();
    };
    Tooltip.prototype.build = function () {
        this.__s.gap = Math.round(this.fontSize / 2) + 1;
        dab_1.attr(this.__s.svgtext, {
            "font-size": this.fontSize,
            x: Math.round(this.__s.gap / 2),
            y: this.fontSize //+ 8
        });
        var s = this.size;
        dab_1.attr(this.__s.svgrect, {
            width: s.width,
            height: s.height,
            rx: this.borderRadius
        });
        return this;
    };
    Tooltip.prototype.setText = function (value) {
        var arr = dab_1.isStr(value) ?
            value.split(/\r?\n/) :
            value, txtArray = [];
        //catch UI error here
        //if (!Array.isArray(arr)) {
        //	console.log("ooooh")
        //}
        this.__s.svgtext.innerHTML = arr.map(function (value, ndx) {
            var txt = '', attrs = '';
            if (dab_1.isStr(value)) {
                txt = value;
            }
            else if (dab_1.pojo(value)) {
                txt = value.text;
                attrs = utils_1.map(utils_1.filter(value, function (val, key) { return key != 'text'; }), function (v, k) { return k + "=\"" + v + "\""; }).join('');
            }
            txtArray.push(txt);
            return "<tspan x=\"5\" dy=\"" + ndx + ".1em\"" + attrs + ">" + txt + "</tspan>";
        }).join('');
        //set text
        this.__s.text = txtArray.join('\r\n');
        return this.build();
    };
    Tooltip.prototype.defaults = function () {
        return dab_1.extend(_super.prototype.defaults.call(this), {
            name: "tooltip",
            class: "tooltip",
            borderRadius: 4
        });
    };
    return Tooltip;
}(label_1.default));
exports.default = Tooltip;
