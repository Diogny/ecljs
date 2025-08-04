import { Container } from "./container";
import { FlowComp } from "./flowComp";
import { FlowProcess } from "./process";
import { FlowConditional } from "./flowCond";
import { FlowStart } from "./flowstart";
import { FlowEnd } from "./flowend";
import { FlowInOut } from "./flowInOut";
import { getItem } from "./extra";
import { extend } from "dabbjs/dist/lib/misc";
/**
 * @description Flowchart component container
 */
export class Flowchart extends Container {
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
                return new FlowProcess(this, options);
            case "cond":
                return new FlowConditional(this, options);
            case "start":
                return new FlowStart(this, options);
            case "end":
                return new FlowEnd(this, options);
            case "inout":
                return new FlowInOut(this, options);
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
        if (((thisFlow = thisObj instanceof FlowComp) && thisObj.outs >= thisObj.outputs)
            || ((icFlow = ic instanceof FlowComp) && ic.ins >= ic.inputs)) {
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
            let icId = getItem(this.$, id);
            decrement(data, thisObj, thisObj instanceof FlowComp, icId.t, icId.t instanceof FlowComp);
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
            let objflow = thisObj instanceof FlowComp, data = {
                dir: res.dir,
                id: res.id,
                node: res.node
            };
            //the should be only one connection for flowcharts
            res.bonds.forEach((obj) => {
                let icId = getItem(this.$, obj.id);
                data.toId = obj.id;
                data.toNode = obj.node;
                decrement(data, thisObj, objflow, icId.t, icId.t instanceof FlowComp);
            });
        }
        return res;
    }
    defaults() {
        return extend(super.defaults(), {
            reSizePolicy: "expand",
        });
    }
}
function decrement(data, obj, objFlow, ic, icFlow) {
    let propName = (direction) => direction == 0 ? "outs" : "ins", condLabel = (fl, node) => {
        if (!(fl instanceof FlowConditional))
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
