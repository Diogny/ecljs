"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var dab_1 = require("dabbjs/dist/lib/dab");
var point_1 = tslib_1.__importDefault(require("dabbjs/dist/lib/point"));
var interfaces_1 = require("./interfaces");
var itemSolid_1 = tslib_1.__importDefault(require("./itemSolid"));
var label_1 = tslib_1.__importDefault(require("./label"));
var extra_1 = require("./extra");
var size_1 = tslib_1.__importDefault(require("dabbjs/dist/lib/size"));
var EC = /** @class */ (function (_super) {
    tslib_1.__extends(EC, _super);
    function EC(circuit, options) {
        var _this = _super.call(this, circuit, options) || this;
        _this.$.size = options.size || size_1.default.parse(_this.base.meta.size);
        var m = _this.base.meta;
        //for labels in N555, 7408, Atmega168
        if (m.label) {
            dab_1.aChld(_this.g, extra_1.createText({
                x: m.label.x,
                y: m.label.y,
                "class": m.label.class
            }, m.label.text));
        }
        //add node labels for DIP packages
        if (m.nodes.createLabels) {
            var pins = _this.count / 2;
            for (var y = 48, x = 7, i = 0, factor = 20; y > 0; y -= 44, x += (factor = -factor))
                for (var col = 0; col < pins; col++, i++, x += factor)
                    dab_1.aChld(_this.g, extra_1.createText({ x: x, y: y }, i + ""));
        }
        //create label if defined
        if (m.labelId) {
            _this.$.boardLabel = new label_1.default({
                //fontSize default Label::fontSize = 15
                x: m.labelId.x,
                y: m.labelId.y,
                text: _this.id,
                visible: false
            });
        }
        _this.refresh();
        //signal component creation
        _this.onProp && _this.onProp({
            id: "#" + _this.id,
            code: 1 // "create" code = 1
        });
        return _this;
    }
    Object.defineProperty(EC.prototype, "type", {
        get: function () { return interfaces_1.Type.EC; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(EC.prototype, "size", {
        /**
         * @description returns the read-only size of this component
         */
        get: function () { return this.$.size.clone(); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(EC.prototype, "boardLabel", {
        /**
         * @description returns then board label outerHTML if any
         */
        get: function () { var _a; return (_a = this.$.boardLabel) === null || _a === void 0 ? void 0 : _a.g.outerHTML; },
        enumerable: false,
        configurable: true
    });
    EC.prototype.refresh = function () {
        _super.prototype.refresh.call(this);
        if (this.$.boardLabel) {
            var pos = point_1.default.plus(this.p, this.$.boardLabel.p), center = this.origin, attrs = {
                transform: "translate(" + pos.x + " " + pos.y + ")"
            };
            this.rot && (center = point_1.default.minus(point_1.default.plus(this.p, center), pos),
                attrs.transform += " rotate(" + this.rot + " " + center.x + " " + center.y + ")");
            dab_1.attr(this.$.boardLabel.g, attrs);
        }
        return this;
    };
    EC.prototype.setVisible = function (value) {
        _super.prototype.setVisible.call(this, value);
        this.$.boardLabel && this.$.boardLabel.setVisible(value);
        return this;
    };
    /**
     * removes this electronic component form the board
     */
    EC.prototype.remove = function () {
        var _a;
        //delete label if any first
        this.$.boardLabel && ((_a = this.g.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(this.$.boardLabel.g));
        _super.prototype.remove.call(this);
    };
    /**
     * this happens when this component was inserted in the board
     */
    EC.prototype.onDOM = function () {
        this.$.boardLabel && (this.g.insertAdjacentElement("afterend", this.$.boardLabel.g), this.$.boardLabel.setVisible(true));
    };
    EC.prototype.defaults = function () {
        return dab_1.extend(_super.prototype.defaults.call(this), {
            class: "ec",
            boardLabel: void 0,
        });
    };
    return EC;
}(itemSolid_1.default));
exports.default = EC;
