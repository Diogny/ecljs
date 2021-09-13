"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const ec_1 = (0, tslib_1.__importDefault)(require("./ec"));
const container_1 = (0, tslib_1.__importDefault)(require("./container"));
/**
 * @description Circuits component container
 */
class Circuit extends container_1.default {
    get name() { return "circuit"; }
    get dir() { return false; }
    get ec() {
        return !this.selected.length ? void 0 : this.selected[0];
    }
    /**
     * @description creates a circuit compoents
     * @param options dictionary of options
     */
    createItem(options) {
        return new ec_1.default(this, options);
    }
}
exports.default = Circuit;
