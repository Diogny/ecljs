import Size from "dabbjs/dist/lib/size";
import Rect from "dabbjs/dist/lib/rect";
import { IFlowTermDefaults } from "./interfaces";
import Flowchart from "./flowchart";
import FlowComp from "./flowComp";
export default abstract class FlowTerminational extends FlowComp {
    protected $: IFlowTermDefaults;
    /**
    * contains the main frame body, where full component size can be calculated
    */
    get body(): SVGElement;
    /**
     * client rect where text should be safely contained
     */
    get clientRect(): Rect;
    constructor(flowchart: Flowchart, options: {
        [x: string]: any;
    });
    refresh(): FlowTerminational;
    onResize(size: Size): void;
}
