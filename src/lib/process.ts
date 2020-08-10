import { IComponentProperty } from "./interfaces";
import Point from "./point";
import Size from "./size";
import FlowchartComp from "./flowchartComp";

export default class FlowProcess extends FlowchartComp {

	get fontSize(): number { return <number>this.prop("fontSize") }

	get text(): string { return <string>this.prop("text") }
	public setText(value: string): FlowProcess {
		(<string>(<IComponentProperty>this.prop("text")).value) = value;

		return this
	}

	get position(): Point {
		let
			p = Point.parse(<string>this.prop("position"));
		if (p == undefined)
			throw `invalid Point`
		else return p;
	}

	public onResize(size: Size): void {
		//(<string>(<IComponentProperty>this.prop("position")).value) = `${value.x},${value.y}`
		//(<number><unknown>(<IComponentProperty>this.prop("fontSize")).value) = 18

		//resize component

	}
}