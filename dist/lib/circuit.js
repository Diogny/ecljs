"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var ec_1 = tslib_1.__importDefault(require("./ec"));
var container_1 = tslib_1.__importDefault(require("./container"));
/**
 * @description Circuits component container
 */
var Circuit = /** @class */ (function (_super) {
    tslib_1.__extends(Circuit, _super);
    function Circuit() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(Circuit.prototype, "name", {
        get: function () { return "circuit"; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Circuit.prototype, "dir", {
        get: function () { return false; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Circuit.prototype, "ec", {
        get: function () {
            return !this.selected.length ? void 0 : this.selected[0];
        },
        enumerable: false,
        configurable: true
    });
    Circuit.prototype.createItem = function (options) {
        return new ec_1.default(this, options);
    };
    return Circuit;
}(container_1.default));
exports.default = Circuit;
