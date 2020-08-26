import { IFlowProcessDefaults } from "./interfaces";
import FlowComp from "./flowComp";
import Flowchart from "./flowchart";
import { attr } from "./dab";
import Size from "./size";
import { flowNodes } from "./utils";
import Rect from "./rect";

export default class FlowProcess extends FlowComp {

	protected $: IFlowProcessDefaults;

	/**
	 * contains the main frame body, where full component size can be calculated
	 */
	get body(): SVGElement { return this.$.rect }

	/**
	 * client rect where text should be safely contained
	 */
	get clientRect(): Rect {
		return Rect.create(this.body.getBoundingClientRect(), true).grow(-this.$.padding, -this.$.padding)
	}

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