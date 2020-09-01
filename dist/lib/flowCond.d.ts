import Rect from "dabbjs/dist/lib/rect";
import { IFlowCondDefaults } from "./interfaces";
import FlowComp from "./flowComp";
import Flowchart from "./flowchart";
export default class FlowConditional extends FlowComp {
    protected $: IFlowCondDefaults;
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
     * @description this happens after component was inserted in the DOM
     */
    onDOM(): void;
    setVisible(value: boolean): FlowConditional;
    /**
     * removes this flowchart conditional from the board
     */
    remove(): void;
    /**
     * @description link a condition label to a node
     * @param cond true for true label, false for false label
     * @param node 0-base node, or -1 to unlink/hide
     */
    setLabel(cond: boolean, node: number): void;
    /**
     * @description returns the node associated with a label
     * @param cond true for true label, false for false label
     * @returns 0-based node, or -1 if it's not linked
     */
    nodeLabel(cond: boolean): number;
    /**
     * @description refreshes flowchart location, size, and updates bonded cmoponents
     */
    refresh(): FlowConditional;
}
