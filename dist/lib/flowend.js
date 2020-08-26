"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var terminational_1 = tslib_1.__importDefault(require("./terminational"));
var rect_1 = tslib_1.__importDefault(require("./rect"));
var FlowEnd = /** @class */ (function (_super) {
    tslib_1.__extends(FlowEnd, _super);
    function FlowEnd() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(FlowEnd.prototype, "body", {
        /**
             * contains the main frame body, where full component size can be calculated
             *
             * NOT WORKING YET
             */
        get: function () { return this.g; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FlowEnd.prototype, "clientRect", {
        /**
         * client rect where text should be safely contained
         *
         * NOT WORKING YET
         */
        get: function () {
            return rect_1.default.create(this.body.getBoundingClientRect(), true).grow(-5, -5);
        },
        enumerable: false,
        configurable: true
    });
    return FlowEnd;
}(terminational_1.default));
exports.default = FlowEnd;
