"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var container_1 = tslib_1.__importDefault(require("./container"));
var flowComp_1 = tslib_1.__importDefault(require("./flowComp"));
var process_1 = tslib_1.__importDefault(require("./process"));
var flowCond_1 = tslib_1.__importDefault(require("./flowCond"));
var flowstart_1 = tslib_1.__importDefault(require("./flowstart"));
var flowend_1 = tslib_1.__importDefault(require("./flowend"));
var flowInOut_1 = tslib_1.__importDefault(require("./flowInOut"));
var extra_1 = require("./extra");
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
                return new flowCond_1.default(this, options);
            case "start":
                return new flowstart_1.default(this, options);
            case "end":
                return new flowend_1.default(this, options);
            case "inout":
                return new flowInOut_1.default(this, options);
            default:
                throw "unknown flowchart";
        }
    };
    Flowchart.prototype.bond = function (thisObj, thisNode, ic, icNode) {
        if (!this.hasItem(thisObj.id) || !this.hasItem(ic.id))
            return false;
        //directional components can only be connected to other directional components or wires
        //directional components have a specific amount of origin|destination bonds
        var thisFlow, icFlow;
        if (((thisFlow = thisObj instanceof flowComp_1.default) && thisObj.outs >= thisObj.outputs)
            || ((icFlow = ic instanceof flowComp_1.default) && ic.ins >= ic.inputs)) {
            return false;
        }
        else if (this.bondOneWay(thisObj, thisNode, ic, icNode, 0) // from A to B
            && this.bondOneWay(ic, icNode, thisObj, thisNode, 1)) // back B to A
         {
            //internal hack
            thisFlow && (thisObj.$.outs++);
            icFlow && (ic.$.ins++);
            return true;
        }
        return false;
    };
    Flowchart.prototype.unbond = function (thisObj, node, id) {
        var dir = _super.prototype.unbond.call(this, thisObj, node, id);
        if (dir != undefined) {
            var icId = extra_1.getItem(this, id);
            decrement(dir, thisObj, thisObj instanceof flowComp_1.default, icId.t, icId.t instanceof flowComp_1.default);
            return dir;
        }
    };
    Flowchart.prototype.unbondNode = function (thisObj, node) {
        var _this = this;
        var bond = _super.prototype.unbondNode.call(this, thisObj, node);
        if (bond != undefined) {
            var objflow_1 = thisObj instanceof flowComp_1.default, dir_1 = bond.dir;
            //the should be only one connection for flowcharts
            bond.ids.forEach(function (id) {
                var icId = extra_1.getItem(_this, id);
                decrement(dir_1, thisObj, objflow_1, icId.t, icId.t instanceof flowComp_1.default);
            });
        }
        return bond;
    };
    return Flowchart;
}(container_1.default));
exports.default = Flowchart;
function decrement(dir, obj, objFlow, ic, icFlow) {
    var propName = function (direction) { return direction == 0 ? "outs" : "ins"; };
    if (objFlow) {
        obj.$[propName(dir)]--;
    }
    else if (icFlow) {
        ic.$[propName((dir ^ 1))]--;
    }
}
