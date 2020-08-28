import { attr } from "dabbjs/dist/lib/dab";
import Size from "dabbjs/dist/lib/size";
import Rect from "dabbjs/dist/lib/rect";
import { IFlowCondDefaults } from "./interfaces";
import FlowComp from "./flowComp";
import Flowchart from "./flowchart";
import { flowNodes } from "./extra";

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
			dom = this.body.getBoundingClientRect(),
			r = new Rect(0, 0, dom.width | 0, dom.height | 0),
			sw = r.width / 4 | 0,
			sh = r.height / 4 | 0;
		return r.grow(-sw - this.$.padding, -sh - this.$.padding)
	}

	constructor(flowchart: Flowchart, options: { [x: string]: any; }) {
		super(flowchart, options);
		//get path, hould be this.g.firstChild
		this.$.path = <SVGPathElement>this.g.firstElementChild;
		//refresh nodes
		this.onResize(this.size);
		this.refresh()
	}

	public refresh(): FlowConditional {
		//calculate rect
		let
			w = this.size.width / 2 | 0,
			h = this.size.height / 2 | 0;
		attr(this.$.path, {
			d: `M ${w},0 L ${this.size.width},${h} L ${w},${this.size.height} L 0,${h} Z`
		});
		//later text resize goes here
		//...
		return super.refresh(), this
	}

	public onResize(size: Size): void {
		flowNodes(this.base.meta.nodes.list, size)
	}
}