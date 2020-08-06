import {Type, IComponentProperty, IItemSolidOptions, IPoint, IItemBoardProperties } from "./interfaces";
import { extend } from "./dab";
import Size from "./size";
import ItemSolid from "./itemSolid";
import Container from "./container";

export default abstract class FlowchartComponent extends ItemSolid {

	get type(): Type { return Type.FLOWCHART }

	get size(): Size {
		let
			s = Size.parse(<string>this.prop("size"));
		if (s == undefined)
			throw `invalid Size`
		else return s;
	}
	set size(value: Size) {
		(<string>(<IComponentProperty>this.prop("size")).value) = `${value.width},${value.height}`;
		this.onResize(value)
	}

	abstract onResize(size: Size): void;

	get inputs(): number { return <number>this.prop("inputs") }
	get outputs(): number { return <number>this.prop("outputs") }

	constructor(container: Container<FlowchartComponent>, options: IItemSolidOptions) {
		super(container, options);
	}

	public setNode(node: number, p: IPoint): FlowchartComponent {
		//Some code tries to call this, investigate later...
		throw 'somebody called me, not good!';
	}
	
	public propertyDefaults(): IItemBoardProperties {
		return extend(super.propertyDefaults(), {
			directional: true,
		})
	}
}