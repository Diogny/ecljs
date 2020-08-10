import Container from "./container";
import FlowchartComp from "./flowchartComp";
import FlowProcess from "./process";
import Wire from "./wire";
import FlowConditional from "./conditional";

export default class Flowchart extends Container<FlowchartComp>{

	get library(): string { return "flowchart" }
	get directional(): boolean { return true }

	public createItem(options: { [x: string]: any; }): FlowchartComp {
		switch (options.name) {
			case "process":
				return new FlowProcess(this, <any>options);
			case "conditional":
				return new FlowConditional(this, <any>options);
			default:
				throw `unknown flowchart`
		}
	}

	public bond(thisObj: FlowchartComp | Wire, thisNode: number, ic: FlowchartComp | Wire, icNode: number): boolean {
		if (!this.hasComponent(thisObj.id) || !this.hasComponent(ic.id))
			return false;
		//directional components can only be connected to other directional components or wires
		//directional components have only ONE origin|destination bond in any node

		return this.bondSingle(thisObj, thisNode, ic, icNode, true)
			&& this.bondSingle(ic, icNode, thisObj, thisNode, false)
	}

}