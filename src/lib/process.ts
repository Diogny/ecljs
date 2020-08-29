import { attr } from "dabbjs/dist/lib/dab";
import Size from "dabbjs/dist/lib/size";
import Rect from "dabbjs/dist/lib/rect";
import { IFlowProcessDefaults } from "./interfaces";
import FlowComp from "./flowComp";
import Flowchart from "./flowchart";
import { flowNodes } from "./extra";

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
		let
			//r = this.body.getBoundingClientRect(),
			s = this.size;
		return (new Rect(0, 0, s.width | 0, s.height | 0)).grow(-this.$.padding, -this.$.padding)
	}

	constructor(flowchart: Flowchart, options: { [x: string]: any; }) {
		super(flowchart, options);
		//get rect, should be this.g.firstChild
		this.$.rect = <SVGRectElement>this.g.firstElementChild;
		//refresh nodes
		this.onResize(this.size);
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
		flowNodes(this.$.nodes, size)
	}

}