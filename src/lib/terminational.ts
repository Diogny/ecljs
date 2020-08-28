import Size from "dabbjs/dist/lib/size";
import FlowComp from "./flowComp";

export default abstract class FlowTerminational extends FlowComp {

	// public onResize(size: Size): void {
	// 	//(<string>(<IComponentProperty>this.prop("position")).value) = `${value.x},${value.y}`
	// 	//(<number><unknown>(<IComponentProperty>this.prop("fontSize")).value) = 18

	// 	//resize component

	public onResize(size: Size): void {
		//all descendants must implement this function
		throw `no resize implemented`
	}

	// }
}