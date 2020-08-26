import FlowTerminational from "./terminational";
import Rect from "./rect";

export default class FlowEnd extends FlowTerminational {
	/**
		 * contains the main frame body, where full component size can be calculated
		 * 
		 * NOT WORKING YET
		 */
	get body(): SVGElement { return this.g }

	/**
	 * client rect where text should be safely contained
	 * 
	 * NOT WORKING YET
	 */
	get clientRect(): Rect {
		return Rect.create(this.body.getBoundingClientRect(), true).grow(-5, -5)
	}
}