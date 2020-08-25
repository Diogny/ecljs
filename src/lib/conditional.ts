import { IFlowCondDefaults } from "./interfaces";
import FlowComp from "./flowComp";
import Flowchart from "./flowchart";
import { attr } from "./dab";
import Size from "./size";
import { flowNodes } from "./utils";

export default class FlowConditional extends FlowComp {

	protected $: IFlowCondDefaults;

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