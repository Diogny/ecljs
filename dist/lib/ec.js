"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("./interfaces");
var dab_1 = require("./dab");
var utils_1 = require("./utils");
var point_1 = tslib_1.__importDefault(require("./point"));
var itemSolid_1 = tslib_1.__importDefault(require("./itemSolid"));
var label_1 = tslib_1.__importDefault(require("./label"));
var EC = /** @class */ (function (_super) {
    tslib_1.__extends(EC, _super);
    function EC(circuit, options) {
        var _this = _super.call(this, circuit, options) || this;
        var createText = function (attr, text) {
            var svgText = utils_1.tag("text", "", attr);
            return svgText.innerHTML = text, svgText;
        };
        //add node labels for DIP packages
        if (_this.base.meta.nodes.createLabels) {
            var pins = _this.count / 2;
            for (var y = 55, x = 7, i = 0, factor = 20; y > 0; y -= 44, x += (factor = -factor))
                for (var col = 0; col < pins; col++, i++, x += factor)
                    dab_1.aChld(_this.g, createText({ x: x, y: y }, i + ""));
        }
        //create label if defined
        if (_this.base.meta.labelId) {
            _this.$.boardLabel = new label_1.default({
                fontSize: 15,
                x: _this.base.meta.labelId.x,
                y: _this.base.meta.labelId.y
            });
            _this.boardLabel.setText(_this.label);
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
    Object.defineProperty(EC.prototype, "boardLabel", {
        get: function () { return this.$.boardLabel; },
        enumerable: false,
        configurable: true
    });
    EC.prototype.refresh = function () {
        _super.prototype.refresh.call(this);
        if (this.boardLabel) {
            var pos = point_1.default.plus(this.p, this.boardLabel.p), center = this.origin, attrs = {
                transform: "translate(" + pos.x + " " + pos.y + ")"
            };
            this.rotation && (center = point_1.default.minus(point_1.default.plus(this.p, center), pos),
                attrs.transform += " rotate(" + this.rotation + " " + center.x + " " + center.y + ")");
            dab_1.attr(this.boardLabel.g, attrs);
        }
        return this;
    };
    EC.prototype.setNode = function (node, p) {
        //Some code tries to call this, investigate later...
        throw 'somebody called me, not good!';
    };
    EC.prototype.setVisible = function (value) {
        _super.prototype.setVisible.call(this, value);
        this.boardLabel && this.boardLabel.setVisible(value);
        return this;
    };
    EC.prototype.remove = function () {
        var _a;
        //delete label if any first
        this.boardLabel && ((_a = this.g.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(this.boardLabel.g));
        _super.prototype.remove.call(this);
    };
    EC.prototype.afterDOMinserted = function () {
        this.boardLabel && (this.g.insertAdjacentElement("afterend", this.boardLabel.g), this.boardLabel.setVisible(true));
    };
    EC.prototype.defaults = function () {
        return dab_1.extend(_super.prototype.defaults.call(this), {
            class: "ec",
            boardLabel: void 0
        });
    };
    return EC;
}(itemSolid_1.default));
exports.default = EC;
