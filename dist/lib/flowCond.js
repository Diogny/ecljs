"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var dab_1 = require("dabbjs/dist/lib/dab");
var rect_1 = tslib_1.__importDefault(require("dabbjs/dist/lib/rect"));
var flowComp_1 = tslib_1.__importDefault(require("./flowComp"));
var flowCondLabel_1 = tslib_1.__importDefault(require("./flowCondLabel"));
var FlowConditional = /** @class */ (function (_super) {
    tslib_1.__extends(FlowConditional, _super);
    function FlowConditional(flowchart, options) {
        var _this = _super.call(this, flowchart, options) || this;
        _this.$.path = _this.g.firstElementChild;
        _this.$.true = new flowCondLabel_1.default({ text: 'true', node: options["true"] });
        _this.$.false = new flowCondLabel_1.default({ text: 'false', node: options["false"] });
        _this.onResize(_this.size);
        return _this;
    }
    Object.defineProperty(FlowConditional.prototype, "body", {
        /**
        * contains the main frame body, where full component size can be calculated
        */
        get: function () { return this.$.path; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FlowConditional.prototype, "clientRect", {
        /**
         * client rect where text should be safely contained
         */
        get: function () {
            var s = this.size, r = new rect_1.default(0, 0, s.width | 0, s.height | 0), sw = r.width / 4 | 0, sh = r.height / 4 | 0;
            return r.grow(-sw - this.$.padding, -sh - this.$.padding);
        },
        enumerable: false,
        configurable: true
    });
    /**
     * @description this happens after component was inserted in the DOM
     */
    FlowConditional.prototype.onDOM = function () {
        this.$.true && this.g.insertAdjacentElement("afterend", this.$.true.g);
        this.$.false && this.g.insertAdjacentElement("afterend", this.$.false.g);
    };
    FlowConditional.prototype.setVisible = function (value) {
        _super.prototype.setVisible.call(this, value);
        this.$.true && this.$.true.setVisible(this.$.true.node == -1 ? false : value);
        this.$.false && this.$.false.setVisible(this.$.false.node == -1 ? false : value);
        return this;
    };
    FlowConditional.prototype.remove = function () {
        var _a, _b;
        //delete label if any first
        this.$.true && ((_a = this.g.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(this.$.true.g));
        this.$.false && ((_b = this.g.parentNode) === null || _b === void 0 ? void 0 : _b.removeChild(this.$.false.g));
        _super.prototype.remove.call(this);
    };
    /**
     * @description link a condition label to a node
     * @param cond true for true label, false for false label
     * @param node 0-base node, or -1 to unlink/hide
     */
    FlowConditional.prototype.setLabel = function (cond, node) {
        var label = this.getLabel(cond);
        if (label && node >= -1 && node < this.count) {
            label.node = node;
            positionLabel(this, label);
        }
    };
    /**
     * @description gets label associated with a Condition
     * @param cond true for true label, false for false label
     */
    FlowConditional.prototype.getLabel = function (cond) {
        return this.$[String(!!cond)];
    };
    /**
     * @description refreshes flowchart location, size, and updates bonded cmoponents
     */
    FlowConditional.prototype.refresh = function () {
        var w = this.size.width / 2 | 0, h = this.size.height / 2 | 0;
        dab_1.attr(this.$.path, {
            d: "M " + w + ",0 L " + this.size.width + "," + h + " L " + w + "," + this.size.height + " L 0," + h + " Z"
        });
        _super.prototype.refresh.call(this);
        positionLabel(this, this.$.true);
        positionLabel(this, this.$.false);
        return this;
    };
    return FlowConditional;
}(flowComp_1.default));
exports.default = FlowConditional;
function positionLabel(fl, label) {
    if (label.setVisible(label.node != -1).visible) {
        var wh = label.g.getBoundingClientRect(), w = fl.size.width, w2 = w / 2, h = fl.size.height, h2 = h / 2, x = fl.x, y = fl.y, n = label.node, pad = 5;
        (!(n & 1) && (x += w2 + pad), 1) || (x += n == 1 ? w + pad : -wh.width - pad);
        ((n & 1) && (y += h2 - wh.height - pad), 1) || (x += n == 0 ? -wh.height - pad : h + pad);
        label.move(x, y);
    }
}
