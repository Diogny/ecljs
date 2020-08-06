"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const point_1 = tslib_1.__importDefault(require("./point"));
const flowchartComponent_1 = tslib_1.__importDefault(require("./flowchartComponent"));
class FlowProcess extends flowchartComponent_1.default {
    get fontSize() { return this.prop("fontSize"); }
    get text() { return this.prop("text"); }
    setText(value) {
        this.prop("text").value = value;
        return this;
    }
    get position() {
        let p = point_1.default.parse(this.prop("position"));
        if (p == undefined)
            throw `invalid Point`;
        else
            return p;
    }
    onResize(size) {
        //(<string>(<IComponentProperty>this.prop("position")).value) = `${value.x},${value.y}`
        //(<number><unknown>(<IComponentProperty>this.prop("fontSize")).value) = 18
        //resize component
    }
}
exports.default = FlowProcess;
