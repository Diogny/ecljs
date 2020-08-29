import { attr } from "dabbjs/dist/lib/dab";
import Size from "dabbjs/dist/lib/size";
import Rect from "dabbjs/dist/lib/rect";
import { IFlowInOutDefaults } from "./interfaces";
import FlowComp from "./flowComp";
import Flowchart from "./flowchart";
import { flowNodes } from "./extra";

export default class FlowInOut extends FlowComp {

	protected $: IFlowInOutDefaults;	//reuse, later if needed add it's own interface

	/**
	* contains the main frame body, where full component size can be calculated
	*/
	get body(): SVGElement { return this.$.path }

	/**
	 * client rect where text should be safely contained
	 */
	get clientRect(): Rect {
		let
			r = this.body.getBoundingClientRect();
		return (new Rect(0, 0, r.width | 0, r.height | 0)).grow(-this.$.shift, -this.$.padding)
	}

	constructor(flowchart: Flowchart, options: { [x: string]: any; }) {
		super(flowchart, options);
		//get path, hould be this.g.firstChild
		this.$.path = <SVGPathElement>this.g.firstElementChild;
		//refresh nodes
		this.onResize(this.size);
		this.refresh()
	}

	public refresh(): FlowInOut {
		let
			h = this.size.height,
			s = this.$.shift = h / 4 | 0,
			w = this.size.width,
			s2 = w - s;
		attr(this.$.path, {
			d: `M ${s},0 H${w} L${s2},${h} H0 Z`
		});
		//later text resize goes here
		//...
		return super.refresh(), this
	}

	public onResize(size: Size): void {
		let
			list = this.$.nodes,
			xs = this.$.shift / 2 | 0;
		flowNodes(list, size);
		list[1].x -= xs;
		list[3].x = xs
	}
}

//IFlowInOutDefaults