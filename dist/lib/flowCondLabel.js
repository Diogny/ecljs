"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var label_1 = tslib_1.__importDefault(require("./label"));
var dab_1 = require("dabbjs/dist/lib/dab");
//internal class
var ConditionalLabel = /** @class */ (function (_super) {
    tslib_1.__extends(ConditionalLabel, _super);
    function ConditionalLabel(options) {
        var _this = this;
        //fontSize default Label::fontSize = 15
        options.visible = false;
        isNaN(options.node) && (options.node = -1);
        _this = _super.call(this, options) || this;
        return _this;
    }
    Object.defineProperty(ConditionalLabel.prototype, "node", {
        /**
         * @description liked 0-base node, -1 if not linked
         */
        get: function () { return this.$.node; },
        set: function (value) { this.$.node = value; },
        enumerable: false,
        configurable: true
    });
    ConditionalLabel.prototype.defaults = function () {
        return dab_1.extend(_super.prototype.defaults.call(this), {
            node: -1
        });
    };
    return ConditionalLabel;
}(label_1.default));
exports.default = ConditionalLabel;
