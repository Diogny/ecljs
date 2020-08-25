import { IFlowProcessDefaults } from "./interfaces";
import FlowComp from "./flowComp";
import Flowchart from "./flowchart";
import { attr } from "./dab";
import Size from "./size";
import { flowNodes } from "./utils";

export default class FlowProcess extends FlowComp {

	protected $: IFlowProcessDefaults;

	constructor(flowchart: Flowchart, options: { [x: string]: any; }) {
		super(flowchart, options);
		//get rect, should be this.g.firstChild
		this.$.rect = <SVGRectElement>this.g.firstElementChild;
		this.refresh()
	}

	public refresh(): FlowProcess {
		//calculate rect
		attr(this.$.rect, {
			width: this.size.width,
			height: this.size.height
		});
		//later text resize goes here
		//...
		return super.refresh(), this
	}

	public onResize(size: Size): void {
		flowNodes(this.base.meta.nodes.list, size)
	}

}