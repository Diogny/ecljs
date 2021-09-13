"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const container_1 = (0, tslib_1.__importDefault)(require("./container"));
const flowComp_1 = (0, tslib_1.__importDefault)(require("./flowComp"));
const process_1 = (0, tslib_1.__importDefault)(require("./process"));
const flowCond_1 = (0, tslib_1.__importDefault)(require("./flowCond"));
const flowstart_1 = (0, tslib_1.__importDefault)(require("./flowstart"));
const flowend_1 = (0, tslib_1.__importDefault)(require("./flowend"));
const flowInOut_1 = (0, tslib_1.__importDefault)(require("./flowInOut"));
const extra_1 = require("./extra");
const misc_1 = require("dabbjs/dist/lib/misc");
/**
 * @description Flowchart component container
 */
class Flowchart extends container_1.default {
    get name() { return "flowchart"; }
    get dir() { return true; }
    /**
     * Returns the resize policy for this flowchart container
     */
    get reSizePolicy() { return this.$.reSizePolicy; }
    /**
     * @description creates a flowchart component
     * @param options customizable options
     */
    createItem(options) {
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
                throw new Error(`unknown flowchart`);
        }
    }
    bond(thisObj, thisNode, ic, icNode) {
        if (!this.hasItem(thisObj.id) || !this.hasItem(ic.id))
            return false;
        //directional components can only be connected to other directional components or wires
        //directional components have a specific amount of origin|destination bonds
        let thisFlow, icFlow;
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
    }
    unbond(thisObj, node, id) {
        let data = super.unbond(thisObj, node, id);
        if (data != undefined) {
            let icId = (0, extra_1.getItem)(this.$, id);
            decrement(data, thisObj, thisObj instanceof flowComp_1.default, icId.t, icId.t instanceof flowComp_1.default);
            return data;
        }
        return;
    }
    /**
     * @description fully unbonds a component node
     * @param thisObj component
     * @param node 0-base node
     * @returns an structure with unbonded information
     */
    unbondNode(thisObj, node) {
        let res = super.unbondNode(thisObj, node);
        if (res != undefined) {
            let objflow = thisObj instanceof flowComp_1.default, data = {
                dir: res.dir,
                id: res.id,
                node: res.node
            };
            //the should be only one connection for flowcharts
            res.bonds.forEach((obj) => {
                let icId = (0, extra_1.getItem)(this.$, obj.id);
                data.toId = obj.id;
                data.toNode = obj.node;
                decrement(data, thisObj, objflow, icId.t, icId.t instanceof flowComp_1.default);
            });
        }
        return res;
    }
    defaults() {
        return (0, misc_1.extend)(super.defaults(), {
            reSizePolicy: "expand",
        });
    }
}
exports.default = Flowchart;
function decrement(data, obj, objFlow, ic, icFlow) {
    let propName = (direction) => direction == 0 ? "outs" : "ins", condLabel = (fl, node) => {
        if (!(fl instanceof flowCond_1.default))
            return;
        let nodeLabel = fl.nodeLabel(false);
        if (nodeLabel == node) {
            fl.setLabel(false, -1);
        }
        else if ((fl.nodeLabel(true)) == node) {
            fl.setLabel(true, -1);
        }
    };
    if (objFlow) {
        obj.$[propName(data.dir)]--;
        condLabel(obj, data.node);
    }
    else if (icFlow) {
        ic.$[propName((data.dir ^ 1))]--;
        condLabel(ic, data.toNode);
    }
}
//# sourceMappingURL=flowchart.js.map