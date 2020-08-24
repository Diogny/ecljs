import Container from "./container";
import FlowComp from "./flowComp";
import FlowProcess from "./process";
import Wire from "./wire";
import FlowConditional from "./conditional";

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
			default:
				throw `unknown flowchart`
		}
	}

	public bond(thisObj: FlowComp | Wire, thisNode: number, ic: FlowComp | Wire, icNode: number): boolean {
		if (!this.hasItem(thisObj.id) || !this.hasItem(ic.id))
			return false;
		//directional components can only be connected to other directional components or wires
		//directional components have only ONE origin|destination bond in any node

		return this.bondOneWay(thisObj, thisNode, ic, icNode, true)
			&& this.bondOneWay(ic, icNode, thisObj, thisNode, false)
	}

}