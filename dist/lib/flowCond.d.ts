import Rect from "dabbjs/dist/lib/rect";
import { IFlowCondDefaults } from "./interfaces";
import FlowComp from "./flowComp";
import Flowchart from "./flowchart";
import ConditionalLabel from "./flowCondLabel";
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
    remove(): void;
    /**
     * @description link a condition label to a node
     * @param cond true for true label, false for false label
     * @param node 0-base node, or -1 to unlink/hide
     */
    setLabel(cond: boolean, node: number): void;
    /**
     * @description gets label associated with a Condition
     * @param cond true for true label, false for false label
     */
    getLabel(cond: boolean): ConditionalLabel | undefined;
    /**
     * @description refreshes flowchart location, size, and updates bonded cmoponents
     */
    refresh(): FlowConditional;
}
