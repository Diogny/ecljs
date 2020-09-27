import { attr } from "dabbjs/dist/lib/dab";
import Rect from "dabbjs/dist/lib/rect";
import { IFlowProcessDefaults } from "./interfaces";
import FlowComp from "./flowComp";
import Flowchart from "./flowchart";

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
			s = this.size;
		return (new Rect(0, 0, s.width | 0, s.height | 0)).grow(-this.$.padding, -this.$.padding)
	}

	constructor(flowchart: Flowchart, options: { [x: string]: any; }) {
		super(flowchart, options);
		this.$.rect = <SVGRectElement>this.g.firstElementChild;
		this.onResize(this.size)
	}

	/**
	 * @description refreshes flowchart location, size, and updates bonded cmoponents
	 */
	public refresh(): FlowProcess {
		attr(<any>this.$.rect, {
			width: this.size.width,
			height: this.size.height
		});
		return super.refresh(), this
	}

}