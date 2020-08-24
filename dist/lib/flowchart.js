"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var container_1 = tslib_1.__importDefault(require("./container"));
var process_1 = tslib_1.__importDefault(require("./process"));
var conditional_1 = tslib_1.__importDefault(require("./conditional"));
/**
 * @description Flowchart component container
 */
var Flowchart = /** @class */ (function (_super) {
    tslib_1.__extends(Flowchart, _super);
    function Flowchart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(Flowchart.prototype, "name", {
        get: function () { return "flowchart"; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Flowchart.prototype, "dir", {
        get: function () { return true; },
        enumerable: false,
        configurable: true
    });
    Flowchart.prototype.createItem = function (options) {
        switch (options.name) {
            case "proc":
                return new process_1.default(this, options);
            case "cond":
                return new conditional_1.default(this, options);
            default:
                throw "unknown flowchart";
        }
    };
    Flowchart.prototype.bond = function (thisObj, thisNode, ic, icNode) {
        if (!this.hasItem(thisObj.id) || !this.hasItem(ic.id))
            return false;
        //directional components can only be connected to other directional components or wires
        //directional components have only ONE origin|destination bond in any node
        return this.bondOneWay(thisObj, thisNode, ic, icNode, 0) // from A to B
            && this.bondOneWay(ic, icNode, thisObj, thisNode, 1); // back B to A
    };
    return Flowchart;
}(container_1.default));
exports.default = Flowchart;
