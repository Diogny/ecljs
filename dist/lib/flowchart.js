"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var container_1 = tslib_1.__importDefault(require("./container"));
var process_1 = tslib_1.__importDefault(require("./process"));
var conditional_1 = tslib_1.__importDefault(require("./conditional"));
var Flowchart = /** @class */ (function (_super) {
    tslib_1.__extends(Flowchart, _super);
    function Flowchart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(Flowchart.prototype, "library", {
        get: function () { return "flowchart"; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Flowchart.prototype, "directional", {
        get: function () { return true; },
        enumerable: false,
        configurable: true
    });
    Flowchart.prototype.createItem = function (options) {
        switch (options.name) {
            case "process":
                return new process_1.default(this, options);
            case "conditional":
                return new conditional_1.default(this, options);
            default:
                throw "unknown flowchart";
        }
    };
    Flowchart.prototype.bond = function (thisObj, thisNode, ic, icNode) {
        if (!this.hasComponent(thisObj.id) || !this.hasComponent(ic.id))
            return false;
        //directional components can only be connected to other directional components or wires
        //directional components have only ONE origin|destination bond in any node
        return this.bondSingle(thisObj, thisNode, ic, icNode, true)
            && this.bondSingle(ic, icNode, thisObj, thisNode, false);
    };
    return Flowchart;
}(container_1.default));
exports.default = Flowchart;
