"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const interfaces_1 = require("./interfaces");
const dab_1 = require("./dab");
const size_1 = tslib_1.__importDefault(require("./size"));
const itemSolid_1 = tslib_1.__importDefault(require("./itemSolid"));
class FlowchartComponent extends itemSolid_1.default {
    get type() { return interfaces_1.Type.FLOWCHART; }
    get size() {
        let s = size_1.default.parse(this.prop("size"));
        if (s == undefined)
            throw `invalid Size`;
        else
            return s;
    }
    set size(value) {
        this.prop("size").value = `${value.width},${value.height}`;
        this.onResize(value);
    }
    get inputs() { return this.prop("inputs"); }
    get outputs() { return this.prop("outputs"); }
    constructor(container, options) {
        super(container, options);
    }
    setNode(node, p) {
        //Some code tries to call this, investigate later...
        throw 'somebody called me, not good!';
    }
    propertyDefaults() {
        return dab_1.extend(super.propertyDefaults(), {
            directional: true,
        });
    }
}
exports.default = FlowchartComponent;
