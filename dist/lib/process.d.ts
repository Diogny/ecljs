import Size from "dabbjs/dist/lib/size";
import Rect from "dabbjs/dist/lib/rect";
import { IFlowProcessDefaults } from "./interfaces";
import FlowComp from "./flowComp";
import Flowchart from "./flowchart";
export default class FlowProcess extends FlowComp {
    protected $: IFlowProcessDefaults;
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
    refresh(): FlowProcess;
    onResize(size: Size): void;
}
