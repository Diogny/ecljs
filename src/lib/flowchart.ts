import { IPoint } from "./interfaces";
import Container from "./container";
import FlowchartComponent from "./flowchartComponent";
import FlowProcess from "./process";
import Wire from "./wire";
import FlowConditional from "./conditional";

export default class Flowchart extends Container<FlowchartComponent>{

	get name(): string { return "Flowchart" }
	get library(): string { return "flowchart" }
	get directionalWires(): boolean { return true }

	public createItem(options: { name: string, x: number, y: number, points: IPoint[] }): FlowchartComponent {
		switch (options.name) {
			case "process":
				return new FlowProcess(this, <any>options);
			case "conditional":
				return new FlowConditional(this, <any>options);
			default:
				throw `unknown flowchart`
		}
	}

	public bond(thisObj: FlowchartComponent | Wire, thisNode: number, ic: FlowchartComponent | Wire, icNode: number): boolean {
		if (!this.hasComponent(thisObj.id) || !this.hasComponent(ic.id))
			return false;
		//directional components can only be connected to other directional components or wires
		//directional components have only ONE origin|destination bond in any node

		return this.bondSingle(thisObj, thisNode, ic, icNode, true)
			&& this.bondSingle(ic, icNode, thisObj, thisNode, false)
	}

	public getXML(): string {
		return "";
	}
}