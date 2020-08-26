"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var flowComp_1 = tslib_1.__importDefault(require("./flowComp"));
var dab_1 = require("./dab");
var utils_1 = require("./utils");
var rect_1 = tslib_1.__importDefault(require("./rect"));
var FlowProcess = /** @class */ (function (_super) {
    tslib_1.__extends(FlowProcess, _super);
    function FlowProcess(flowchart, options) {
        var _this = _super.call(this, flowchart, options) || this;
        //get rect, should be this.g.firstChild
        _this.$.rect = _this.g.firstElementChild;
        _this.refresh();
        return _this;
    }
    Object.defineProperty(FlowProcess.prototype, "body", {
        /**
         * contains the main frame body, where full component size can be calculated
         */
        get: function () { return this.$.rect; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FlowProcess.prototype, "clientRect", {
        /**
         * client rect where text should be safely contained
         */
        get: function () {
            return rect_1.default.create(this.body.getBoundingClientRect(), true).grow(-this.$.padding, -this.$.padding);
        },
        enumerable: false,
        configurable: true
    });
    FlowProcess.prototype.refresh = function () {
        //calculate rect
        dab_1.attr(this.$.rect, {
            width: this.size.width,
            height: this.size.height
        });
        //later text resize goes here
        //...
        return _super.prototype.refresh.call(this), this;
    };
    FlowProcess.prototype.onResize = function (size) {
        utils_1.flowNodes(this.base.meta.nodes.list, size);
    };
    return FlowProcess;
}(flowComp_1.default));
exports.default = FlowProcess;
