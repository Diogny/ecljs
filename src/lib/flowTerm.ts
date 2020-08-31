import { attr } from "dabbjs/dist/lib/dab";
import Size from "dabbjs/dist/lib/size";
import Rect from "dabbjs/dist/lib/rect";
//
import { IFlowTermDefaults } from "./interfaces";
import Flowchart from "./flowchart";
import FlowComp from "./flowComp";
import { flowNodes } from "./extra";

export default abstract class FlowTerminational extends FlowComp {

	protected $: IFlowTermDefaults;

	/**
	* contains the main frame body, where full component size can be calculated
	*/
	get body(): SVGElement { return this.$.path }

	/**
	 * client rect where text should be safely contained
	 */
	get clientRect(): Rect {
		let
			s = this.size;
		return (new Rect(0, 0, s.width | 0, s.height | 0)).grow(-this.$.curve, -this.$.padding)
	}

	constructor(flowchart: Flowchart, options: { [x: string]: any; }) {
		super(flowchart, options);
		this.$.path = <SVGPathElement>this.g.firstElementChild;
		this.onResize(this.size)
	}

	/**
	 * @description refreshes flowchart location, size, and updates bonded cmoponents
	 */
	public refresh(): FlowTerminational {
		let
			h = this.size.height,
			h2 = h / 2 | 0,
			c = this.$.curve,
			w = this.size.width,
			c2 = w - c;
		attr(this.$.path, {
			d: `M ${c},0 H${c2} C ${c2},0 ${w},${h2} ${c2},${h} H${c} C ${c},${h} 0,${h2} ${c},0 Z`
		});
		return super.refresh(), this
	}

	/**
	 * @description perform node readjustment, it calls this.refresh() function
	 * @param size new size
	 */
	public onResize(size: Size): void {
		let
			list = this.$.nodes,
			xs = (this.$.curve = this.size.height / 4 | 0) / 2 | 0;
		flowNodes(list, size);
		list[1].x -= xs;
		list[3].x = xs;
		this.refresh()
	}

}