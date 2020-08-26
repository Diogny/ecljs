import { IFlowCondDefaults } from "./interfaces";
import FlowComp from "./flowComp";
import Flowchart from "./flowchart";
import { attr } from "./dab";
import Size from "./size";
import { flowNodes } from "./utils";
import Rect from "./rect";

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
			r = Rect.create(this.body.getBoundingClientRect(), true),
			sw = r.width / 4 | 0,
			sh = r.height / 4 | 0;
		return r.grow(-sw, -sh).translate(sw - this.$.padding, sh - this.$.padding)
	}

	constructor(flowchart: Flowchart, options: { [x: string]: any; }) {
		super(flowchart, options);
		//get path, hould be this.g.firstChild
		this.$.path = <SVGPathElement>this.g.firstElementChild;
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