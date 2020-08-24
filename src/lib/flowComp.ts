import { Type, IComponentProperty, IPoint, IItemSolidDefaults } from "./interfaces";
import { extend } from "./dab";
import Size from "./size";
import ItemSolid from "./itemSolid";
import Flowchart from "./flowchart";

/**
 * @description flowchart base component class
 */
export default abstract class FlowComp extends ItemSolid {

	get type(): Type { return Type.FLOWCHART }

	get size(): Size {
		return <Size>Size.parse(<string>this.prop("size"))
	}
	set size(value: Size) {
		if (value.equal(this.size))
			return;
		(<string>(<IComponentProperty>this.prop("size")).value) = `${value.width},${value.height}`;
		this.onResize(value)
	}

	abstract onResize(size: Size): void;

	get inputs(): number { return <number>this.prop("inputs") }
	get outputs(): number { return <number>this.prop("outputs") }

	constructor(flowchart: Flowchart, options: { [x: string]: any; }) {
		super(flowchart, options);
		this.refresh()
	}

	public setNode(node: number, p: IPoint): FlowComp {
		//nobody should call this
		return this;
	}

	public defaults(): IItemSolidDefaults {
		return <IItemSolidDefaults>extend(super.defaults(), {
			class: "fl",
			dir: true,
		})
	}
}