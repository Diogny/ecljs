import { attr } from "dabbjs/dist/lib/dab";
import Rect from "dabbjs/dist/lib/rect";
import { IFlowCondDefaults } from "./interfaces";
import FlowComp from "./flowComp";
import Flowchart from "./flowchart";

export default class FlowConditional extends FlowComp {

	protected $: IFlowCondDefaults;

	/**
	* contains the main frame body, where full component size can be calculated
	*/
	get body(): SVGElement { return this.$.path }

	/**
	 * client rect where text should be safely contained
	 */
	get clientRect(): Rect {
		let
			s = this.size,
			r = new Rect(0, 0, s.width | 0, s.height | 0),
			sw = r.width / 4 | 0,
			sh = r.height / 4 | 0;
		return r.grow(-sw - this.$.padding, -sh - this.$.padding)
	}

	constructor(flowchart: Flowchart, options: { [x: string]: any; }) {
		super(flowchart, options);
		this.$.path = <SVGPathElement>this.g.firstElementChild;
		this.onResize(this.size)
	}

	/**
	 * @description refreshes flowchart location, size, and updates bonded cmoponents
	 */
	public refresh(): FlowConditional {
		let
			w = this.size.width / 2 | 0,
			h = this.size.height / 2 | 0;
		attr(this.$.path, {
			d: `M ${w},0 L ${this.size.width},${h} L ${w},${this.size.height} L 0,${h} Z`
		});
		return super.refresh(), this
	}

}