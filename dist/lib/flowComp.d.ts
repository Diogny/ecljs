import Size from "dabbjs/dist/lib/size";
import Rect from "dabbjs/dist/lib/rect";
import { Type, IFlowChartDefaults, INodeInfo } from "./interfaces";
import Flowchart from "./flowchart";
import ItemBoard from "./itemsBoard";
/**
 * @description flowchart base component class
 */
export default abstract class FlowComp extends ItemBoard {
    protected $: IFlowChartDefaults;
    get type(): Type;
    get last(): number;
    get count(): number;
    get minSize(): Size;
    get size(): Size;
    /**
     * body frame, has the real size of component
     */
    abstract get body(): SVGElement;
    /**
     * client rect where text should be safely contained
     */
    abstract get clientRect(): Rect;
    /**
     * @description resize the flowchart component
     * @param value new size
     * @returns true if it was resized, false otherwise
     */
    setSize(value: Size): boolean;
    /**
     * @description every descendant must implement it's own custom node readjustment
     * @param size new size
     */
    abstract onResize(size: Size): void;
    /**
     * @description maximum inbounds
     */
    get inputs(): number;
    /**
     * @description current inbounds
     */
    get ins(): number;
    /**
     * @description maximum outbounds
     */
    get outputs(): number;
    /**
     * @description current outbounds
     */
    get outs(): number;
    /**
     * SVG text, changing SVG text x's value, must change all inside tspan x's values too
     */
    get svgText(): SVGTextElement;
    get text(): string;
    set text(value: string);
    get fontSize(): number;
    set fontSize(value: number);
    constructor(flowchart: Flowchart, options: {
        [x: string]: any;
    });
    /**
     * @description returns the node information
     * @param node 0-based pin/node number
     * @param onlyPoint true to get internal point, false get the real board point
     *
     * this returns (x, y) relative to the EC location
     */
    node(node: number, nodeOnly?: boolean): INodeInfo | undefined;
    refresh(): FlowComp;
    defaults(): IFlowChartDefaults;
}
