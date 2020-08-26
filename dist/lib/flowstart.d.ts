import FlowTerminational from "./terminational";
import Rect from "./rect";
export default class FlowStart extends FlowTerminational {
    /**
     * contains the main frame body, where full component size can be calculated
     *
     * NOT WORKING YET
     */
    get body(): SVGElement;
    /**
     * client rect where text should be safely contained
     *
     * NOT WORKING YET
     */
    get clientRect(): Rect;
}
