import FlowchartComp from "./flowchartComp";
import Size from "./size";

export default abstract class FlowTerminational extends FlowchartComp {

	public onResize(size: Size): void {
		//(<string>(<IComponentProperty>this.prop("position")).value) = `${value.x},${value.y}`
		//(<number><unknown>(<IComponentProperty>this.prop("fontSize")).value) = 18

		//resize component

	}
}