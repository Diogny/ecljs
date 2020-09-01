import Container from "./container";
import FlowComp from "./flowComp";
import FlowProcess from "./process";
import Wire from "./wire";
import FlowConditional from "./flowCond";
import FlowStart from "./flowstart";
import FlowEnd from "./flowend";
import FlowInOut from "./flowInOut";
import { BondDir, ContainerMapType, IUnbondNodeData, IUnbondData } from "./interfaces";
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

	public unbond(thisObj: FlowComp | Wire, node: number, id: string): IUnbondData | undefined {
		let
			data = super.unbond(thisObj, node, id);
		if (data != undefined) {
			let
				icId = <ContainerMapType<FlowComp | Wire>>getItem(this, id);
			decrement(<IUnbondData>data, thisObj, thisObj instanceof FlowComp, icId.t, icId.t instanceof FlowComp);
			return data
		}
	}

	/**
	 * @description fully unbonds a component node
	 * @param thisObj component
	 * @param node 0-base node
	 * @returns an structure with unbonded information
	 */
	public unbondNode(thisObj: FlowComp | Wire, node: number): IUnbondNodeData | undefined {
		let
			res = super.unbondNode(thisObj, node);
		if (res != undefined) {
			let
				objflow = thisObj instanceof FlowComp,
				data = <IUnbondData>{
					dir: res.dir,
					id: res.id,
					node: res.node
				};
			//the should be only one connection for flowcharts
			res.bonds.forEach((obj) => {
				let
					icId = <ContainerMapType<FlowComp | Wire>>getItem(this, obj.id);
				data.toId = obj.id;
				data.toNode = obj.node;
				decrement(data, thisObj, objflow, icId.t, icId.t instanceof FlowComp)
			})
		}
		return res
	}

}

function decrement(data: IUnbondData, obj: FlowComp | Wire, objFlow: boolean, ic: FlowComp | Wire, icFlow: boolean) {
	let
		propName = (direction: BondDir) => direction == 0 ? "outs" : "ins",
		condLabel = (fl: FlowConditional, node: number) => {
			if (!(fl instanceof FlowConditional))
				return;
			let
				nodeLabel = fl.nodeLabel(false);
			if (nodeLabel == node) {
				fl.setLabel(false, -1)
			} else if ((nodeLabel = fl.nodeLabel(true)) == node) {
				fl.setLabel(true, -1)
			}
		};
	if (objFlow) {
		(<any>obj).$[propName(data.dir)]--;
		condLabel(<FlowConditional>obj, data.node)
	}
	else if (icFlow) {
		(<any>ic).$[propName(<BondDir>(data.dir ^ 1))]--;
		condLabel(<FlowConditional>ic, data.toNode)
	}
}