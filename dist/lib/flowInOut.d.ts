import { Size } from "dabbjs/dist/lib/size";
import { Rect } from "dabbjs/dist/lib/rect";
import { IFlowInOutDefaults } from "./interfaces";
import { FlowComp } from "./flowComp";
import { Flowchart } from "./flowchart";
export declare class FlowInOut extends FlowComp {
    protected $: IFlowInOutDefaults;
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
    /**
     * @description refreshes flowchart location, size, and updates bonded cmoponents
     */
    refresh(): FlowInOut;
    /**
     * @description perform node readjustment, it calls refresh() function
     * @param size new size
     */
    onResize(size: Size): void;
}
