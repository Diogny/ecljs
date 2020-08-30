import Container from "./container";
import FlowComp from "./flowComp";
import FlowProcess from "./process";
import Wire from "./wire";
import FlowConditional from "./flowCond";
import FlowStart from "./flowstart";
import FlowEnd from "./flowend";
import FlowInOut from "./flowInOut";
import { BondDir, ContainerMapType } from "./interfaces";
import { getItem } from "./extra";

/**
 * @description Flowchart component container
 */
export default class Flowchart extends Container<FlowComp>{

	get name(): string { return "flowchart" }
	get dir(): boolean { return true }

	public createItem(options: { [x: string]: any; }): FlowComp {
		switch (options.name) {
			case "proc":
				return new FlowProcess(this, <any>options);
			case "cond":
				return new FlowConditional(this, <any>options);
			case "start":
				return new FlowStart(this, <any>options);
			case "end":
				return new FlowEnd(this, <any>options);
			case "inout":
				return new FlowInOut(this, <any>options);
			default:
				throw `unknown flowchart`
		}
	}

	public bond(thisObj: FlowComp | Wire, thisNode: number, ic: FlowComp | Wire, icNode: number): boolean {
		if (!this.hasItem(thisObj.id) || !this.hasItem(ic.id))
			return false;
		//directional components can only be connected to other directional components or wires
		//directional components have a specific amount of origin|destination bonds
		let
			thisFlow: boolean,
			icFlow: boolean;

		if (((thisFlow = thisObj instanceof FlowComp) && thisObj.outs >= thisObj.outputs)
			|| ((icFlow = ic instanceof FlowComp) && ic.ins >= ic.inputs)) {
			return false
		}
		else if (this.bondOneWay(thisObj, thisNode, ic, icNode, 0)		// from A to B
			&& this.bondOneWay(ic, icNode, thisObj, thisNode, 1))		// back B to A
		{
			//internal hack
			thisFlow && ((<any>thisObj).$.outs++);
			icFlow && ((<any>ic).$.ins++);
			return true
		}
		return false
	}

	public unbond(thisObj: FlowComp | Wire, node: number, id: string): BondDir | undefined {
		let
			dir = super.unbond(thisObj, node, id);
		if (dir != undefined) {
			let
				icId = <ContainerMapType<FlowComp | Wire>>getItem(this, id);
			decrement(dir, thisObj, thisObj instanceof FlowComp, icId.t, icId.t instanceof FlowComp);
			return dir
		}
	}

	public unbondNode(thisObj: FlowComp | Wire, node: number): { dir: BondDir, ids: string[] } | undefined {
		let
			bond = super.unbondNode(thisObj, node);
		if (bond != undefined) {
			let
				objflow = thisObj instanceof FlowComp,
				dir = bond.dir;
			//the should be only one connection for flowcharts
			bond.ids.forEach(id => {
				let
					icId = <ContainerMapType<FlowComp | Wire>>getItem(this, id);
				decrement(dir, thisObj, objflow, icId.t, icId.t instanceof FlowComp)
			})
		}
		return bond
	}

}

function decrement(dir: BondDir, obj: FlowComp | Wire, objFlow: boolean, ic: FlowComp | Wire, icFlow: boolean) {
	let
		propName = (direction: BondDir) => direction == 0 ? "outs" : "ins";
	if (objFlow) {
		(<any>obj).$[propName(dir)]--;
	}
	else if (icFlow) {
		(<any>ic).$[propName(<BondDir>(dir ^ 1))]--;
	}
}