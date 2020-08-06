"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const container_1 = tslib_1.__importDefault(require("./container"));
const process_1 = tslib_1.__importDefault(require("./process"));
const conditional_1 = tslib_1.__importDefault(require("./conditional"));
class Flowchart extends container_1.default {
    get name() { return "Flowchart"; }
    get library() { return "flowchart"; }
    get directionalWires() { return true; }
    createItem(options) {
        switch (options.name) {
            case "process":
                return new process_1.default(this, options);
            case "conditional":
                return new conditional_1.default(this, options);
            default:
                throw `unknown flowchart`;
        }
    }
    bond(thisObj, thisNode, ic, icNode) {
        if (!this.hasComponent(thisObj.id) || !this.hasComponent(ic.id))
            return false;
        //directional components can only be connected to other directional components or wires
        //directional components have only ONE origin|destination bond in any node
        return this.bondSingle(thisObj, thisNode, ic, icNode, true)
            && this.bondSingle(ic, icNode, thisObj, thisNode, false);
    }
    getXML() {
        return "";
    }
}
exports.default = Flowchart;
